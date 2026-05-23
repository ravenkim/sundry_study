# AI 모델 설계

---

## 1. AI 역할 정의

| 기능 | AI 여부 | 방법 |
|------|---------|------|
| 사람·가구 감지 (강의실 판별) | AI (YOLOv8n) | COCO 사전학습 모델 — person/chair/desk 3클래스 필터링 |
| 에어컨 탐지 | AI (YOLOv8n Custom) | Roboflow 데이터셋 파인튜닝 — `ac_best.pt` |
| 에어컨 ON/OFF 및 조명 상태 판별 | AI (Gemini Vision) | 고정 프롬프트 — 시나리오 A(에어컨 탐지 시) / B(미탐지 시) |
| 절약량 계산 (전기·수도) | 규칙 기반 | 자원 분류별 수식 엔진 |
| 어뷰징 탐지 | 규칙 기반 | 임계값 필터 |
| (P2) 낭비 패턴 예측 | AI (시계열) | 추후 구현 |

---

## 2. 3단계 AI 파이프라인

이미지 한 장이 업로드되면 아래 세 모델이 순서대로 실행된다.  
앞 단계에서 조기 종료 조건이 충족되면 이후 단계는 건너뛴다.

```
[이미지]
   │
   ▼
[1단계] YOLOv8n — 사람·가구 탐지
   ├─ chair=0 AND desk=0  → ERROR (강의실 아님)
   ├─ person ≥ 1          → PASS (사용 중)
   └─ person = 0          ↓
[2단계] YOLOv8n Custom (ac_best.pt) — 에어컨 탐지
   ├─ 미탐지              → [3단계 시나리오 B]
   └─ 탐지 + 크롭         → [3단계 시나리오 A]
[3단계] Gemini 2.5 Flash — ON/OFF 상태 판별
   └─ JSON 응답 파싱 → WASTE_DETECTED / PASS
```

---

### 2-1. YOLOv8n — 1단계 사람·가구 탐지

- **모델 파일:** `yolov8n.pt` (Ultralytics 공식 COCO 사전학습, 추가 학습 없음)
- **추론 설정:** `conf=0.3, classes=[0, 56, 60]` (person / chair / dining table)

| 조건 | 결과 |
|------|------|
| chair = 0 AND desk = 0 | `ERROR` — 강의실 아님 |
| person ≥ 1 | `PASS` — 정상 사용 중 |
| person = 0 | 2단계로 진행 |

---

### 2-2. YOLOv8n Custom — 2단계 에어컨 탐지

- **모델 파일:** `models/ac_best.pt` (yolov8n 기반 파인튜닝)
- **학습 데이터:** Roboflow `office-air-condition` v1 (2,016장, 1클래스)
- **추론 설정:** `conf=0.4`
- 탐지 시 confidence 최고 박스를 크롭하여 3단계에 전달

**학습 성능 지표**

| 지표 | 값 |
|------|----|
| mAP@0.5 | 0.990 |
| F1 Score (최대) | 0.97 (confidence 0.489) |
| Precision | 1.00 (confidence 0.894) |
| Recall | 0.99 (confidence 0.000) |

---

### 2-3. Gemini 2.5 Flash — 3단계 ON/OFF 판별

```python
vertexai.init(project="duyuthon", location="us-central1")
gemini_model = GenerativeModel("gemini-2.5-flash")
```

| 항목 | 내용 |
|------|------|
| 모델명 | `gemini-2.5-flash` |
| 제공처 | Google DeepMind (Vertex AI) |
| 추가 학습 | 없음 — Prompt Engineering만 사용 |

#### 시나리오 A — 에어컨 탐지됨 (원본 + 크롭 이미지 2장 전달)

```
You are a building energy management AI.
The first image is the full photo of a classroom.
The second image is a cropped close-up of a ceiling 4-way air conditioner.

1. "ac_status": Look at the second image.
   If louvers are open or LED is on -> "ON", else -> "OFF".
2. "light_status": Look at the first image's background.
   If ceiling indoor lights are on -> "ON", else -> "OFF".

Respond STRICTLY in the following JSON format only:
{
    "ac_status": "ON or OFF",
    "light_status": "ON or OFF",
    "reason": "Detailed reasoning"
}
```

#### 시나리오 B — 에어컨 미탐지 (원본 이미지 1장만 전달)

```
You are a building energy management AI.
Analyze the provided classroom image.

"light_status": Look at the ceiling.
If indoor lights (fluorescent/LED) are turned on and emitting light, return "ON".
If they are turned off, return "OFF".

Respond STRICTLY in the following JSON format only:
{
    "light_status": "ON or OFF",
    "reason": "Detailed reasoning"
}
```

#### AI 응답 예시 (시나리오 A)

```json
{
  "ac_status": "ON",
  "light_status": "ON",
  "reason": "The cropped image shows open louvers indicating AC is running. Ceiling lights are visibly illuminated."
}
```

#### 판별 로직

```
[시나리오 A]
  ac_status=ON OR light_status=ON → WASTE_DETECTED
  둘 다 OFF                       → PASS

[시나리오 B]
  light_status=ON → WASTE_DETECTED
  light_status=OFF → PASS
```

> **주의:** Gemini 응답은 Markdown 코드블록으로 래핑되어 올 수 있으므로  
> `strip("` ` `json").strip("` ` `")` 처리 후 JSON 파싱한다.

---

