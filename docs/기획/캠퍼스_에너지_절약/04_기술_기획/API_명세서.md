# API 명세서

> Base URL: `https://api.ecoreport.kr/api`  
> 인증: Bearer JWT (Authorization 헤더)  
> 응답 형식: JSON

---

## 인증

### POST /auth/register
회원가입

**Request Body**
```json
{
  "email": "user@university.ac.kr",
  "password": "string",
  "name": "string"
}
```

**Response 201**
```json
{
  "code": "SUCCESS",
  "data": { "memberId": 1, "email": "user@university.ac.kr" }
}
```

---

### POST /auth/login
로그인

**Request Body**
```json
{
  "email": "user@university.ac.kr",
  "password": "string"
}
```

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": {
    "accessToken": "eyJ...",
    "tokenType": "Bearer"
  }
}
```

---

## 제보 (Report) — Spring Boot

> 실제 엔드포인트: `POST /api/reports` (JWT 필수). 내부적으로 Cloud Run `POST /analyze`를 호출한다.

### POST /api/reports
제보 사진 업로드 + AI 판별 후 저장

**인증**: Bearer JWT (`memberSeq` claim)

**Request**: `multipart/form-data`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| image | File | Y | 제보 사진 |
| buildingId | Long | Y | 건물 ID |
| roomName | String | Y | 강의실·호실 |
| description | String | N | 제보 메모 |
| isLightWasting | boolean | N | 사용자 체크 (AI가 `WASTE_DETECTED` 시 덮어씀) |
| isAcWasting | boolean | N | 사용자 체크 (AI가 `WASTE_DETECTED` 시 덮어씀) |
| isHeaterWasting | boolean | N | 히터 낭비 |
| isOtherWasting | boolean | N | 기타 |

**처리 로직**
1. BE → LocationNode(LEAF) 조회 — 자원 수량·요일별 운영시간
2. BE → Cloud Run `POST /analyze` (이미지 + `metadata` JSON 전달)
3. `WASTE_DETECTED` → Report `APPROVED` 저장, AI `expected`(원) 파싱 → `estimatedSavingsKrw`·`estimatedPoint` 저장, `MemberPoint` 즉시 적립
4. `PASS` / `ERROR` → `BusinessLogicException(INVALID)` — 저장 거부

**Response 200 — 성공 (`WASTE_DETECTED`만 해당)**
```json
{
  "code": 10003,
  "body": {
    "reportId": 42,
    "status": "APPROVED",
    "message": "조명과 에어컨이 켜져 있는 것으로 확인되었습니다.",
    "aiResult": {
      "result": "WASTE_DETECTED",
      "message": "조명과 에어컨이 켜져 있는 것으로 확인되었습니다.",
      "ac_status": "ON",
      "light_status": "ON",
      "expected": "494원",
      "expectedKwh": "3.8 kWh",
      "pointAwarded": 49,
      "currentBalance": 419
    }
  }
}
```

**Response 4xx — AI PASS (정상·사용 중)**
```json
{
  "code": 1005,
  "message": "정상적인 강의실 상태이거나 사람이 있어 제보할 수 없습니다: 강의실에 2명의 사람이 있습니다. 정상 상태입니다."
}
```

**Response 4xx — AI ERROR (강의실 미인식)**
```json
{
  "code": 1005,
  "message": "강의실로 인식되지 않거나 분석할 수 없는 사진입니다: 강의실로 인식되지 않습니다. (의자나 책상을 찾을 수 없음)"
}
```

**Response 5xx — AI 서버 통신 실패**
```json
{
  "code": 5003,
  "message": "AI 분석 서버와 통신할 수 없습니다."
}
```

> AI Service raw 응답 스키마는 아래 [AI Service (FastAPI)](#ai-service-fastapi--cloud-run) 참고.

---

## AI Service (FastAPI — Cloud Run)

> Base URL (운영): `https://campus-energy-api-992786420144.us-central1.run.app`  
> Spring Boot BE가 내부 호출. 클라이언트는 직접 호출하지 않음.

