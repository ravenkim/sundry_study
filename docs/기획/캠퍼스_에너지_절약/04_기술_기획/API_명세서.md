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

## 제보 (Report)

### POST /reports
제보 사진 업로드 + AI 판별 요청

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

### GET /buildings
등록된 건물 목록 조회

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": [
    {
      "buildingId": 1,
      "name": "공학관 A동",
      "locations": [
        {
          "locationId": 10,
          "name": "303호",
          "type": "CLASSROOM",
          "floor": 3
        },
        {
          "locationId": 20,
          "name": "1층 공용 화장실",
          "type": "RESTROOM",
          "floor": 1
        }
      ]
    }
  ]
}
```

---

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

> Base URL: `/admin` | 관리자 전용 JWT 필요

### POST /admin/buildings
건물 등록

**Request Body**
```json
{
  "name": "공학관 A동",
  "address": "서울시 XX구 XX로 1",
  "electricityRate": 130,
  "waterRate": 1.2
}
```

---

### POST /admin/buildings/{buildingId}/locations
장소 등록 (장소 유형 자유 선택)

**Request Body**
```json
{
  "name": "303호",
  "type": "CLASSROOM",
  "floor": 3,
  "description": "공학관 3층 대형 강의실"
}
```

**LocationType 선택 가능 값**: `CLASSROOM`, `SEMINAR_ROOM`, `OFFICE`, `RESTROOM`, `KITCHEN`, `CORRIDOR`, `LOUNGE`, `LAB`, `LIBRARY`, `OTHER`

---

### POST /admin/buildings/{buildingId}/locations/{locationId}/resources
장소에 자원 등록 (ResourceType 마스터에서 선택)

**Request Body**
```json
{
  "locationResources": [
    {
      "resourceTypeId": 1,
      "quantity": 10,
      "customValue": null,
      "isReportable": true,
      "notes": "천장 매립형 LED"
    },
    {
      "resourceTypeId": 2,
      "quantity": 1,
      "customValue": 2000.0,
      "isReportable": true,
      "notes": "실제 측정 소비전력 2000W"
    },
    {
      "resourceTypeId": 9,
      "quantity": 2,
      "customValue": null,
      "isReportable": true,
      "notes": null
    }
  ]
}
```

---

### GET /admin/reports (업데이트)

**Response 200**
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

### GET /admin/dashboard (업데이트)

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
