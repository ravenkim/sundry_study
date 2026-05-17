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
| roomId | Long | Y | 강의실 ID |

**Response 201 — 판별 성공**
```json
{
  "code": "SUCCESS",
  "data": {
    "reportId": 42,
    "status": "APPROVED",
    "detectedDevices": ["조명", "에어컨"],
    "pointAwarded": 89,
    "totalPoints": 459
  }
}
```

**Response 200 — 판별 불가**
```json
{
  "code": "SUCCESS",
  "data": {
    "reportId": 43,
    "status": "UNDETECTABLE",
    "message": "사진이 너무 어둡습니다. 더 밝은 환경에서 재촬영해 주세요.",
    "pointAwarded": 0
  }
}
```

**Response 200 — 반려**
```json
{
  "code": "SUCCESS",
  "data": {
    "reportId": 44,
    "status": "REJECTED",
    "reason": "PEOPLE_PRESENT",
    "message": "강의실에 사람이 있어 제보가 반려되었습니다.",
    "pointAwarded": 0
  }
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

## 건물 / 강의실

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
      "rooms": [
        { "roomId": 10, "roomNumber": "303", "floor": 3 },
        { "roomId": 11, "roomNumber": "304", "floor": 3 }
      ]
    }
  ]
}
```

---

## 관리자 API (Admin)

> Base URL: `/admin`  
> 관리자 전용 JWT 필요

### GET /admin/reports
제보 목록 조회

**Query Params**: `buildingId=1&status=PENDING&page=0&size=20`

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": {
    "content": [
      {
        "reportId": 42,
        "memberName": "김*준",
        "roomName": "303호",
        "imageUrl": "https://storage.googleapis.com/...",
        "aiResult": { "lighting_on": true, "hvac_on": true, "confidence": 0.92 },
        "status": "APPROVED",
        "pointAwarded": 89,
        "createdAt": "2026-05-20T14:03:22"
      }
    ]
  }
}
```

---

### GET /admin/dashboard
월간 절약 현황 요약

**Query Params**: `buildingId=1&year=2026&month=5`

**Response 200**
```json
{
  "code": "SUCCESS",
  "data": {
    "totalReports": 47,
    "approvedReports": 39,
    "estimatedSavingKwh": 148.2,
    "estimatedSavingKrw": 320000,
    "platformFee": 6400,
    "studentPointPool": 57600,
    "pendingSettlement": 64000
  }
}
```

---

### POST /admin/buildings
건물 등록

**Request Body**
```json
{
  "name": "공학관 A동",
  "address": "서울시 XX구 XX로 1",
  "electricityRate": 130,
  "rooms": [
    {
      "roomNumber": "303",
      "floor": 3,
      "devices": [
        { "type": "LIGHTING", "powerW": 400, "count": 1 },
        { "type": "AIR_CONDITIONER", "powerW": 1500, "count": 1 }
      ]
    }
  ]
}
```

---

## 에러 코드

| 코드 | HTTP | 설명 |
|------|------|------|
| `UNAUTHORIZED` | 401 | 인증 토큰 없음/만료 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `REPORT_DUPLICATE` | 400 | 동일 강의실 중복 제보 (1시간 내) |
| `DAILY_LIMIT_EXCEEDED` | 429 | 일일 제보 한도 초과 |
| `IMAGE_UPLOAD_FAILED` | 500 | 이미지 업로드 실패 |
| `AI_SERVICE_ERROR` | 502 | Gemini API 호출 실패 |
