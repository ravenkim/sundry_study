# AI 모델 설계

---

## 1. AI 역할 정의

| 기능 | AI 여부 | 방법 |
|------|---------|------|
| 사람·가구 감지 (강의실 판별) | AI (YOLOv8n) | COCO 사전학습 모델 — person/chair/desk 3클래스 필터링 |
| 에어컨 탐지 | AI (YOLOv8n Custom) | Roboflow 데이터셋 파인튜닝 — `ac_best.pt` |
| 에어컨 ON/OFF 및 조명 상태 판별 | AI (Gemini Vision) | 이미지 + 강의실 metadata JSON |
| 절약량 계산 (전기) | AI (Gemini) | metadata(운영시간·자원 수량) + ON/OFF 판별 → `expected`(원) |
| 절약량 계산 (BE 참고용) | 규칙 기반 | `SavingsCalculationService` — 제보 플로우에서는 미사용, Phase 2 참고 |
| 어뷰징 탐지 | 규칙 기반 | 임계값 필터 |
| (P2) 낭비 패턴 예측 | AI (시계열) | 추후 구현 |

---

## 2. AI 파이프라인 (YOLO + Gemini 통합)

BE가 **이미지 + metadata JSON**을 전달하면 아래 파이프라인이 실행된다.  
앞 단계에서 조기 종료 조건이 충족되면 이후 단계는 건너뛴다.

