import os
import cv2
import json
import uuid
import vertexai
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from vertexai.generative_models import GenerativeModel, Part, Image
from ultralytics import YOLO

# ==========================================
# 1. Configuration & Initialization
# ==========================================
GCP_PROJECT_ID = "duyuthon-496901"  # GCP 프로젝트 ID
LOCATION = "us-central1"

# Vertex AI 초기화
vertexai.init(project=GCP_PROJECT_ID, location=LOCATION)
gemini_model = GenerativeModel("gemini-2.5-flash")

# FastAPI 앱 생성
app = FastAPI(title="Campus Energy Management API")

# 모델 전역 로드 (Cloud Run 인스턴스가 켜질 때 한 번만 메모리에 로드됨)
# 주의: ac_best.pt 파일을 models 폴더 안에 넣어두세요.
BASE_MODEL = YOLO("yolov8n.pt") 
AC_MODEL = YOLO("models/ac_best.pt")

# ==========================================
# 2. Gemini Analysis Functions
# ==========================================
def check_ac_and_light_with_gemini(original_img_path, crop_img_path):
    """에어컨이 발견되었을 때: 에어컨과 전등 상태 모두 파악"""
    original_part = Part.from_image(Image.load_from_file(original_img_path))
    crop_part = Part.from_image(Image.load_from_file(crop_img_path))
    
    prompt = """
    You are a building energy management AI.
    The first image is the full photo of a classroom. 
    The second image is a cropped close-up of a ceiling 4-way air conditioner.
    
    1. "ac_status": Look at the second image. If louvers are open or LED is on -> "ON", else -> "OFF".
    2. "light_status": Look at the first image's background. If ceiling indoor lights are on -> "ON", else -> "OFF".

    Respond STRICTLY in the following JSON format only:
    {
        "ac_status": "ON or OFF",
        "light_status": "ON or OFF",
        "reason": "Detailed reasoning"
    }
    """
    response = gemini_model.generate_content([original_part, crop_part, prompt])
    return response.text

def check_light_only_with_gemini(original_img_path):
    """에어컨이 발견되지 않았을 때: 전등 상태만 파악"""
    original_part = Part.from_image(Image.load_from_file(original_img_path))
    
    prompt = """
    You are a building energy management AI.
    Analyze the provided classroom image.
    
    "light_status": Look at the ceiling. If indoor lights (fluorescent/LED) are turned on and emitting light, return "ON". If they are turned off, return "OFF".

    Respond STRICTLY in the following JSON format only:
    {
        "light_status": "ON or OFF",
        "reason": "Detailed reasoning"
    }
    """
    response = gemini_model.generate_content([original_part, prompt])
    return response.text

# ==========================================
# 3. Main API Endpoint
# ==========================================
@app.post("/analyze")
async def analyze_classroom_endpoint(file: UploadFile = File(...)):
    # Cloud Run은 읽기 전용 파일 시스템이므로 임시 저장은 /tmp 디렉토리를 사용합니다.
    temp_filename = f"/tmp/{uuid.uuid4()}.jpg"
    
    try:
        # 1. 업로드된 이미지 임시 저장
        with open(temp_filename, "wb") as buffer:
            buffer.write(await file.read())
        
        # 2. 기본 객체 탐지 (사람, 의자, 책상)
        # COCO Classes -> 0: person, 56: chair, 60: dining table(desk)
        base_results = BASE_MODEL(temp_filename, conf=0.3, classes=[0, 56, 60])[0]
        
        detected_classes = base_results.boxes.cls.cpu().numpy()
        person_count = sum(detected_classes == 0)
        chair_count = sum(detected_classes == 56)
        desk_count = sum(detected_classes == 60)
        
        # 로직 1: 의자나 책상이 하나도 없다면 오류 (강의실이 아님)
        if chair_count == 0 and desk_count == 0:
            return JSONResponse(content={
                "result": "ERROR", 
                "message": "강의실로 인식되지 않습니다. (의자나 책상을 찾을 수 없음)"
            })
            
        # 로직 2: 사람이 있다면 정상(PASS) 처리
        if person_count > 0:
            return JSONResponse(content={
                "result": "PASS", 
                "message": f"강의실에 {person_count}명의 사람이 있습니다. 정상 상태입니다."
            })
            
        # 3. 사람이 없다면 에어컨 탐지 시작
        ac_results = AC_MODEL(temp_filename, conf=0.4)[0]
        
        # 로직 3: 에어컨이 탐지되지 않은 경우 (전등만 확인)
        if len(ac_results.boxes) == 0:
            ai_response = check_light_only_with_gemini(temp_filename)
            clean_json = ai_response.strip().strip("```json").strip("```").strip()
            status_data = json.loads(clean_json)
            
            light_on = (status_data.get("light_status") == "ON")
            
            if light_on:
                return JSONResponse(content={
                    "result": "WASTE_DETECTED",
                    "message": "[WARNING] 에어컨은 찾을 수 없으나, 빈 강의실에 조명이 켜져 있습니다!",
                    "light_status": "ON",
                    "ac_status": "UNKNOWN",
                    "reason": status_data.get("reason")
                })
            else:
                return JSONResponse(content={
                    "result": "PASS",
                    "message": "빈 강의실이며 조명이 꺼져 있습니다. (에어컨 미발견)"
                })
        
        # 로직 4: 에어컨이 탐지된 경우 (에어컨 크롭 및 전등 동시 확인)
        img = cv2.imread(temp_filename)
        # 첫 번째 감지된 에어컨만 사용 (가장 확신도가 높은 것)
        box = ac_results.boxes.xyxy[0] 
        x1, y1, x2, y2 = map(int, box[:4])
        ac_crop = img[y1:y2, x1:x2]
        
        temp_crop_path = f"/tmp/{uuid.uuid4()}_crop.jpg"
        cv2.imwrite(temp_crop_path, ac_crop)
        
        ai_response = check_ac_and_light_with_gemini(temp_filename, temp_crop_path)
        os.remove(temp_crop_path) # 크롭 파일 정리
        
        clean_json = ai_response.strip().strip("```json").strip("```").strip()
        status_data = json.loads(clean_json)
        
        ac_on = (status_data.get("ac_status") == "ON")
        light_on = (status_data.get("light_status") == "ON")
        
        if ac_on or light_on:
            return JSONResponse(content={
                "result": "WASTE_DETECTED",
                "message": "빈 강의실에서 에너지 낭비가 발견되었습니다!",
                "ac_status": status_data.get("ac_status"),
                "light_status": status_data.get("light_status"),
                "reason": status_data.get("reason")
            })
        else:
            return JSONResponse(content={
                "result": "PASS",
                "message": "빈 강의실이며 모든 전원이 꺼져 있습니다."
            })
            
    except Exception as e:
        return JSONResponse(content={"result": "ERROR", "message": f"서버 내부 오류: {str(e)}"}, status_code=500)
    
    finally:
        # 사용이 끝난 원본 임시 파일 삭제
        if os.path.exists(temp_filename):
            os.remove(temp_filename)