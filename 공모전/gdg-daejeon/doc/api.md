# 바텐더 — API 정의서

> 기능 상세 및 엔드포인트 목록은 [features.md](./features.md)와 동일하게 유지합니다. 본 문서는 요청·응답 스펙만 상세화합니다.

**공통**

- 기본 경로 접두사: `/api`
- 성공 시 HTTP `200`(GET) / `201`(리소스 생성 POST) / `204`(삭제) 기준. 실제 구현 시 검증 규칙에 맞게 `400`/`401`/`403`/`404`/`409`/`500` 추가.
- 응답 본문 JSON, 인코딩 UTF-8.
- 인증 필요한 엔드포인트는 모두 `Authorization: Bearer <jwt>` 헤더 사용.
- 모든 시간 필드는 ISO 8601 UTC 권장 (예: `2026-05-09T12:30:00Z`).

---

## 에러 응답 표준

```json
{
  "detail": "human readable message",
  "code": "AUTH_INVALID_TOKEN"
}
```

| HTTP | 상황 | 예시 `code` |
|------|------|-------------|
| 400 | 검증 실패 (Pydantic) | `VALIDATION_ERROR` |
| 401 | 토큰 없음/만료/무효 | `AUTH_INVALID_TOKEN` |
| 403 | 권한 없음 (본인 아닌 룸 등) | `FORBIDDEN` |
| 404 | 리소스 없음 | `NOT_FOUND` |
| 409 | 중복 (이메일 등) | `CONFLICT` |
| 500 | 외부 호출 실패 등 | `UPSTREAM_ERROR` |

---

## 엔드포인트 목록

| Method | Endpoint | 인증 | 설명 |
|--------|----------|------|------|
| POST | `/api/auth/signup` | ✕ | 회원가입 |
| POST | `/api/auth/login` | ✕ | 로그인 (JWT 발급) |
| GET | `/api/auth/me` | ✓ | 내 정보 |
| GET | `/api/chat/features` | ✓ | feature_key 카탈로그 메타 |
| POST | `/api/chat/rooms` | ✓ | 채팅방 생성 (인사 메시지 자동 삽입) |
| GET | `/api/chat/rooms` | ✓ | 내 채팅방 목록 |
| GET | `/api/chat/rooms/{room_id}` | ✓ | 채팅방 단건 조회 |
| DELETE | `/api/chat/rooms/{room_id}` | ✓ | 채팅방 삭제 (메시지 cascade) |
| GET | `/api/chat/rooms/{room_id}/messages` | ✓ | 메시지 목록 |
| POST | `/api/chat/rooms/{room_id}/messages` | ✓ | 메시지 전송 → AI 응답 |
| POST | `/api/chat` | ✓ | **deprecated**. 신규 chat 시스템 사용 권장 |
| GET | `/api/greeting` | ✓ | 홈 진입용 가벼운 인사 + 추천 프리뷰 |
| POST | `/api/recommend` | ✓ | 술·안주·음악 단발 추천 |
| POST | `/api/fridge/recipe` | ✓ | 재료 기반 단발 레시피 |
| GET | `/api/notes` | ✓ | 테이스팅 노트 목록 |
| POST | `/api/notes` | ✓ | 테이스팅 노트 작성 |
| GET | `/api/notes/{id}` | ✓ | 노트 상세 |
| DELETE | `/api/notes/{id}` | ✓ | 노트 삭제 |
| GET | `/api/notes/analysis` | ✓ | 취향 분석 |
| GET | `/api/streak` | ✓ | 방문 스트릭 |
| GET | `/api/report/weekly` | ✓ | 주간 리포트 |

---

## Auth

### `POST /api/auth/signup`

회원가입. 이메일 정규화(소문자·trim) 후 저장.

**요청 본문**

```json
{
  "email": "user@example.com",
  "password": "string(8+)",
  "nickname": "string?"
}
```

| 필드 | 규칙 |
|------|------|
| `email` | 형식 검증, 중복 시 409 |
| `password` | 최소 8자 |
| `nickname` | 미입력 시 email local-part 사용 |

**응답 201**

```json
{
  "id": 1,
  "email": "user@example.com",
  "nickname": "user"
}
```

---

### `POST /api/auth/login`

**요청 본문**

```json
{ "email": "user@example.com", "password": "string" }
```

**응답 200**

```json
{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "user": { "id": 1, "email": "...", "nickname": "..." }
}
```

JWT payload: `sub=user_id`, `exp`(기본 24h). 인증 실패 시 401.

---

### `GET /api/auth/me`

**응답 200**

```json
{ "id": 1, "email": "...", "nickname": "..." }
```

---

## Chat (다중 채팅방)

### `GET /api/chat/features`

feature_key 카탈로그(라벨·설명·기본 인사 메시지). 프론트는 화면 카드 구성에 사용.

**응답 200**

```json
{
  "items": [
    {
      "key": "bar_counter",
      "label": "자유 대화",
      "description": "단골손님과의 자유로운 대화",
      "default_greeting": "어서오세요, 단골손님! 오늘 어떤 분위기세요?"
    }
  ]
}
```