### POST /analyze
강의실 이미지 AI 판별 + 절약량 산출 (YOLO + Gemini 통합)

**Request**: `multipart/form-data`

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| file | File | Y | 분석할 이미지 |
| metadata | String (JSON) | Y | 강의실·제보 시각 메타데이터 |

**metadata JSON 예시**

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

- `dayOfWeek`: 1=월 … 7=일
- `operatingSchedules`: LEAF 요일별 운영시간 (DB `location_operating_schedule_db`와 동일)

**Response 200 — PASS (사람 있음 / 모두 꺼짐 / 운영시간 내)**
```json
{
  "result": "PASS",
  "message": "강의실에 2명의 사람이 있습니다. 정상 상태입니다.",
  "expected": "0원"
}
```

**Response 200 — WASTE_DETECTED**
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

**Response 200 — ERROR (강의실 미인식)**
```json
{
  "result": "ERROR",
  "message": "강의실로 인식되지 않습니다. (의자나 책상을 찾을 수 없음)"
}
```

**Response 500 — 서버 내부 오류**
```json
{
  "result": "ERROR",
  "message": "서버 내부 오류: ..."
}
```

**응답 필드**

| 필드 | 타입 | 설명 |
|------|------|------|
| result | string | `PASS` / `ERROR` / `WASTE_DETECTED` |
| message | string | 사용자·로그용 메시지 |
| ac_status | string | `ON` / `OFF` / `UNKNOWN` (선택) |
| light_status | string | `ON` / `OFF` (선택) |
| reason | string | Gemini 판단 근거 (선택) |
| expected | string | Gemini 산출 예상 절약 금액, 원화 문자열 (예: `"494원"`, `"0원"`) |
| expectedKwh | string | Gemini 산출 예상 절약 전기량 (예: `"3.8 kWh"`, `"0 kWh"`) |

**BE 저장 매핑** (`WASTE_DETECTED` 시):
- `expected` → `estimatedSavingsKrw` (숫자 파싱)
- `expectedKwh` → `estimated_kwh` (DECIMAL 파싱)
- `estimatedPoint` = `round(estimatedSavingsKrw × 0.18)`

소스: [`ai/for_deploy/campus_api/main.py`](../../../ai/for_deploy/campus_api/main.py)

---

## 절약량 (Savings)

### GET /api/savings/buildings/me
내 제보가 반영된 **건물별 절약 전기** 집계 (JWT 필수)

**집계 대상**: 본인 제보 중 `status` ∈ `PENDING`, `APPROVED` 이고 `estimated_kwh > 0`

**Response 200**
```json
{
  "code": 10020,
  "body": [
    {
      "buildingId": 1,
      "buildingName": "공학관 A동",
      "totalKwh": 86.4,
      "thisMonthKwh": 52.1,
      "reportCount": 8
    }
  ]
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| buildingId | Long | 루트 GROUP 노드 seq |
| buildingName | string | 건물명 |
| totalKwh | number | 누적 절약 kWh |
| thisMonthKwh | number | 이번 달 절약 kWh |
| reportCount | int | 집계 제보 건수 |

---

### GET /reports/me
내 제보 이력 조회

**Query Params**: `page=0&size=20`

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": {
    "content": [
      {
        "reportId": 42,
        "roomName": "공학관 A동 303호",
        "status": "APPROVED",
        "pointAwarded": 89,
        "estimatedPoint": 89,
        "offTimeMinutes": 420,
        "estimatedKwh": "0.7980",
        "createdAt": "2026-05-20T14:03:22"
      }
    ],
    "totalElements": 15,
    "totalPages": 1
  }
}
```

---

## 포인트 (Point)

### GET /points/me
내 포인트 현황 조회

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": {
    "currentBalance": 459,
    "thisMonthEarned": 220,
    "totalEarned": 1240,
    "totalRedeemed": 781
  }
}
```

---

### POST /points/exchange
포인트 교환 신청

**Request Body**
```json
{
  "rewardId": 3,
  "quantity": 1
}
```

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": {
    "transactionId": 99,
    "rewardName": "스타벅스 아메리카노",
    "pointUsed": 500,
    "remainingBalance": -41
  }
}
```

