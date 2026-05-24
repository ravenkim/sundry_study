# AI — Campus Energy Analysis

monorepo `ai/` 디렉터리는 **YOLOv8n + YOLOv8n Custom + Gemini 2.5 Flash** 3단계 AI 파이프라인의 학습·테스트·Cloud Run 배포 코드를 포함한다.

Spring Boot BE는 제보 생성(`POST /api/reports`) 시 Cloud Run FastAPI `POST /analyze`를 호출한다.

---

## 디렉터리 구조

```
ai/
├── model_train.py              # Roboflow → YOLOv8n Custom 학습
├── model_train_re.ipynb
├── model_test.py               # 로컬 3단계 파이프라인 테스트
├── model_test.ipynb
├── train_result/
│   ├── args.yaml               # 75 epochs, batch 16, imgsz 640, device cpu
│   └── results.csv             # epoch별 loss·mAP
└── for_deploy/campus_api/
    ├── main.py                 # FastAPI POST /analyze
    ├── requirements.txt
    ├── Dockerfile.txt          # 배포 시 Dockerfile 로 rename
    ├── yolov8n.pt              # (배포 시 배치) COCO 사전학습
    └── models/ac_best.pt       # (배포 시 배치) 에어컨 Custom 가중치
```

> `.pt` 가중치는 Git에 포함되지 않는다. Cloud Run 빌드 전 `for_deploy/campus_api/`에 수동 배치한다.

---

## 학습

```bash
cd ai
# model_train.py 내 ROBOFLOW_API_KEY, GCP_PROJECT_ID 설정
python model_train.py
```

- 데이터셋: Roboflow `office-air-condition` v1 (2,016장)
- 베이스: `yolov8n.pt`
- 학습 결과: `train_result/results.csv` (최종 mAP@0.5 ≈ 0.989)

---

## 로컬 추론 테스트

```bash
cd ai
# model_test.py — Vertex AI·가중치 경로 설정 후 실행
python model_test.py
```

---

## Cloud Run 배포

```bash
cd ai/for_deploy/campus_api
mkdir -p models
cp /path/to/ac_best.pt models/
cp /path/to/yolov8n.pt .
cp Dockerfile.txt Dockerfile

pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080   # 로컬 확인

gcloud run deploy campus-energy-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 60
```

운영 URL (현재): `https://campus-energy-api-992786420144.us-central1.run.app/analyze`

상세: [배포_가이드 §11](../docs/기획/캠퍼스_에너지_절약/04_기술_기획/배포_가이드.md) · [AI_모델_설계](../docs/기획/캠퍼스_에너지_절약/04_기술_기획/AI_모델_설계.md)

---

## API — POST /analyze

**Request**: `multipart/form-data`, field `file`

**Response** (`result` 필드):

| result | 의미 |
|--------|------|
| `PASS` | 사용 중이거나 낭비 없음 — BE 저장 거부 |
| `ERROR` | 강의실 미인식 등 — BE 저장 거부 |
| `WASTE_DETECTED` | 낭비 확인 — BE만 Report 저장 |

선택 필드: `ac_status`, `light_status`, `reason`

---

## BE 연동

- 호출: `ReportService.callAiApi` → multipart `file`
- DTO: `AiAnalysisResponse` (`result`, `message`, `ac_status`, `light_status`, `reason`)
- `AI_API_URL` env 분리: P1 (현재 Java 하드코딩)
