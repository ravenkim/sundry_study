# BAR 준 — Backend (MVP)

> 1인가구를 위한 AI 바텐더 동반자 앱의 FastAPI 백엔드. 현재는 **MVP 1단계**: Gemini 단발 채팅 + `/health` 만 제공합니다. DB / 인증 / 채팅 저장은 다음 단계에서 도입합니다.

## 디렉토리

```
be/
├─ main.py              # FastAPI 엔트리 (uvicorn main:app)
├─ requirements.txt
├─ .env.example
├─ .gitignore
└─ app/
   ├─ core/config.py    # pydantic-settings, .env 로딩
   ├─ ai/gemini_client.py   # google-genai SDK 래퍼
   ├─ schemas/chat.py
   └─ routers/chat.py   # POST /api/chat
```

## 1) 설치

```bash
cd be

# 가상환경 (권장)
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

> 한 줄로 깔고 싶다면 (가상환경 없이):
> `pip install fastapi "uvicorn[standard]" google-genai pydantic pydantic-settings`

## 2) 환경 변수

`be/.env.example` 을 복사해 `be/.env` 생성 후 값 입력:

```env
GEMINI_API_KEY=AIza...                  # doc/api_key.md 참고
GEMINI_MODEL=gemini-2.0-flash
CORS_ORIGINS=http://localhost:5173
```

`.env` 는 `.gitignore` 처리되어 있으니 커밋되지 않습니다. API 키는 절대 코드/프론트에 하드코딩하지 않습니다.

## 3) 실행

`be/` 디렉토리에서:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 4) 엔드포인트

| Method | Path | 설명 |
|--------|------|------|
| GET | `/health` | 헬스 체크 |
| POST | `/api/chat` | 바텐더 대화 (Gemini 단발 호출) |
| GET | `/docs` | Swagger UI |
| GET | `/redoc` | ReDoc |

### `POST /api/chat`

- 요청
  ```json
  { "messages": [ { "role": "user", "content": "오늘 좀 피곤해" } ] }
  ```
- `messages` 가 빈 배열이면 바텐더 첫 인사를 생성합니다.
- 응답
  ```json
  { "reply": "...", "safetyCutoffSuggested": false, "recommendation": null }
  ```

## 5) 테스트 (curl)

### 헬스 체크

```bash
curl http://localhost:8000/health
```

### 첫 인사 (빈 messages)

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\": []}"
```

### 사용자 메시지 포함

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\": [{\"role\": \"user\", \"content\": \"오늘 좀 피곤한데 가볍게 한 잔 추천해줘요\"}]}"
```

### 이력 포함 (다중 턴)

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d "{
    \"messages\": [
      {\"role\": \"user\", \"content\": \"오늘 좀 피곤해요\"},
      {\"role\": \"assistant\", \"content\": \"고생하셨네요. 가볍게 한 잔 어떠세요?\"},
      {\"role\": \"user\", \"content\": \"네, 도수 약한 걸로요\"}
    ]
  }"
```

## 6) Swagger

브라우저에서:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
