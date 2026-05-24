import os
import cv2
import json
import uuid
import vertexai
from fastapi import FastAPI, File, Form, UploadFile
from fastapi.responses import JSONResponse
from vertexai.generative_models import GenerativeModel, Part, Image
from ultralytics import YOLO

# ==========================================
# 1. Configuration & Initialization
# ==========================================
GCP_PROJECT_ID = "duyuthon-496901"
LOCATION = "us-central1"

vertexai.init(project=GCP_PROJECT_ID, location=LOCATION)
gemini_model = GenerativeModel("gemini-2.5-flash")

app = FastAPI(title="Campus Energy Management API")

BASE_MODEL = YOLO("yolov8n.pt")
AC_MODEL = YOLO("models/ac_best.pt")

FLUORESCENT_WATTS = 40
LED_WATTS = 20
AC_WATTS = 1500
ELECTRICITY_RATE_KRW = 130
OFF_TIME_CAP_MINUTES = 120


# ==========================================
# 2. Metadata validation
# ==========================================
def parse_metadata(raw: str) -> dict:
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as exc:
        raise ValueError(f"metadata JSON 파싱 실패: {exc}") from exc

    required = ("reportedAt", "acCount", "fluorescentCount", "ledCount", "operatingSchedules")
    missing = [key for key in required if key not in data]
    if missing:
        raise ValueError(f"metadata 필수 필드 누락: {', '.join(missing)}")

    if not isinstance(data["operatingSchedules"], list):
        raise ValueError("operatingSchedules must be a list")

    return data


def strip_json_fence(text: str) -> str:
    return text.strip().strip("```json").strip("```").strip()


# ==========================================
# 3. Gemini unified analysis
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


def analyze_with_metadata(
    original_img_path: str,
    metadata: dict,
    crop_img_path: str | None = None,
) -> dict:
    parts = [Part.from_image(Image.load_from_file(original_img_path))]
    if crop_img_path:
        parts.append(Part.from_image(Image.load_from_file(crop_img_path)))

    prompt = build_analysis_prompt(metadata, has_ac_crop=crop_img_path is not None)
    parts.append(prompt)

    response = gemini_model.generate_content(parts)
    clean_json = strip_json_fence(response.text)
    return json.loads(clean_json)


def normalize_response(data: dict) -> dict:
    result = data.get("result", "ERROR")
    response = {
        "result": result,
        "message": data.get("message", ""),
        "reason": data.get("reason"),
    }

    if data.get("ac_status") is not None:
        response["ac_status"] = data.get("ac_status")
    if data.get("light_status") is not None:
        response["light_status"] = data.get("light_status")
    if data.get("expected") is not None:
        response["expected"] = data.get("expected")

    if result in ("PASS", "ERROR") and "expected" not in response:
        response["expected"] = "0원"

    return response


# ==========================================
# 4. Main API Endpoint
# ==========================================
@app.post("/analyze")
async def analyze_classroom_endpoint(
    file: UploadFile = File(...),
    metadata: str = Form(...),
):
    temp_filename = f"/tmp/{uuid.uuid4()}.jpg"

    try:
        try:
            classroom_metadata = parse_metadata(metadata)
        except ValueError as exc:
            return JSONResponse(
                content={"result": "ERROR", "message": str(exc)},
                status_code=400,
            )

        with open(temp_filename, "wb") as buffer:
            buffer.write(await file.read())

        base_results = BASE_MODEL(temp_filename, conf=0.3, classes=[0, 56, 60])[0]

        detected_classes = base_results.boxes.cls.cpu().numpy()
        person_count = sum(detected_classes == 0)
        chair_count = sum(detected_classes == 56)
        desk_count = sum(detected_classes == 60)

        if chair_count == 0 and desk_count == 0:
            return JSONResponse(
                content={
                    "result": "ERROR",
                    "message": "강의실로 인식되지 않습니다. (의자나 책상을 찾을 수 없음)",
                }
            )

        if person_count > 0:
            return JSONResponse(
                content={
                    "result": "PASS",
                    "message": f"강의실에 {person_count}명의 사람이 있습니다. 정상 상태입니다.",
                    "expected": "0원",
                }
            )

        ac_results = AC_MODEL(temp_filename, conf=0.4)[0]
        temp_crop_path = None

        if len(ac_results.boxes) > 0:
            img = cv2.imread(temp_filename)
            box = ac_results.boxes.xyxy[0]
            x1, y1, x2, y2 = map(int, box[:4])
            ac_crop = img[y1:y2, x1:x2]
            temp_crop_path = f"/tmp/{uuid.uuid4()}_crop.jpg"
            cv2.imwrite(temp_crop_path, ac_crop)

        status_data = analyze_with_metadata(
            temp_filename,
            classroom_metadata,
            temp_crop_path,
        )

        if temp_crop_path and os.path.exists(temp_crop_path):
            os.remove(temp_crop_path)

        return JSONResponse(content=normalize_response(status_data))

    except Exception as e:
        return JSONResponse(
            content={"result": "ERROR", "message": f"서버 내부 오류: {str(e)}"},
            status_code=500,
        )

    finally:
        if os.path.exists(temp_filename):
            os.remove(temp_filename)
