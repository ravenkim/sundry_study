import os
import cv2
import json
import uuid
import logging
import threading
from contextlib import asynccontextmanager

import vertexai
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from vertexai.generative_models import GenerativeModel, Part, Image
from ultralytics import YOLO

logger = logging.getLogger(__name__)

# ==========================================
# 1. Configuration & Constants
# ==========================================
GCP_PROJECT_ID = os.environ.get("GCP_PROJECT_ID", "duyuthon-496901")
LOCATION = os.environ.get("GCP_LOCATION", "us-central1")

# Energy Constants
FLUORESCENT_WATTS = 32
LED_WATTS = 15
AC_WATTS = 1500
ELECTRICITY_RATE_KRW = 120
OFF_TIME_CAP_MINUTES = 60

# Model state (loaded in background thread during lifespan)
_models_lock = threading.Lock()
_models_ready = False
_models_error: str | None = None
_base_model: YOLO | None = None
_ac_model: YOLO | None = None
_gemini_model: GenerativeModel | None = None


def _load_models() -> None:
    global _models_ready, _models_error, _base_model, _ac_model, _gemini_model
    try:
        logger.info("Loading YOLO models and Vertex AI...")
        vertexai.init(project=GCP_PROJECT_ID, location=LOCATION)
        gemini = GenerativeModel("gemini-2.5-flash")
        base = YOLO("yolov8n.pt")
        ac = YOLO("models/ac_best.pt")
        with _models_lock:
            _gemini_model = gemini
            _base_model = base
            _ac_model = ac
            _models_ready = True
            _models_error = None
        logger.info("Models loaded successfully")
    except Exception as exc:
        with _models_lock:
            _models_error = str(exc)
            _models_ready = False
        logger.exception("Model loading failed")


def _get_models() -> tuple[YOLO, YOLO, GenerativeModel]:
    with _models_lock:
        if not _models_ready or _base_model is None or _ac_model is None or _gemini_model is None:
            if _models_error:
                raise RuntimeError(f"모델 로딩 실패: {_models_error}")
            raise RuntimeError("모델 로딩 중")
        return _base_model, _ac_model, _gemini_model


@asynccontextmanager
async def lifespan(app: FastAPI):
    thread = threading.Thread(target=_load_models, daemon=True, name="model-loader")
    thread.start()
    yield


app = FastAPI(title="Campus Energy Management API", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/ready")
async def ready():
    with _models_lock:
        if _models_ready:
            return {"ready": True}
        if _models_error:
            return JSONResponse(
                content={"ready": False, "error": _models_error},
                status_code=503,
            )
    return JSONResponse(content={"ready": False, "message": "모델 로딩 중"}, status_code=503)


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
    electricity_rate = metadata.get("electricityRateKrw", ELECTRICITY_RATE_KRW)
    if isinstance(electricity_rate, (int, float)):
        electricity_rate = int(round(electricity_rate))
    else:
        electricity_rate = ELECTRICITY_RATE_KRW

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
- Electricity rate: {electricity_rate} KRW/kWh
- Max off-time cap: {OFF_TIME_CAP_MINUTES} minutes when schedule is closed/after hours/unknown

Vision Analysis Tasks:
{vision_instructions}

Calculation & Logic Tasks:
1. Using reportedAt and operatingSchedules, decide if lights/AC should be OFF now (off-hours or closed day).
   - If currently within operating hours (power should be ON), return result "PASS" even if devices appear ON.
2. If waste is confirmed during off-hours (person-free classroom with ON devices that should be OFF):
   - Compute off_time_minutes until power_off (cap {OFF_TIME_CAP_MINUTES} min on closed/after-hours)
   - Sum kWh only for ON resources × their counts × off_time_hours
   - expectedKwh = total_kwh rounded to 1 decimal, e.g. "3.8 kWh"
   - expected = round(total_kwh × {electricity_rate}) as Korean won string, e.g. "494원"
3. If no waste: result "PASS", expected "0원", expectedKwh "0 kWh"

Respond STRICTLY in this JSON format only:
{{
    "result": "PASS or WASTE_DETECTED",
    "message": "Short user-facing message in Korean",
    "ac_status": "ON or OFF or UNKNOWN",
    "light_status": "ON or OFF",
    "reason": "Detailed visual reasoning about louvers, LEDs, and lights.",
    "expectedKwh": "0 kWh or N.N kWh",
    "expected": "0원 or N원"
}}
"""


def analyze_with_gemini(
    gemini_model: GenerativeModel,
    original_img_path: str,
    crop_img_path: str | None,
    metadata: dict,
):
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
    try:
        base_model, ac_model, gemini_model = _get_models()
    except RuntimeError as exc:
        return JSONResponse(
            content={"result": "ERROR", "message": str(exc)},
            status_code=503,
        )

    temp_filename = f"/tmp/{uuid.uuid4()}.jpg"
    temp_crop_path = None

    try:
        metadata = json.loads(metadata_str)

        with open(temp_filename, "wb") as buffer:
            buffer.write(await file.read())

        resize_image_if_needed(temp_filename, max_dim=1920)

        base_results = base_model(temp_filename, conf=0.3, classes=[0, 56, 60])[0]

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
                "message": "강의실에 아직 사람이 있습니다. (정상 상태)",
                "expected": "0원"
            })

        ac_results = ac_model(temp_filename, conf=0.4)[0]

        if len(ac_results.boxes) == 0:
            ai_response = analyze_with_gemini(gemini_model, temp_filename, None, metadata)
        else:
            img = cv2.imread(temp_filename)
            box = ac_results.boxes.xyxy[0]
            x1, y1, x2, y2 = map(int, box[:4])
            ac_crop = img[y1:y2, x1:x2]

            temp_crop_path = f"/tmp/{uuid.uuid4()}_crop.jpg"
            cv2.imwrite(temp_crop_path, ac_crop)

            ai_response = analyze_with_gemini(gemini_model, temp_filename, temp_crop_path, metadata)

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
