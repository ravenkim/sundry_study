# 바텐더 — API 정의서

> 기능 상세 및 엔드포인트 목록은 [features.md](./features.md)와 동일하게 유지합니다. 본 문서는 요청·응답 스펙만 상세화합니다.

**공통**

- 기본 경로 접두사: `/api` (배포 환경에 따라 `/api` 앞에 베이스 URL이 붙을 수 있음).
- 성공 시 HTTP `200`(GET) 또는 `201`(리소스 생성 POST)을 기준으로 작성. 실제 구현 시 검증 규칙에 맞게 `400`/`404`/`500`을 추가합니다.
- 응답 본문은 JSON, 문자열 인코딩 UTF-8.
- 사용자 식별(스트릭·노트 등)은 향후 `Authorization` 또는 세션 헤더로 확장 가능. 해커톤 단계에서는 단일 로컬 프로필이라도 필드 이름은 확장 가능한 형태로 둡니다.

---

## `GET /api/greeting`

바텐더 인사와 오늘의 추천 카드 초안.

**Query (선택)**

| 이름 | 타입 | 설명 |
|------|------|------|
| `hour` | integer | 현재 시간(0–23). 없으면 서버 시간 사용 |
| `moodHint` | string | 최근 기분 힌트 (구현 선택) |

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

## `POST /api/chat`

바텐더 대화. 화면 첫 진입 시 `messages`를 빈 배열로 보내면 바텐더가 먼저 기분·음료를 묻는 첫 메시지를 반환합니다.

**요청 본문**

```json
{
  "messages": [
    { "role": "user", "content": "string" }
  ]
}
```

`messages`가 빈 배열이면 서버가 바텐더 오프닝 질문을 생성합니다. 역할 확장 시 `assistant` 포함 가능. 과음 등 안전 처리는 서버 프롬프트·후처리로 수행합니다.

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

`reply`: 바텐더 응답 텍스트. `safetyCutoffSuggested`: 과음 감지 시 마무리 권장 플래그. `recommendation`: 대화 중 추천이 포함된 경우에만 채워짐, 없으면 `null`.

---

## `POST /api/recommend`

기분·상황 기반 술·안주·음악 추천.

**요청 본문**

```json
{
  "mood": "good | normal | low | tired | hyped",
  "preferredLiquorCategory": "string | null"
}
```

`preferredLiquorCategory`: 위스키/막걸리 등 자유 문자열 또는 `null`.

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
    {
      "name": "string",
      "why": "string"
    }
  ],
  "music": {
    "title": "string",
    "youtubeSearchUrl": "string"
  }
}
```

`youtubeSearchUrl`: `https://www.youtube.com/results?search_query=...` 형식.

---

## `POST /api/fridge/recipe`

재료 목록 기반 1인분 안주 레시피 또는 배달 안내.

**요청 본문**

```json
{
  "ingredients": ["string"]
}
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

재료 충분 시 `mode`는 `recipe` 기준으로 채우고, `deliverySuggestion`는 비워도 됩니다. 재료 부족 시 `mode`가 `delivery` 성격일 수 있습니다.

---

## `GET /api/notes`

테이스팅 노트 목록.

**Query**

| 이름 | 타입 | 설명 |
|------|------|------|
| `category` | string | 선택. 위스키/맥주/와인/막걸리/기타 |

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

날짜 형식은 ISO 8601 권장.

---

## `POST /api/notes`

노트 작성.

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

위스키 전용 필드(`distillery`, `age_statement`, `cask_type`, `whisky_region`)는 `category`가 `위스키` 또는 `버번`일 때만 의미 있으며, 나머지 주종에서는 `null`로 전송합니다.

**응답 201**

```json
{
  "id": 0,
  "bartender_comment": "string"
}
```

---

## `GET /api/notes/:id`

단일 노트 상세.

**응답 200**: `POST` 요청 필드와 동일 스키마 + `id`, `created_at`, `bartender_comment`.

**응답 404**: 존재하지 않는 경우.

---

## `DELETE /api/notes/:id`

노트 삭제.

**응답 204**: 본문 없음.

**응답 404**

---

## `GET /api/notes/analysis`

취향 요약 (기록 수 제한 등은 서버 규칙).

**응답 200**

```json
{
  "ready": false,
  "summary": "string",
  "minNotesRequired": 5
}
```

`ready`: 기록 개수 미달 시 `false`, `summary`는 빈 문자열 또는 안내 문구 가능.

---

## `GET /api/streak`

방문 스트릭 및 단골 등급.

**응답 200**

```json
{
  "streak_count": 0,
  "grade": "first | regular | vip | honor",
  "last_visit": "YYYY-MM-DD"
}
```

등급 문자열은 제품에서는 한글 레이블로 매핑할 수 있습니다.

---

## `GET /api/report/weekly`

주간 음주·방문 리포트 + 바텐더 코멘트.

**Query (선택)**

| 이름 | 타입 | 설명 |
|------|------|------|
| `weekStart` | string | ISO 날짜. 없으면 이번 주 기준 |

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

문서 수정 시 기능 정의([features.md](./features.md))의 API 목록 표와 불일치가 없도록 맞춥니다.
