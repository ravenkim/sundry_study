# 백엔드 구현 상태 보고서 (Backend Status Report) - v2.1

**기준 시점:** 2026-05-09
**대상 디렉토리:** /be
**참조 문서:** pi.md, rchitecture.md, ackend-plan.md

---

## 1. 현재 구현 완료된 핵심 기능

### 서버 및 인프라
- **Framework:** FastAPI 기반 비동기 서버.
- **Database:** SQLite (SQLAlchemy 2.0 모델 기반). 앱 기동 시 테이블 자동 생성 (init_db).
- **AI 연동:** google-genai SDK를 사용한 Gemini 2.0 Flash 연동 완료.
- **CORS:** 프론트엔드 연동을 위한 화이트리스트 설정 완료.

### 인증 (Auth)
- **회원가입/로그인:** JWT 발급 및 bcrypt 비밀번호 해싱 적용.
- **유연한 인증 (Lenient Auth):** 개발 및 데모 편의를 위해 Authorization 헤더가 없으면 자동으로 demo user로 동작. (JWT 전달 시 해당 사용자로 동작)

### 다중 채팅방 (Stateful Chat)
- **저장형 구조:** 모든 대화가 DB(chat_rooms, chat_messages)에 영구 저장됨.
- **Feature Registry:** ar_counter, drink_recommend, ridge_recipe, late_night 4종 시나리오 탑재.
- **인사말 생성:** 룸 생성 시 Gemini를 호출하지 않고 레지스트리의 default_greeting을 즉시 사용하여 응답 속도 최적화.

---

## 2. 프론트엔드 연동 핵심 API (Endpoints)

| 기능 | Method | Endpoint | 설명 |
|------|--------|----------|------|
| **인증** | POST | /api/auth/signup | 이메일, 비밀번호(8자+), 닉네임 |
| | POST | /api/auth/login | 토큰 발급 (ccess_token) |
| | GET | /api/auth/me | 내 프로필 정보 |
| **채팅** | GET | /api/chat/features | 선택 가능한 시나리오 카탈로그 |
| | POST | /api/chat/rooms | 채팅방 생성 (첫 인사 포함) |
| | GET | /api/chat/rooms | 내 채팅방 목록 (미리보기 포함) |
| | GET | /api/chat/rooms/{id} | 채팅방 상세 정보 |
| | GET | /api/chat/rooms/{id}/messages | 대화 내역 (시간순 정렬) |
| | POST | /api/chat/rooms/{id}/messages | 메시지 전송 → AI 응답 |

---

## 3. 기능 상세 및 내부 로직

### Feature Registry 구조 (pp/ai/feature_registry.py)
현재 4가지 페르소나가 코드 상수로 정의되어 있습니다:
- ar_counter: 자유로운 대화, 감정 케어 중심.
- drink_recommend: 상황에 맞는 술/안주 추천 전문.
- ridge_recipe: 냉장고 재료 기반 간단 안주 레시피 전문.
- late_night: 잠들기 전 차분하고 조용한 대화.

### 대화 흐름 (Flow)
1. **입장:** 프론트가 POST /api/chat/rooms 호출 (예: eature_key="bar_counter").
2. **응답:** 백엔드가 룸을 생성하고, 레지스트리의 default_greeting을 ssistant 메시지로 즉시 저장 후 반환.
3. **대화:** 프론트가 POST /api/chat/rooms/{id}/messages로 질문 전송.
4. **AI:** 백엔드가 최근 대화 내역(최대 20개) + 시나리오별 system_prompt를 Gemini에 전달하여 답변 생성 후 저장/반환.

---

## 4. MVP 데모 시나리오 (준비된 흐름)
1. (선택) 가입/로그인 진행 (또는 헤더 없이 데모 유저 사용).
2. GET /api/chat/features로 카드 목록 로딩.
3. 카드 클릭 시 POST /api/chat/rooms로 방 생성 및 입장.
4. 생성된 id를 기반으로 대화 진행.
5. 홈 화면이나 목록 화면에서 GET /api/chat/rooms로 기존 대화방 리스트 확인.

---

## 5. 아직 미구현된 기능 (구현 예정)
- **Tasting Notes:** 술 기록 및 분석 기능 (/api/notes).
- **Streak:** 방문 연속 기록 및 등급 시스템 (/api/streak).
- **Greeting/Preview:** 홈 화면 진입 시 가벼운 인사 및 추천 요약 (/api/greeting).
- **Detailed Recommend:** 정교한 단발성 추천 (/api/recommend).

---

## 6. 테스트 가이드

### Swagger (UI 테스트)
- 접속: http://localhost:8000/docs
- Authorize 버튼으로 로그인 토큰 설정 가능. (없어도 채팅은 데모 유저로 작동)

### curl 테스트 (메시지 전송 예시)
`ash
curl -X 'POST' \
  'http://localhost:8000/api/chat/rooms/1/messages' \
  -H 'Content-Type: application/json' \
  -d '{ "content": "오늘 비가 오는데 어울리는 술 있을까?" }'
`

---

## 7. 해커톤 우선순위 추천
1. **Tasting Notes (최우선):** 앱의 핵심 가치인 '기록' 기능 구현 필요.
2. **Home Greeting:** 사용자 진입 시 첫인상을 결정하는 가벼운 인사 API.
3. **Clean up:** Legacy POST /api/chat 제거 및 API 표준화.
