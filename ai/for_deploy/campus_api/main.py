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

# Energy Constants
FLUORESCENT_WATTS = 32
LED_WATTS = 15
AC_WATTS = 1500
ELECTRICITY_RATE_KRW = 120
OFF_TIME_CAP_MINUTES = 60

# Vertex AI 초기화
vertexai.init(project=GCP_PROJECT_ID, location=LOCATION)
gemini_model = GenerativeModel("gemini-2.5-flash")

app = FastAPI(title="Campus Energy Management API")

# YOLO Models
BASE_MODEL = YOLO("yolov8n.pt")
AC_MODEL = YOLO("models/ac_best.pt")

# ==========================================
# 2. Image Processing Helper
# ==========================================
def resize_image_if_needed(image_path: str, max_dim: int = 1920):
    """
    이미지가 너무 클 경우 가로/세로 비율을 유지하며 최대 길이를 max_dim으로 리사이징합니다.
    """
    img = cv2.imread(image_path)
    if img is None:
        return

    h, w = img.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / float(max(h, w))
        new_w, new_h = int(w * scale), int(h * scale)
        resized_img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)
        cv2.imwrite(image_path, resized_img)

# ==========================================
# 3. Prompt & Gemini Analysis Function
# ==========================================
def build_analysis_prompt(metadata: dict, has_ac_crop: bool) -> str:
    metadata_json = json.dumps(metadata, ensure_ascii=False, indent=2)

    # [수정] 에어컨 판별을 확실하게 하던 이전 시각 지시사항(Vision Instructions) 복구
    if has_ac_crop:
        vision_instructions = """
1. "ac_status": Look at the second image (cropped AC). If the louvers (blades) are open or the operation LED is on, return "ON". If they are completely closed and inactive, return "OFF".
2. "light_status": Look at the background of the first image (original). If the ceiling indoor lights (fluorescent/LED) are turned on and emitting light, return "ON". If they are turned off, return "OFF".
"""
    else:
        vision_instructions = """
1. "ac_status": Since there is no cropped AC image, return "UNKNOWN".
2. "light_status": Look at the ceiling of the first image. If the indoor lights (fluorescent/LED) are turned on and emitting light, return "ON". If they are turned off, return "OFF".
"""

    return f"""
You are a building energy management AI for a Korean university campus.

The first image is the full classroom photo.
{"The second image is a cropped close-up of a ceiling air conditioner." if has_ac_crop else ""}

Classroom metadata (JSON):
{metadata_json}

Energy constants:
- Fluorescent: {FLUORESCENT_WATTS}W each, count = fluorescentCount
- LED: {LED_WATTS}W each, count = ledCount
- Air conditioner: {AC_WATTS}W each, count = acCount
- Electricity rate: {ELECTRICITY_RATE_KRW} KRW/kWh
- Max off-time cap: {OFF_TIME_CAP_MINUTES} minutes when schedule is closed/after hours/unknown

Vision Analysis Tasks:
{vision_instructions}

Calculation & Logic Tasks:
1. Using reportedAt and operatingSchedules, decide if lights/AC should be OFF now (off-hours or closed day).
   - If currently within operating hours (power should be ON), return result "PASS" even if devices appear ON.
2. If waste is confirmed during off-hours (person-free classroom with ON devices that should be OFF):
   - Compute off_time_minutes until power_off (cap {OFF_TIME_CAP_MINUTES} min on closed/after-hours)
   - Sum kWh only for ON resources × their counts × off_time_hours
   - expected = round(total_kwh × {ELECTRICITY_RATE_KRW}) as Korean won string, e.g. "494원"
3. If no waste: result "PASS", expected "0원"

Respond STRICTLY in this JSON format only:
{{
    "result": "PASS or WASTE_DETECTED",
    "message": "Short user-facing message in Korean",
    "ac_status": "ON or OFF or UNKNOWN",
    "light_status": "ON or OFF",
    "reason": "Detailed visual reasoning about louvers, LEDs, and lights.",
    "expected": "0원 or N원"
}}
"""

def analyze_with_gemini(original_img_path: str, crop_img_path: str, metadata: dict):
    has_ac_crop = crop_img_path is not None
    prompt = build_analysis_prompt(metadata, has_ac_crop)

    contents = [Part.from_image(Image.load_from_file(original_img_path))]
    if has_ac_crop:
        contents.append(Part.from_image(Image.load_from_file(crop_img_path)))

    contents.append(prompt)

    response = gemini_model.generate_content(contents)
    return response.text

# ==========================================
# 4. Main API Endpoint
# ==========================================
@app.post("/analyze")
async def analyze_classroom_endpoint(
        file: UploadFile = File(...),
        metadata_str: str = Form(default="{}")
):
    temp_filename = f"/tmp/{uuid.uuid4()}.jpg"
    temp_crop_path = None

    try:
        metadata = json.loads(metadata_str)

        # 1. 이미지 임시 저장
        with open(temp_filename, "wb") as buffer:
            buffer.write(await file.read())

        # 2. [추가] 이미지 크기 최적화 (비율 유지하며 최대 1920px로 리사이징)
        resize_image_if_needed(temp_filename, max_dim=1920)

        # 3. 기본 객체 탐지 (사람, 의자, 책상)
        base_results = BASE_MODEL(temp_filename, conf=0.3, classes=[0, 56, 60])[0]

        detected_classes = base_results.boxes.cls.cpu().numpy()
        person_count = sum(detected_classes == 0)
        chair_count = sum(detected_classes == 56)
        desk_count = sum(detected_classes == 60)

        if chair_count == 0 and desk_count == 0:
            return JSONResponse(content={
                "result": "ERROR",
                "message": "강의실로 인식되지 않습니다. (의자나 책상을 찾을 수 없음)",
                "expected": "0원"
            })

        if person_count > 0:
            return JSONResponse(content={
                "result": "PASS",
                "message": f"강의실에 아직 사람이 있습니다. (정상 상태)",
                "expected": "0원"
            })

        # 4. 사람이 없다면 에어컨 탐지 시작
        ac_results = AC_MODEL(temp_filename, conf=0.4)[0]

        if len(ac_results.boxes) == 0:
            ai_response = analyze_with_gemini(temp_filename, None, metadata)
        else:
            img = cv2.imread(temp_filename)
            box = ac_results.boxes.xyxy[0]
            x1, y1, x2, y2 = map(int, box[:4])
            ac_crop = img[y1:y2, x1:x2]

            temp_crop_path = f"/tmp/{uuid.uuid4()}_crop.jpg"
            cv2.imwrite(temp_crop_path, ac_crop)

            ai_response = analyze_with_gemini(temp_filename, temp_crop_path, metadata)

        # 5. 결과 반환
        clean_json = ai_response.strip().strip("```json").strip("```").strip()
        status_data = json.loads(clean_json)

        if len(ac_results.boxes) == 0 and status_data.get("result") == "WASTE_DETECTED":
            status_data["message"] = f"[WARNING] 에어컨은 탐지되지 않았으나 낭비가 감지되었습니다! {status_data.get('message', '')}"

        return JSONResponse(content=status_data)

    except Exception as e:
        return JSONResponse(content={"result": "ERROR", "message": f"서버 오류: {str(e)}"}, status_code=500)

    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
        if temp_crop_path and os.path.exists(temp_crop_path):
            os.remove(temp_crop_path)