## 3. 절약량 계산 엔진 (자원 분류별)

### 입력 데이터
- `location_resources`: 낭비로 판별된 자원 목록 (ResourceType + quantity + custom_value)
- `off_time`: 제보 시각 ~ 다음 수업/예약 시작 시각 (시간표 연동) 또는 기본값 2시간
- `electricity_rate`: 건물별 전기 단가 (기본값: 130원/kWh)
- `water_rate`: 건물별 수도 단가 (기본값: 1.2원/L)

### 계산 공식 — ELECTRICITY

```
power_w = custom_value OR resource_type.default_value
kWh = power_w × quantity / 1000 × off_time_hours
절약_금액 = kWh × electricity_rate
```

### 계산 공식 — WATER

```
flow_rate = custom_value OR resource_type.default_value  (L/min)
total_L = flow_rate × quantity × off_time_minutes
절약_금액 = total_L × water_rate
```

### 전체 포인트 계산

```
총_절약_금액 = Σ(각 자원별 절약 금액)   ← 전기 + 수도 합산
포인트 = 총_절약_금액 × 0.18            ← 건물주 납부 20% × 사용자 몫 90%
```

### 계산 예시 — 복합 제보 (303호: 형광등 + 에어컨)

| 자원 | 소비값 | 수량 | 방치 2시간 | 단가 130원 | 절약 금액 |
|------|-------|------|-----------|-----------|---------|
| 형광등 | 40W | 10개 | 0.8 kWh | 130원 | 104원 |
| 에어컨 | 1500W | 1대 | 3.0 kWh | 130원 | 390원 |
| **합계** | | | | | **494원** |

포인트: 494 × 0.18 ≈ **89포인트**

### 계산 예시 — 수도 제보 (화장실: 수도꼭지 2개 열림)

| 자원 | 유량 | 수량 | 방치 30분 | 단가 1.2원/L | 절약 금액 |
|------|------|------|----------|------------|---------|
| 수도꼭지 | 8 L/min | 2개 | 480L | 1.2원 | 576원 |

포인트: 576 × 0.18 ≈ **104포인트**

---

## 4. 어뷰징 탐지 규칙

| 규칙 | 임계값 | 처리 |
|------|-------|------|
| 동일 강의실 중복 제보 | 1시간 내 같은 room_id | 두 번째부터 자동 반려 |
| 단기간 과다 제보 | 1일 20건 초과 | 계정 경고 + 제보 잠금 |
| 야간 시간대 제보 | 자정~06시 | 자동 보류 → 관리자 수동 검토 |
| 동일 IP 다중 계정 | 같은 IP 5계정 이상 | 신규 제보 차단 |

---

## 5. AI 성능 목표 (해커톤 MVP 기준)

| 지표 | 목표값 | 실제 달성 (ac_best.pt) | 비고 |
|------|-------|----------------------|------|
| 에어컨 탐지 mAP@0.5 | 0.95 이상 | **0.990** | Validation set 기준 |
| 에어컨 탐지 F1 Score | 0.90 이상 | **0.97** | Confidence 0.489 기준 |
| 전체 판별 정확도 | 85% 이상 | — | 밝은 낮 실내 사진 기준 |
| 판별 소요 시간 | 5초 이내 | — | Gemini 2.5 Flash 기준 |
| 판별 불가 비율 | 15% 이하 | — | 어두운 사진, 흐린 각도 등 |
| API 비용 | 건당 약 0.01달러 이하 | — | gemini-2.5-flash 기준 |

---

## 6. 향후 고도화 방향 (해커톤 이후)

| 단계 | 내용 |
|------|------|
| 단기 | 사진 품질 가이드 UI로 판별불가율 감소 |
| 중기 | 낭비 패턴 시계열 분석 → 상습 방치 강의실 예측 알림 |
| 장기 | 자체 경량 분류 모델 파인튜닝 (API 비용 절감) |

---

## 7. 저장소 구조 (monorepo `ai/`)

2026-05-23 기준 AI 학습·추론·배포 코드가 본 monorepo `ai/` 디렉터리에 포함되었다.

```
ai/
├── yolov8n.pt                    # COCO 사전학습 (1단계)
├── model_train.py                # YOLOv8n Custom 학습
├── model_train_re.ipynb          # 학습 노트북
├── model_test.py                 # 파이프라인 추론 테스트
├── model_test.ipynb              # 추론 노트북
├── train_result/
│   ├── weights/best.pt           # 학습 가중치 (ac_best.pt와 동일 계열)
│   ├── results.csv               # epoch별 loss·mAP
│   └── *.png                     # PR/F1/confusion matrix 등
└── for_deploy/campus_api/
    ├── main.py                   # FastAPI POST /analyze
    ├── models/ac_best.pt         # Cloud Run 배포용 가중치
    ├── requirements.txt
    └── Dockerfile.txt
```

| 항목 | 내용 |
|------|------|
| 학습 데이터 | Roboflow `Office-Air-Condition-1` (75 epochs, yolov8n base) |
| 학습 성능 | mAP@0.5 **0.990**, F1 **0.97** (`train_result/` 기준) |
| 배포 | `for_deploy/campus_api/` → Cloud Run, Spring Boot `ReportService.callAiApi`에서 HTTP 호출 |
| 보안 | GCP 프로젝트 ID·API 키는 placeholder 처리, `.idea/` gitignore 추가 |