---

## 자원 유형 (ResourceType) — 공개 조회

### GET /resource-types
플랫폼에 등록된 자원 유형 목록 (제보 시 선택용)

**Query Params**: `category=ELECTRICITY` (생략 시 전체)

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "resourceTypeId": 1,
      "category": "ELECTRICITY",
      "name": "형광등",
      "unit": "W",
      "defaultValue": 40.0,
      "iconCode": "light_mode"
    },
    {
      "resourceTypeId": 2,
      "category": "ELECTRICITY",
      "name": "에어컨",
      "unit": "W",
      "defaultValue": 1500.0,
      "iconCode": "ac_unit"
    },
    {
      "resourceTypeId": 9,
      "category": "WATER",
      "name": "수도꼭지",
      "unit": "L/min",
      "defaultValue": 8.0,
      "iconCode": "water_drop"
    }
  ]
}
```

---

## 건물 / 장소

> **용어**: 학생 UX는 "건물·강의실", API/DB는 `LocationNode` 트리(GROUP/LEAF). 상세: [장소_관리_모델.md](./장소_관리_모델.md)

### GET /api/affiliations ✅
소속(캠퍼스) 목록 — 회원가입·관리자 장소 관리용. **permitAll**

**Response 200**
```json
{
  "code": 10009,
  "body": [
    {
      "affiliationId": 1,
      "name": "삼육대학교",
      "address": "서울특별시 ..."
    }
  ]
}
```

---

### GET /api/buildings ✅
등록된 장소 트리 조회 (학생 제보·장소 선택용). JWT 있으면 회원 소속·담당 구역 scope 필터.

**Response 200**
```json
{
  "code": 10002,
  "body": [
    {
      "buildingId": 1,
      "name": "공학관",
      "nodeKind": "GROUP",
      "affiliationId": 1,
      "affiliationName": "삼육대학교",
      "children": [
        {
          "locationId": 10,
          "name": "303호",
          "nodeKind": "LEAF",
          "children": []
        },
        {
          "locationId": 11,
          "name": "2층",
          "nodeKind": "GROUP",
          "children": [
            {
              "locationId": 12,
              "name": "201호",
              "nodeKind": "LEAF",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

| 필드 | 설명 |
|------|------|
| `buildingId` | 루트 GROUP 노드 ID (레거시 명칭, 실제는 LocationNode PK) |
| `nodeKind` | `GROUP` (하위 추가 가능) / `LEAF` (제보 선택 대상) |
| `children` | 하위 노드 재귀 배열 (max depth 3) |

---

## 관리자 — 장소 (LocationNode) ✅

> Base URL: `/api/admin/location-nodes` | **ADMIN** JWT 필요 (`UserType.ADMIN`)

### GET /api/admin/location-nodes/tree
관리자 장소 트리 조회

**Query Params**: `affiliationId=1` (필수)

**Response 200**
```json
{
  "code": 10010,
  "body": [
    {
      "id": 1,
      "name": "공학관",
      "nodeKind": "GROUP",
      "depth": 1,
      "sortOrder": 0,
      "locationType": null,
      "children": [
        {
          "id": 10,
          "name": "303호",
          "nodeKind": "LEAF",
          "depth": 2,
          "sortOrder": 0,
          "locationType": null,
          "acCount": 1,
          "fluorescentCount": 8,
          "ledCount": 2,
          "children": []
        }
      ]
    }
  ]
}
```

---

### POST /api/admin/location-nodes
장소 노드 생성

**Request Body — LEAF (항목, Phase 1 자원 수량)**
```json
{
  "parentId": 1,
  "affiliationId": 1,
  "name": "303호",
  "nodeKind": "LEAF",
  "acCount": 1,
  "fluorescentCount": 8,
  "ledCount": 2,
  "operatingSchedules": [
    { "dayOfWeek": 1, "closed": false, "powerOnTime": "07:00", "powerOffTime": "22:00" },
    { "dayOfWeek": 7, "closed": true }
  ]
}
```

| 필드 | 필수 | 설명 |
|------|------|------|
| `parentId` | 루트 제외 시 | 상위 GROUP 노드 ID (루트 생성 시 null) |
| `affiliationId` | Y | 소속 ID |
| `name` | Y | 표시 이름 |
| `nodeKind` | Y | `GROUP` 또는 `LEAF` |
| `acCount` | LEAF 선택 | 에어컨 대수 (기본 0) |
| `fluorescentCount` | LEAF 선택 | 형광등 개수 (기본 0) |
| `ledCount` | LEAF 선택 | LED 조명 개수 (기본 0) |
| `operatingSchedules` | LEAF 선택 | 요일별 운영시간 7행 (null 시 기본값) |

**Response 200**: `code` 10011, `body` — 생성된 TreeNode

---

### PATCH /api/admin/location-nodes/{id}
장소 노드 수정

**Request Body**
```json
{
  "name": "303호 (대형)",
  "sortOrder": 1,
  "acCount": 2,
  "fluorescentCount": 10,
  "ledCount": 4,
  "operatingSchedules": [
    { "dayOfWeek": 1, "closed": false, "powerOnTime": "07:00", "powerOffTime": "22:00" }
  ]
}
```

| 필드 | 설명 |
|------|------|
| `name` | 표시 이름 |
| `sortOrder` | 정렬 순서 (선택) |
| `acCount` | LEAF만 — 에어컨 대수 (선택) |
| `fluorescentCount` | LEAF만 — 형광등 개수 (선택) |
| `ledCount` | LEAF만 — LED 개수 (선택) |
| `operatingSchedules` | LEAF만 — 요일별 운영시간 (선택) |

**Response 200**: `code` 10012

---

### DELETE /api/admin/location-nodes/{id}
장소 노드 삭제 (하위 노드·연결 Report 있으면 거부)

**Response 200**: `code` 10013, `body`: null

---

## [목표] 향후 확장 — 자원·LocationResource (미구현)

> 아래는 P1 목표 API. 장소 CRUD는 LocationNode API로 대체됨.

### GET /buildings/{buildingId}/locations/{locationId}/resources
특정 장소의 등록된 자원 목록 조회 (제보 시 선택용)

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "locationResourceId": 101,
      "resourceType": {
        "resourceTypeId": 1,
        "category": "ELECTRICITY",
        "name": "형광등",
        "iconCode": "light_mode"
      },
      "quantity": 10,
      "effectiveValue": 40.0,
      "unit": "W"
    },
    {
      "locationResourceId": 102,
      "resourceType": {
        "resourceTypeId": 9,
        "category": "WATER",
        "name": "수도꼭지",
        "iconCode": "water_drop"
      },
      "quantity": 4,
      "effectiveValue": 8.0,
      "unit": "L/min"
    }
  ]
}
```

---

## 제보 — 변경사항

### POST /reports (업데이트)
`image` 필드 하나만 전송. AI 파이프라인(YOLOv8n → YOLOv8n Custom → Gemini 2.5 Flash) 결과를 그대로 반환한다.

**Request**: `multipart/form-data`
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| image | File | Y | 제보 사진 |

**Response 200 — PASS (사람 있음 / 모두 꺼짐)**
```json
{
  "result": "PASS",
  "message": "강의실에 2명의 사람이 있습니다. 정상 상태입니다."
}
```

**Response 200 — WASTE_DETECTED (에어컨 탐지됨)**
```json
{
  "result": "WASTE_DETECTED",
  "message": "빈 강의실에서 에너지 낭비가 발견되었습니다!",
  "ac_status": "ON",
  "light_status": "ON",
  "reason": "The cropped image shows open louvers indicating AC is running. Ceiling lights are visibly illuminated."
}
```

**Response 200 — WASTE_DETECTED (에어컨 미탐지, 조명만 켜짐)**
```json
{
  "result": "WASTE_DETECTED",
  "message": "[WARNING] 에어컨은 찾을 수 없으나, 빈 강의실에 조명이 켜져 있습니다!",
  "ac_status": "UNKNOWN",
  "light_status": "ON",
  "reason": "Ceiling fluorescent lights are clearly on. No air conditioner detected in the image."
}
```

**Response 200 — ERROR (강의실 미인식 / 서버 오류)**
```json
{
  "result": "ERROR",
  "message": "강의실로 인식되지 않습니다. (의자나 책상을 찾을 수 없음)"
}
```

---

### GET /reports/me (업데이트)

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": {
    "content": [
      {
        "reportId": 42,
        "locationName": "공학관 A동 303호",
        "locationType": "CLASSROOM",
        "detectedWastes": ["형광등", "에어컨"],
        "status": "APPROVED",
        "pointAwarded": 89,
        "createdAt": "2026-05-20T14:03:22"
      }
    ],
    "totalElements": 15,
    "totalPages": 1
  }
}
```

---

## 관리자 API (Admin)

> Base URL: `/api/admin` | 관리자 전용 JWT 필요

### GET /api/admin/reports (미구현 — FE mock)

FE `adminApi` mock 데이터 사용. mock 응답에 **`locationPath`** (상위 그룹 경로 배열) + **`locationName`** (LEAF 항목명) 필드 포함 — `ReportLocationCell`에서 상위(작게)·항목(크게) 표시.

**Response 200** (목표 스키마)
```json
{
  "code": "SUCCESS",
  "data": {
    "content": [
      {
        "reportId": 42,
        "memberName": "김*준",
        "locationName": "공학관 A동 303호",
        "locationType": "CLASSROOM",
        "imageUrl": "https://storage.googleapis.com/...",
        "aiResult": {
          "peoplePresent": false,
          "acDetected": true,
          "acStatus": "ON",
          "lightStatus": "ON",
          "reason": "The cropped image shows open louvers indicating AC is running. Ceiling lights are visibly illuminated.",
          "overallResult": "WASTE_DETECTED"
        },
        "status": "APPROVED",
        "totalSavingKrw": 494,
        "pointAwarded": 89,
        "createdAt": "2026-05-20T14:03:22"
      }
    ]
  }
}
```

---

### GET /api/admin/dashboard (미구현 — FE mock)

**Query Params**: `buildingId=1&year=2026&month=5`

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": {
    "totalReports": 47,
    "approvedReports": 39,
    "savingByCategory": {
      "ELECTRICITY": { "kWh": 148.2, "krw": 290000 },
      "WATER":       { "liters": 3840, "krw": 30000 }
    },
    "totalSavingKrw": 320000,
    "platformFee": 6400,
    "studentPointPool": 57600,
    "pendingSettlement": 64000
  }
}
```

---

### GET /super-admin/resource-types
자원 유형 목록 (슈퍼어드민)

### POST /super-admin/resource-types
새 자원 유형 등록 (슈퍼어드민 전용)

**Request Body**
```json
{
  "category": "ELECTRICITY",
  "name": "커피포트",
  "unit": "W",
  "defaultValue": 1200.0,
  "detectionHint": "주방이나 탕비실의 전기 주전자 또는 커피메이커",
  "iconCode": "coffee"
}
```

---

## 에러 코드

| 코드 | HTTP | 설명 |
|------|------|------|
| `UNAUTHORIZED` | 401 | 인증 토큰 없음/만료 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `REPORT_DUPLICATE` | 400 | 동일 장소 중복 제보 (1시간 내) |
| `DAILY_LIMIT_EXCEEDED` | 429 | 일일 제보 한도 초과 |
| `NO_REPORTABLE_RESOURCES` | 400 | 해당 장소에 제보 가능한 자원이 없음 |
| `IMAGE_UPLOAD_FAILED` | 500 | 이미지 업로드 실패 |
| `AI_SERVICE_ERROR` | 502 | Gemini API 호출 실패 |