```
[이미지 + metadata JSON]
   │
   ▼
[1단계] YOLOv8n — 사람·가구 탐지
   ├─ chair=0 AND desk=0  → ERROR (강의실 아님)
   ├─ person ≥ 1          → PASS (사용 중)
   └─ person = 0          ↓
[2단계] YOLOv8n Custom (ac_best.pt) — 에어컨 탐지
   ├─ 미탐지              → [3단계: 원본만]
   └─ 탐지 + 크롭         → [3단계: 원본 + AC 크롭]
[3단계] Gemini 2.5 Flash — ON/OFF + 절약량 통합
   ├─ 입력: 이미지 + metadata(운영시간, acCount, fluorescentCount, ledCount, reportedAt)
   ├─ 운영시간 판단: 지금 꺼져 있어야 하는 시간인지
   ├─ ON/OFF 판별 + expected(원) 산출
   └─ JSON 응답 → WASTE_DETECTED / PASS + expected
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

### 2-3. Gemini 2.5 Flash — 3단계 ON/OFF + expected 통합

```python
vertexai.init(project="duyuthon-496901", location="us-central1")  # 배포(main.py) 기준
gemini_model = GenerativeModel("gemini-2.5-flash")
```

> 학습 스크립트(`model_train.py`)의 `GCP_PROJECT_ID`는 placeholder(`duyuthon`)이다. Cloud Run 배포 코드는 `duyuthon-496901`을 사용한다.

| 항목 | 내용 |
|------|------|
| 모델명 | `gemini-2.5-flash` |
| 제공처 | Google DeepMind (Vertex AI) |
| 추가 학습 | 없음 — Prompt Engineering만 사용 |

#### 통합 프롬프트 — 이미지 + metadata JSON

Gemini에 전달하는 metadata 예시:

```json
{
  "reportedAt": "2026-05-24T15:00:00",
  "acCount": 1,
  "fluorescentCount": 10,
  "ledCount": 2,
  "operatingSchedules": [
    { "dayOfWeek": 1, "closed": false, "powerOnTime": "07:00", "powerOffTime": "22:00" }
  ]
}
```

프롬프트 핵심 지시:
1. 이미지에서 `ac_status`, `light_status` ON/OFF 판별 (에어컨 크롭 있으면 2장 입력)
2. `reportedAt` + `operatingSchedules`로 **지금 전원이 꺼져 있어야 하는 시간인지** 판단
3. 운영시간 중(켜도 되는 시간)이면 `result: PASS`, `expected: "0원"`
4. 낭비 확인 시 ON으로 판별된 자원만 합산 — 전력 상수: 형광등 40W, LED 20W, 에어컨 1500W, 130원/kWh → **`expectedKwh`** (예: `"3.8 kWh"`) 및 **`expected`** (원)
5. 방치 시간: 제보 시각 ~ 당일 power_off (휴무·소등 후 cap 120분)

#### AI 응답 형식 (고정 JSON)

```json
{
  "result": "WASTE_DETECTED",
  "message": "Energy waste detected!",
  "ac_status": "OFF",
  "light_status": "ON",
  "reason": "Ceiling lights are on in an empty classroom during off-hours.",
  "expected": "494원",
  "expectedKwh": "3.8 kWh"
}
```

#### 판별 로직

```
운영시간 중(켜도 되는 시간) → PASS, expected: "0원"
ac_status=ON OR light_status=ON (소등 시간) → WASTE_DETECTED + expected 산출
둘 다 OFF → PASS, expected: "0원"
```

> **주의:** Gemini 응답은 Markdown 코드블록으로 래핑되어 올 수 있으므로  
> `strip("` ` `json").strip("` ` `")` 처리 후 JSON 파싱한다.

---

## 3. 절약량 계산 엔진 (자원 분류별)

> **공식·상수 출처 (CO₂ 0.4594, 소나무 20.25 kWh/그루, 전력 W 등):** [절약량_환산_공식_및_근거.md](./절약량_환산_공식_및_근거.md)

### 입력 데이터

**AI (낭비 판별 + 절약량) ✅** — 사진 + metadata JSON:
- YOLO: 사람·가구·에어컨 탐지
- Gemini: `ac_status`, `light_status` ON/OFF + `expected`(원) + `expectedKwh` 산출
- BE는 `expected` → `estimatedSavingsKrw`, `expectedKwh` → `estimated_kwh`, `estimatedPoint` 저장

**절약량 계산 (BE 참고용)** — `SavingsCalculationService` (제보 플로우 미사용):
- Phase 2·검증용으로 유지
- 입력: `report.createdAt`, LEAF 자원 수량, `location_operating_schedule_db`
- 기본 W: 형광등 40, LED 20, 에어컨 1500 / 130원/kWh / 포인트 = 금액 × 0.18

**절약량 계산 (BE, Phase 2 목표)** — `LocationResource` + `ResourceType`:
- `location_resources`: 낭비로 판별된 자원 목록 (ResourceType + quantity + custom_value)

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

## 3.5. 사용자 안내 (제보 화면) ✅ 2026-05-25

제보 사진 단계(`/report-form`)에서 AI 판별 기준과 촬영 가이드를 사전 표시한다. (`fe/src/features/user/UserReportForm.tsx` · `assets/locales/ko/report.json`)

### AI 판별 기준 (포인트 적립 조건)

| # | 조건 | AI/BE 처리 |
|---|------|------------|
| 1 | **운영 시간이 아닌** 빈 강의실 | Gemini: `operatingSchedules` + `reportedAt` → 운영 중이면 `PASS`. BE: `isReportableAt()` → 목록·제출 차단 |
| 2 | **사람이 없음** | YOLO person count = 0, 아니면 `PASS` |
| 3 | **조명 또는 에어컨 ON** | Gemini vision → `WASTE_DETECTED` + `expected` |

### 촬영 가이드 (강의실 미인식 ERROR 대응)

| 항목 | 안내 |
|------|------|
| 강의실 인식 | **운영 중인 강의실**(의자·책상이 보이는 공간)을 촬영 — YOLO chair/desk 미탐지 시 `ERROR` |
| 낭비 확인 | 천장 조명·에어컨 상태가 잘 보이도록 |
| 구도 | 강의실 전체 불필요, 의자·책상만 화면에 포함되면 됨 |

BE `ERROR` 응답 메시지에도 동일 안내를 포함: *"운영 중인 강의실(의자·책상이 보이는 공간)을 촬영해 주세요"*.

### 제보 가능 강의실 목록

- `GET /api/buildings` LEAF에 `reportable`(운영 시간 외 여부), `alreadyReported`(본인 제보 이력) 반환
- FE: `reportable !== false && !alreadyReported`인 LEAF만 선택 목록 표시

---

## 4. 어뷰징 탐지 규칙

> **대표 시나리오**: 꺼져 있던 조명을 직접 켜고 촬영 → AI는 ON 상태만 확인하므로 1회성 악용은 기술만으로 차단 불가.  
> **제도·운영 대응**: [어뷰징_방지_제도.md](../05_운영_계획/어뷰징_방지_제도.md)

### 4.1. 규칙 기반 필터 (L1)

| 규칙 | 임계값 | 처리 | 구현 |
|------|-------|------|------|
| 운영 시간 중 제보 | `operatingSchedules` + `reportedAt` | 즉시 반려 | **✅** |
| **동일 강의실 영구 1회** | 같은 member + location | `ALREADY_EXISTS` (2004) | **✅ 2026-05-25** |
| 동일 강의실 중복 제보 | 1시간 내 같은 room_id | 두 번째부터 자동 반려 | ⏳ |
| 단기간 과다 제보 | 1일 20건 초과 | 계정 경고 + 제보 잠금 | ⏳ |
| 야간 시간대 제보 | 자정~06시 | 자동 보류 → 관리자 수동 검토 | ⏳ |
| 동일 IP 다중 계정 | 같은 IP 5계정 이상 | 신규 제보 차단 | ⏳ |

### 4.2. AI·촬영 조건 (L2)

| 조건 | BE/AI 처리 | 어뷰징 관련 |
|------|-----------|------------|
| 사람 0명 | YOLO person=0, 아니면 PASS | 켜고 나가기 전 촬영 시 통과 가능 (한계) |
| 의자·책상 필수 | chair/desk 미탐지 → ERROR | 비강의실 공간 남용 차단 |
| 조명·AC ON | Gemini → WASTE_DETECTED | 「켜고 찍기」 1회 통과 가능 (한계) |

### 4.3. 지급·사후 (L3·L4, BE/운영)

| 조치 | 설명 | 구현 |
|------|------|------|
| 즉시 적립 | MVP: AI 통과 시 `MemberPoint.addPoint()` | **✅** |
| 지연 확정 | 24~48h 후 관리자·시설팀 확인 → 확정 | P1 ⏳ |
| 확인형 지급 | 제보 50% + 소등 확인 50% | P1 ⏳ |
| 이의·회수 | A-05 관리자 이의 → 포인트 회수 | ⏳ |

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
| 단기 | ~~사진 품질 가이드 UI로 판별불가율 감소~~ → **✅ 제보 화면 AI 기준·촬영 가이드 카드 (2026-05-25)** |
| 중기 | 낭비 패턴 시계열 분석 → 상습 방치 강의실 예측 알림 |
| 장기 | 자체 경량 분류 모델 파인튜닝 (API 비용 절감) |

---

## 7. 저장소 구조 (monorepo `ai/`)

2026-05-23 기준 AI 학습·추론·배포 코드가 본 monorepo `ai/` 디렉터리에 포함되었다.

```
ai/
├── model_train.py                # YOLOv8n Custom 학습 (Roboflow 다운로드)
├── model_train_re.ipynb          # 학습 노트북
├── model_test.py                 # 파이프라인 추론 테스트
├── model_test.ipynb              # 추론 노트북
├── train_result/
│   ├── args.yaml                 # 학습 하이퍼파라미터 (75 epochs, batch 16, imgsz 640, device cpu)
│   └── results.csv               # epoch별 loss·mAP (최종 mAP@0.5 ≈ 0.989)
└── for_deploy/campus_api/
    ├── main.py                   # FastAPI POST /analyze
    ├── requirements.txt
    ├── Dockerfile.txt            # 배포 시 Dockerfile 로 rename
    ├── yolov8n.pt                # (배포 시 배치) COCO 사전학습 1단계
    └── models/ac_best.pt         # (배포 시 배치) 에어컨 Custom 가중치
```

> **Git 추적 범위**: `.py`·`.ipynb`·`args.yaml`·`results.csv` 등 소스만 포함. `.pt` 가중치·학습 그래프(`*.png`)는 **Git 미포함** — Cloud Run 이미지 빌드 전 `for_deploy/campus_api/`에 수동 배치.

| 항목 | 내용 |
|------|------|
| 학습 데이터 | Roboflow `Office-Air-Condition-1` (75 epochs, yolov8n base, CPU) |
| 학습 성능 | mAP@0.5 **0.989** (epoch 75, `train_result/results.csv`), F1 **0.97** (validation 기준) |
| Cloud Run | `us-central1` — `https://campus-energy-api-992786420144.us-central1.run.app/analyze` |
| BE 연동 | `ReportService.callAiApi` → multipart `file` + `metadata` → `AiAnalysisResponse` (`result`, `message`, `ac_status`, `light_status`, `reason`, `expected`) |
| 배포 절차 | [배포_가이드.md §11](./배포_가이드.md) · [ai/README.md](../../../ai/README.md) |
| 보안 | GCP 프로젝트 ID·Roboflow API 키는 placeholder 처리 |