> 등록 키 목록: `bar_counter`, `food_pairing`, `whisky_guide`, `drink_recommend`, `fridge_recipe`, `tasting_note`, `mood_checkin`, `late_night`. (백엔드 `feature_registry`에서 단일 출처로 관리)

---

### `POST /api/chat/rooms`

채팅방 생성 + 첫 인사 메시지 자동 삽입.

**요청 본문**

```json
{
  "feature_key": "drink_recommend",
  "character_key": "bartender_jun",
  "title": "string?",
  "greeting_override": "string?",
  "system_prompt_override": "string?"
}
```

| 필드 | 규칙 |
|------|------|
| `feature_key` | 등록된 키여야 함. 미등록 시 400 |
| `character_key` | 자유 문자열. 백엔드는 그대로 저장·프롬프트 빌더에 전달 |
| `title` | 미입력 시 `<feature 라벨> - <시각>` 자동 |
| `greeting_override` | 지정 시 기본 첫 인사 대신 사용 (프론트가 톤 커스터마이즈할 때) |
| `system_prompt_override` | 지정 시 기본 system_prompt 대신 사용 |

**응답 201**

```json
{
  "id": 12,
  "feature_key": "drink_recommend",
  "character_key": "bartender_jun",
  "title": "오늘 뭐 마실까 - 2026-05-09 22:10",
  "created_at": "...",
  "last_message_at": "...",
  "greeting_message": {
    "id": 33,
    "role": "assistant",
    "content": "오늘 기분이 어떠세요? ...",
    "created_at": "..."
  }
}
```

---

### `GET /api/chat/rooms`

내 채팅방 목록.

**Query (선택)**

| 이름 | 타입 | 설명 |
|------|------|------|
| `feature_key` | string | 시나리오 필터 |
| `limit` | integer | 기본 20, 최대 100 |
| `cursor` | string | 페이지네이션 (last_message_at 기반) |

**응답 200**

```json
{
  "items": [
    {
      "id": 12,
      "feature_key": "drink_recommend",
      "character_key": "bartender_jun",
      "title": "...",
      "last_message_at": "...",
      "preview": "오늘 기분이 어떠세요? ..."
    }
  ],
  "next_cursor": null
}
```

---

### `GET /api/chat/rooms/{room_id}`

본인 소유 룸이 아니면 403, 없으면 404.

**응답 200**

```json
{
  "id": 12,
  "feature_key": "...",
  "character_key": "...",
  "title": "...",
  "created_at": "...",
  "last_message_at": "..."
}
```

---

### `DELETE /api/chat/rooms/{room_id}`

본인 소유 룸이 아니면 403. 메시지 cascade 삭제.

**응답 204**: 본문 없음.

---

### `GET /api/chat/rooms/{room_id}/messages`

메시지 목록 (시간 오름차순).

**Query (선택)**

| 이름 | 타입 | 설명 |
|------|------|------|
| `limit` | integer | 기본 50, 최대 200 |
| `before` | integer | 해당 message_id 이전 메시지를 가져올 때 (위로 스크롤 페이지네이션) |

**응답 200**

```json
{
  "items": [
    { "id": 33, "role": "assistant", "content": "...", "created_at": "..." },
    { "id": 41, "role": "user", "content": "...", "created_at": "..." }
  ],
  "next_cursor": null
}
```

---

### `POST /api/chat/rooms/{room_id}/messages`

사용자 메시지 저장 → Gemini 호출 → assistant 메시지 저장 → 두 메시지 반환.

**요청 본문**

```json
{ "content": "오늘 좀 우울한데 도수 약한 거 추천해줘요" }
```

**응답 201**

```json
{
  "user_message":      { "id": 41, "role": "user",      "content": "...", "created_at": "..." },
  "assistant_message": { "id": 42, "role": "assistant", "content": "...", "created_at": "..." }
}
```

호출 흐름:

1. 룸 소유자 검증 (아니면 403)
2. 사용자 메시지 INSERT
3. `feature_registry[feature_key]` + `character_key`로 `system_instruction` 빌드
4. 최근 메시지 N개(기본 20) → Gemini contents 형식 변환
5. Gemini 호출 → 응답 텍스트 추출
6. assistant 메시지 INSERT, room.last_message_at 갱신
7. 두 메시지 반환

---

## Legacy 단발 엔드포인트 (유지)

화면(screens.md)에 단발 카드 출력 형태가 있어 유지합니다. 모두 인증 필수.

### `POST /api/chat` (deprecated)

> 신규 채팅 시스템(`/api/chat/rooms`)을 권장합니다. 이 엔드포인트는 호환성을 위해 일시 유지.

**요청 본문**

```json
{ "messages": [ { "role": "user", "content": "string" } ] }
```

빈 배열 시 바텐더 첫 인사를 반환합니다.

**응답 200**

