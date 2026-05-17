# AI 모델 설계

---

## 1. AI 역할 정의

| 기능 | AI 여부 | 방법 |
|------|---------|------|
| 자원 낭비 판별 (전기·수도) | AI (Gemini Vision) | 이미지 분류 — 자원 유형별 동적 프롬프트 |
| 공간 내 인원 감지 | AI (Gemini Vision) | 객체 감지 |
| 절약량 계산 (전기·수도) | 규칙 기반 | 자원 분류별 수식 엔진 |
| 어뷰징 탐지 | 규칙 기반 | 임계값 필터 |
| (P2) 낭비 패턴 예측 | AI (시계열) | 추후 구현 |

---

## 2. Gemini Vision API 활용

### 모델
- `gemini-1.5-flash` (속도·비용 균형)
- 이미지 1장당 API 호출 1회

### 프롬프트 동적 생성 전략

제보 요청 시 해당 `LocationResource`의 `ResourceType.detection_hint`를 조합해 AI 프롬프트를 런타임에 생성.  
→ 관리자가 새 자원 유형을 추가하면 코드 수정 없이 AI가 자동으로 감지 대상에 포함.

#### 프롬프트 생성 예시 (Spring Boot 서버측)

```java
// 제보 대상 LocationResource의 ResourceType 목록으로 프롬프트 조립
String resourceList = locationResources.stream()
    .map(lr -> "- " + lr.getResourceType().getName()
             + ": " + lr.getResourceType().getDetectionHint())
    .collect(Collectors.joining("\n"));

String systemPrompt = """
    당신은 건물 자원 낭비를 탐지하는 AI입니다.
    이 장소에는 다음 자원이 설치되어 있습니다:
    %s
    
    사진을 분석하여 각 자원의 낭비 여부와 공간 내 사람 유무를 판별하세요.
    반드시 다음 JSON 형식으로만 응답하세요:
    {
      "people_present": boolean,
      "detected_wastes": [
        { "resource_name": string, "is_wasting": boolean, "confidence": float }
      ],
      "overall_confidence": float
    }
    """.formatted(resourceList);
```

#### 생성된 프롬프트 예시 — 303호 (형광등 + 에어컨)

```
이 장소에는 다음 자원이 설치되어 있습니다:
- 형광등: 천장에 설치된 형광등 또는 LED 조명
- 에어컨: 벽걸이형 또는 스탠드형 에어컨

사진을 분석하여 각 자원의 낭비 여부와 공간 내 사람 유무를 판별하세요.
```

#### 생성된 프롬프트 예시 — 1층 화장실 (수도꼭지 + 형광등)

```
이 장소에는 다음 자원이 설치되어 있습니다:
- 수도꼭지: 세면대 또는 싱크대 수도꼭지에서 물이 흐르는 상태
- 형광등: 천장에 설치된 형광등 또는 LED 조명
```

---

### AI 응답 예시

```json
{
  "people_present": false,
  "detected_wastes": [
    { "resource_name": "형광등", "is_wasting": true,  "confidence": 0.95 },
    { "resource_name": "에어컨", "is_wasting": true,  "confidence": 0.88 },
    { "resource_name": "수도꼭지", "is_wasting": false, "confidence": 0.91 }
  ],
  "overall_confidence": 0.91
}
```

### 판별 로직 (확장 후)

```
if (people_present == true):
    → 전체 제보 반려 ("재실 중인 공간입니다")

elif (overall_confidence < 0.70):
    → 전체 보류 ("판별 불가 — 더 밝은 사진으로 재촬영 요청")

else:
    detected_wastes 중 is_wasting == true 항목만 필터
    → 낭비 항목 없으면: 반려 ("낭비 감지되지 않음")
    → 낭비 항목 있으면: 해당 자원별 절약량 계산 → 포인트 합산 → 승인
```

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

| 지표 | 목표값 | 비고 |
|------|-------|------|
| 판별 정확도 | 85% 이상 | 밝은 낮 실내 사진 기준 |
| 판별 소요 시간 | 5초 이내 | Gemini Flash 기준 |
| 판별 불가 비율 | 15% 이하 | 어두운 사진, 흐린 각도 등 |
| API 비용 | 건당 약 0.01달러 이하 | gemini-1.5-flash 기준 |

---

## 6. 향후 고도화 방향 (해커톤 이후)

| 단계 | 내용 |
|------|------|
| 단기 | 사진 품질 가이드 UI로 판별불가율 감소 |
| 중기 | 낭비 패턴 시계열 분석 → 상습 방치 강의실 예측 알림 |
| 장기 | 자체 경량 분류 모델 파인튜닝 (API 비용 절감) |
