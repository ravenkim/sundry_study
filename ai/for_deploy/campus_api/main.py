import os
import cv2
import json
import uuid
import vertexai
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from vertexai.generative_models import GenerativeModel, Part, Image
from ultralytics import YOLO

# ==========================================
# 1. Configuration & Constants
# ==========================================
GCP_PROJECT_ID = "duyuthon-496901"  # 본인의 정확한 프로젝트 ID
LOCATION = "us-central1"

# Energy Constants (프롬프트에서 사용될 상수값 정의)
FLUORESCENT_WATTS = 32
LED_WATTS = 15
AC_WATTS = 1500
ELECTRICITY_RATE_KRW = 120
OFF_TIME_CAP_MINUTES = 60

# Vertex AI 초기화
vertexai.init(project=GCP_PROJECT_ID, location=LOCATION)
gemini_model = GenerativeModel("gemini-2.5-flash")

app = FastAPI(title="Campus Energy Management API")

# YOLO Models (부팅 시 1회 로드)
BASE_MODEL = YOLO("yolov8n.pt")
AC_MODEL = YOLO("models/ac_best.pt")

# ==========================================
# 2. Prompt & Gemini Analysis Function
# ==========================================
def build_analysis_prompt(metadata: dict, has_ac_crop: bool) -> str:
    metadata_json = json.dumps(metadata, ensure_ascii=False, indent=2)
    image_note = (
            "The first image is the full classroom photo."
            + (
                " The second image is a cropped close-up of a ceiling air conditioner."
                if has_ac_crop
                else ""
            )
    )

    # User provided prompt (그대로 유지)
    return f"""
You are a building energy management AI for a Korean university campus.

{image_note}

Classroom metadata (JSON):
{metadata_json}

Energy constants:
- Fluorescent: {FLUORESCENT_WATTS}W each, count = fluorescentCount
- LED: {LED_WATTS}W each, count = ledCount
- Air conditioner: {AC_WATTS}W each, count = acCount
- Electricity rate: {ELECTRICITY_RATE_KRW} KRW/kWh
- Max off-time cap: {OFF_TIME_CAP_MINUTES} minutes when schedule is closed/after hours/unknown

Tasks:
1. Determine ac_status ("ON", "OFF", or "UNKNOWN") and light_status ("ON" or "OFF") from the image(s).
2. Using reportedAt and operatingSchedules, decide if lights/AC should be OFF now (off-hours or closed day).
   - If currently within operating hours (power should be ON), return result "PASS" even if devices appear ON.
3. If waste is confirmed during off-hours (person-free classroom with ON devices that should be OFF):
   - Compute off_time_minutes until power_off (cap {OFF_TIME_CAP_MINUTES} min on closed/after-hours)
   - Sum kWh only for ON resources × their counts × off_time_hours
   - expected = round(total_kwh × {ELECTRICITY_RATE_KRW}) as Korean won string, e.g. "494원"
4. If no waste: result "PASS", expected "0원"

Respond STRICTLY in this JSON format only:
{{
    "result": "PASS or WASTE_DETECTED",
    "message": "Short user-facing message in Korean",
    "ac_status": "ON or OFF or UNKNOWN",
    "light_status": "ON or OFF",
    "reason": "Detailed reasoning",
    "expected": "0원 or N원"
}}
"""

def analyze_with_gemini(original_img_path: str, crop_img_path: str, metadata: dict):
    has_ac_crop = crop_img_path is not None
    prompt = build_analysis_prompt(metadata, has_ac_crop)

    # 원본 이미지 항상 포함
    contents = [Part.from_image(Image.load_from_file(original_img_path))]

    # 에어컨이 탐지되어 크롭 이미지가 있다면 포함
    if has_ac_crop:
        contents.append(Part.from_image(Image.load_from_file(crop_img_path)))

    contents.append(prompt)

    response = gemini_model.generate_content(contents)
    return response.text

# ==========================================
# 3. Main API Endpoint
# ==========================================
@app.post("/analyze")
async def analyze_classroom_endpoint(
        file: UploadFile = File(...),
        metadata_str: str = Form(default="{}") # 메타데이터를 문자열로 함께 받음
):
    temp_filename = f"/tmp/{uuid.uuid4()}.jpg"
    temp_crop_path = None

    try:
        # 1. 메타데이터 파싱 (앱에서 전달된 JSON 문자열)
        metadata = json.loads(metadata_str)

        # 2. 이미지 임시 저장
        with open(temp_filename, "wb") as buffer:
            buffer.write(await file.read())

        # 3. 기본 객체 탐지 (사람, 의자, 책상)
        # COCO Classes -> 0: person, 56: chair, 60: dining table(desk)
        base_results = BASE_MODEL(temp_filename, conf=0.3, classes=[0, 56, 60])[0]

        detected_classes = base_results.boxes.cls.cpu().numpy()
        person_count = sum(detected_classes == 0)
        chair_count = sum(detected_classes == 56)
        desk_count = sum(detected_classes == 60)

        # 로직 A: 강의실 환경 확인 (의자나 책상이 하나도 없다면 오류)
        if chair_count == 0 and desk_count == 0:
            return JSONResponse(content={
                "result": "ERROR",
                "message": "강의실로 인식되지 않습니다. (의자나 책상을 찾을 수 없음)",
                "expected": "0원"
            })

        # 로직 B: 사람이 있다면 즉시 PASS 처리
        if person_count > 0:
            return JSONResponse(content={
                "result": "PASS",
                "message": f"강의실에 아직 사람이 있습니다. (정상 상태)",
                "expected": "0원"
            })

        # 4. 사람이 없다면 에어컨 탐지 시작
        ac_results = AC_MODEL(temp_filename, conf=0.4)[0]

        if len(ac_results.boxes) == 0:
            # 로직 C: 에어컨 미발견 (크롭 없이 원본만 Gemini로 전송)
            ai_response = analyze_with_gemini(temp_filename, None, metadata)
        else:
            # 로직 D: 에어컨 발견 -> 크롭 후 2장의 이미지를 Gemini로 전송
            img = cv2.imread(temp_filename)
            box = ac_results.boxes.xyxy[0]
            x1, y1, x2, y2 = map(int, box[:4])
            ac_crop = img[y1:y2, x1:x2]

            temp_crop_path = f"/tmp/{uuid.uuid4()}_crop.jpg"
            cv2.imwrite(temp_crop_path, ac_crop)

            ai_response = analyze_with_gemini(temp_filename, temp_crop_path, metadata)

        # 5. Gemini JSON 응답 파싱 및 클라이언트 반환
        clean_json = ai_response.strip().strip("```json").strip("```").strip()
        status_data = json.loads(clean_json)

        # 에어컨 미발견 시 Gemini가 "UNKNOWN" 등을 반환하겠지만, Python 측에서도 확실하게 알림(Warning)을 추가
        if len(ac_results.boxes) == 0 and status_data.get("result") == "WASTE_DETECTED":
            status_data["message"] = f"[WARNING] 에어컨은 탐지되지 않았으나 낭비가 감지되었습니다! {status_data.get('message', '')}"

        return JSONResponse(content=status_data)

    except Exception as e:
        return JSONResponse(content={"result": "ERROR", "message": f"서버 오류: {str(e)}"}, status_code=500)

    finally:
        # 리소스 정리
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if temp_crop_path and os.path.exists(temp_crop_path):
            os.remove(temp_crop_path)