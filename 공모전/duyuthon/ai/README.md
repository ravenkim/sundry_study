# AI — Campus Energy Analysis

monorepo `ai/` 디렉터리는 **YOLOv8n + YOLOv8n Custom + Gemini 2.5 Flash** AI 파이프라인의 학습·테스트·Docker Compose 배포 코드를 포함한다.

Spring Boot BE는 제보 생성(`POST /api/reports`) 시 FastAPI `POST /analyze`를 호출한다. **이미지와 강의실 metadata JSON**을 함께 전달하며, AI가 ON/OFF 판별과 `expected`(원) 절약량을 단일 응답으로 반환한다.

> 구현 기준 문서: [API_명세서 § POST /analyze](../docs/기획/캠퍼스_에너지_절약/04_기술_기획/API_명세서.md), [AI_모델_설계](../docs/기획/캠퍼스_에너지_절약/04_기술_기획/AI_모델_설계.md)

---

## 디렉터리 구조

```
ai/
├── deploy.sh                   # Docker Compose AI 배포 (증분 빌드·/ready 대기)
├── model_train.py              # Roboflow → YOLOv8n Custom 학습
├── model_test.py               # 로컬 파이프라인 테스트
├── train_result/
└── for_deploy/campus_api/
    ├── main.py                 # FastAPI GET /health, /ready, POST /analyze
    ├── Dockerfile
    ├── requirements.txt
    └── models/ac_best.pt       # (배포 전 배치) 에어컨 Custom 가중치
```

> `.pt` 가중치와 GCP 서비스 계정 키는 Git에 포함되지 않는다.

---

## Docker Compose 배포 (기본)

프로젝트 루트에서 통합 배포:

```bash
cp .env.example .env   # AI_PORT, GCP_*, AI_API_URL 설정
bash deploy.sh         # ai/deploy.sh → be/deploy.sh → fe/deploy.sh
```

AI만 개별 배포:

```bash
bash ai/deploy.sh
```

### 사전 준비

| 파일 | 경로 | 설명 |
|------|------|------|
| GCP 서비스 계정 키 | `secrets/gcp-sa.json` | Vertex AI(Gemini) 호출 권한 |
| 에어컨 YOLO 가중치 | `ai/for_deploy/campus_api/models/ac_best.pt` | 학습 산출물 |

`.env` 예시:

```
AI_PORT=8082
AI_API_URL=http://ai:8080/analyze
GCP_SA_KEY_PATH=./secrets/gcp-sa.json
GCP_PROJECT_ID=duyuthon-496901
GCP_LOCATION=us-central1
```

BE 컨테이너는 Compose 내부 DNS `http://ai:8080/analyze`로 AI를 호출한다. 호스트에서 확인:

```bash
curl http://127.0.0.1:8082/health   # 프로세스 생존
curl http://127.0.0.1:8082/ready    # YOLO·Vertex AI 로드 완료
```

---

## 학습

```bash
cd ai
python model_train.py
```

- 데이터셋: Roboflow `office-air-condition` v1 (2,016장)
- 베이스: `yolov8n.pt`
- 학습 결과: `train_result/results.csv` (최종 mAP@0.5 ≈ 0.989)

---

## 로컬 추론 테스트

```bash
cd ai
python model_test.py
```

또는 FastAPI 직접 실행:

```bash
cd ai/for_deploy/campus_api
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080
```

---

## Cloud Run 배포 (선택)

Docker Compose 외 별도 GCP 배포가 필요할 때:

```bash
cd ai/for_deploy/campus_api
gcloud run deploy campus-energy-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --timeout 60
```

Cloud Run URL 사용 시 `.env`의 `AI_API_URL`을 해당 `/analyze` URL로 변경한다.

상세: [배포_가이드](../docs/기획/캠퍼스_에너지_절약/04_기술_기획/배포_가이드.md) · [AI_모델_설계](../docs/기획/캠퍼스_에너지_절약/04_기술_기획/AI_모델_설계.md)

---

## API

| 엔드포인트 | 설명 |
|------------|------|
| `GET /health` | 프로세스 생존 확인 (즉시 200) |
| `GET /ready` | YOLO·Vertex AI 로드 완료 시 200, 로딩 중 503 |
| `POST /analyze` | 이미지 분석 |

### POST /analyze

**Request**: `multipart/form-data`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `file` | File | Y | 분석할 이미지 |
| `metadata_str` | String (JSON) | Y | 강의실·제보 시각 정보 |

**metadata 예시**

```json
{
  "reportedAt": "2026-05-24T15:00:00",
  "acCount": 1,
  "fluorescentCount": 10,
  "ledCount": 2,
  "operatingSchedules": [
    {
      "dayOfWeek": 1,
      "closed": false,
      "powerOnTime": "07:00",
      "powerOffTime": "22:00"
    }
  ]
}
```

**Response** (`result` 필드):

| result | 의미 |
|--------|------|
| `PASS` | 사용 중이거나 낭비 없음 — BE 저장 거부 |
| `ERROR` | 강의실 미인식 등 — BE 저장 거부 |
| `WASTE_DETECTED` | 낭비 확인 — BE Report 저장 |

---

## BE 연동

- 호출: `ReportService.callAiApi` → multipart `file` + `metadata_str`
- URL: `.env` `AI_API_URL` (Docker Compose 기본: `http://ai:8080/analyze`)
- DTO: `AiAnalysisResponse` (`result`, `message`, `ac_status`, `light_status`, `reason`, `expected`, `expectedKwh`)
