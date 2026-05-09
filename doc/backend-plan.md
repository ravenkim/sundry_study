# 백엔드 구현 계획 — BAR 준 (v2.0)

> /be 디렉토리 기준. 
> **Gemini API (google-genai SDK)**를 사용하며, 최신 pi.md 스펙(JWT 인증, 다중 채팅방, 테이스팅 노트)을 반영합니다.

---

## 1. 기술 스택 및 환경 설정

- **Framework:** FastAPI (Python 3.11+)
- **AI SDK:** google-genai (Gemini 2.0 Flash 권장)
- **DB:** SQLite (초기) → PostgreSQL (운영 전환 고려)
- **ORM:** SQLAlchemy 2.0 + Alembic (마이그레이션)
- **Auth:** JWT (python-jose), Password Hashing (passlib + bcrypt)
- **Validation:** Pydantic v2

---

## 2. 디렉토리 구조

`	ext
be/
├── main.py                      # FastAPI 앱 진입점
├── requirements.txt
├── .env.example
├── .env                         # gitignore 대상
│
├── app/
│   ├── core/
│   │   ├── config.py            # Pydantic-settings (API_KEY, JWT_SECRET 등)
│   │   ├── security.py          # JWT 생성/검증, 패스워드 해싱
│   │   └── deps.py              # DB 세션, current_user 의존성
│   │
│   ├── db/
│   │   ├── base.py              # Base 클래스, 모델 임포트용
│   │   ├── session.py           # Engine, SessionLocal 생성
│   │   └── init_db.py           # 초기 테이블 생성 스크립트
│   │
│   ├── models/                  # SQLAlchemy 모델
│   │   ├── user.py              # User
│   │   ├── chat.py              # ChatRoom, ChatMessage
│   │   ├── note.py              # TastingNote
│   │   └── streak.py            # UserStreak
│   │
│   ├── schemas/                 # Pydantic 스키마
│   │   ├── auth.py              # Login, Signup, Token
│   │   ├── chat.py              # RoomCreate, MessageResponse 등
│   │   ├── note.py              # NoteCreate, NoteResponse
│   │   └── common.py            # ErrorResponse 등 공통
│   │
│   ├── routers/                 # API 엔드포인트 분리
│   │   ├── auth.py              # /api/auth
│   │   ├── chat.py              # /api/chat/rooms, /api/chat/features
│   │   ├── notes.py             # /api/notes
│   │   ├── streak.py            # /api/streak, /api/report/weekly
│   │   └── legacy.py            # /api/greeting, /api/recommend 등 (단발성)
│   │
│   └── services/
│       ├── gemini.py            # google-genai 클라이언트 래퍼
│       ├── chat_service.py      # 대화 이력 관리 및 프롬프트 빌더
│       └── feature_registry.py  # feature_key별 메타데이터 및 system_instruction
`

---

## 3. 단계별 구현 순서

### 1단계: 프로젝트 기초 및 Gemini 연동
- FastAPI 프로젝트 구조 생성 및 .env 연동.
- google-genai SDK를 이용한 기본 클라이언트(pp/services/gemini.py) 구현.
- GET /api/greeting (인증 미적용 상태) 구현하여 Gemini 응답 확인.

### 2단계: 인증 시스템 (Auth)
- User 모델 및 users 테이블 생성.
- JWT 기반 인증 로직(core/security.py, core/deps.py) 구현.
- /api/auth/signup, /api/auth/login, /api/auth/me 엔드포인트 완성.

### 3단계: 다중 채팅방 시스템 (Chat)
- chat_rooms, chat_messages 테이블 생성.
- eature_registry.py에 시나리오별(8종) 메타데이터 및 system_instruction 정의.
- 채팅방 생성 시 첫 인사 자동 생성 로직 구현.
- 최근 대화 내역(N개)을 포함한 Gemini 호출 Flow 완성.

### 4단계: 테이스팅 노트 및 사용자 경험 (Note & Streak)
- 	asting_notes 테이블 및 CRUD 구현.
- user_streaks 테이블 및 앱 진입 시 스트릭 갱신 로직 구현.
- Gemini를 이용한 테이스팅 노트 코멘트 생성 및 취향 분석(nalysis) 구현.
- 주간 리포트(weekly) 생성 로직 구현.

### 5단계: 고도화 및 정리
- 단발성 추천 API(ecommend, ridge/recipe)의 Gemini 프롬프트 정교화.
- 에러 응답 표준화(code 필드 포함).
- 배포 준비 (CORS 설정 확인, 환경변수 점검).

---

## 4. 주요 로직 설계

### Auth 계층
- get_current_user 의존성을 통해 모든 사용자 데이터 엔드포인트 보호.
- 패스워드는 crypt로 안전하게 저장.

### Chat & Gemini 서비스
- **Feature Registry:** eature_key를 기반으로 label, description, system_instruction을 관리.
- **Prompt Builder:** system_instruction + character_key + 대화 이력 + 사용자 메시지를 조합하여 Gemini에 전달.
- **History Management:** 최근 20개 메시지를 Gemini contents 형식(ole, parts)으로 변환하여 문맥 유지.

### DB 모델 목록 (SQLAlchemy)
- User: id, email, password_hash, nickname, created_at
- ChatRoom: id, user_id, feature_key, character_key, title, created_at, last_message_at
- ChatMessage: id, room_id, role(user/assistant), content, created_at
- TastingNote: id, user_id, drink_name, category, rating, ..., bartender_comment, created_at
- UserStreak: id, user_id, last_visit, streak_count, grade

### feature_registry 구조
`python
FEATURES = {
    "bar_counter": {
        "label": "자유 대화",
        "default_greeting": "어서오세요! 오늘은 어떤 기분이신가요?",
        "system_instruction": "당신은 노련한 바텐더 준입니다. ..."
    },
    # food_pairing, whisky_guide, drink_recommend, fridge_recipe, 
    # tasting_note, mood_checkin, late_night 등 정의
}
`

---

## 5. 가장 먼저 구현해야 할 최소 기능 (MVF)

1. **서버 인프라:** FastAPI + Pydantic Settings + Health Check.
2. **AI 연동:** gemini.py 서비스 + GET /api/greeting.
3. **인증 기본:** User 모델 + JWT 발급/검증.
4. **채팅 기본:** 단일 채팅방 생성 + 메시지 주고받기 (DB 저장 포함).