```json
{
  "reply": "string",
  "safetyCutoffSuggested": false,
  "recommendation": {
    "drink": { "name": "string", "abv": "string", "description": "string" },
    "snack": "string",
    "music": { "title": "string", "youtubeSearchUrl": "string" }
  }
}
```

`recommendation`은 추천이 자연스러울 때만 채워지며, 없으면 `null`.

---

### `GET /api/greeting`

홈 진입용 가벼운 인사 + 오늘의 추천 프리뷰.

**Query (선택)**

| 이름 | 타입 | 설명 |
|------|------|------|
| `hour` | integer | 현재 시간(0–23). 없으면 서버 시간 사용 |
| `moodHint` | string | 최근 기분 힌트 |

**응답 200**

```json
{
  "message": "string",
  "recommendPreview": {
    "drinkName": "string",
    "snackHint": "string",
    "musicSearchQuery": "string"
  }
}
```

---

### `POST /api/recommend`

기분·상황 기반 술·안주·음악 단발 추천.

**요청 본문**

```json
{
  "mood": "good | normal | low | tired | hyped",
  "preferredLiquorCategory": "string | null"
}
```

**응답 200**

```json
{
  "drink": {
    "name": "string",
    "origin": "string",
    "abv": "string",
    "nose": "string",
    "palate": "string",
    "finish": "string"
  },
  "snacks": [
    { "name": "string", "why": "string" }
  ],
  "music": {
    "title": "string",
    "youtubeSearchUrl": "string"
  }
}
```

`youtubeSearchUrl`: `https://www.youtube.com/results?search_query=...` 형식.

---

### `POST /api/fridge/recipe`

재료 목록 기반 1인분 안주 레시피 또는 배달 안내.

**요청 본문**

```json
{ "ingredients": ["string"] }
```

**응답 200**

```json
{
  "mode": "recipe | delivery",
  "recipe": {
    "title": "string",
    "ingredientsUsed": ["string"],
    "timeMinutes": 0,
    "steps": ["string"],
    "nutritionNote": "string"
  },
  "deliverySuggestion": {
    "items": ["string"],
    "minOrderConsideration": "string"
  }
}
```

---

## Notes

### `GET /api/notes`

테이스팅 노트 목록. 본인 데이터만.

**Query**

| 이름 | 타입 | 설명 |
|------|------|------|
| `category` | string | 선택. 위스키/버번/맥주/와인/막걸리/기타 |

**응답 200**

```json
{
  "items": [
    {
      "id": 0,
      "drink_name": "string",
      "category": "string",
      "rating": 0,
      "comment": "string",
      "created_at": "string"
    }
  ]
}
```

---

### `POST /api/notes`

**요청 본문**

```json
{
  "drink_name": "string",
  "category": "위스키 | 버번 | 맥주 | 와인 | 막걸리 | 기타",
  "rating": 1,
  "aroma": "string",
  "taste": "string",
  "finish": "string",
  "comment": "string",
  "distillery": "string | null",
  "age_statement": "string | null",
  "cask_type": "string | null",
  "whisky_region": "string | null"
}
```

위스키 전용 필드는 `category`가 `위스키`/`버번`일 때만 의미가 있고, 나머지는 `null`.

**응답 201**

```json
{
  "id": 0,
  "bartender_comment": "string"
}
```

---

### `GET /api/notes/{id}`

단일 노트 상세.

**응답 200**: `POST` 요청 필드와 동일 스키마 + `id`, `created_at`, `bartender_comment`.

**응답 404**: 존재하지 않거나 본인 노트가 아닐 때.

---

### `DELETE /api/notes/{id}`

본인 노트가 아니면 404 (정보 누출 방지).

**응답 204**: 본문 없음.

---

### `GET /api/notes/analysis`

위스키 기록 5개 이상일 때 취향 요약.

**응답 200**

```json
{
  "ready": false,
  "summary": "string",
  "minNotesRequired": 5
}
```

`ready`: 미달 시 `false`, `summary`는 안내 문구.

---

## Streak / Report

### `GET /api/streak`

**응답 200**

```json
{
  "streak_count": 0,
  "grade": "first | regular | vip | honor",
  "last_visit": "YYYY-MM-DD"
}
```

---

### `GET /api/report/weekly`

**Query (선택)**

| 이름 | 타입 | 설명 |
|------|------|------|
| `weekStart` | string | ISO 날짜. 없으면 이번 주 |

**응답 200**

```json
{
  "weekStart": "string",
  "weekEnd": "string",
  "drinkSummary": "string",
  "visitsSummary": "string",
  "bartender_comment": "string"
}
```

---

## 변경 이력

문서 수정 시 [features.md](./features.md)의 API 목록 표와 불일치가 없도록 맞춥니다.

- `/api/auth/*`, `/api/chat/rooms/*` 추가 (다중 사용자·다중 채팅방).
- 기존 사용자 데이터 엔드포인트 인증 필수화.
- AI 모델: Claude → **Gemini** (`google-genai` SDK).
