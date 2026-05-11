# 바텐더 — 시스템 아키텍처 (v2.0)

> 기술 스택 요약은 [features.md](./features.md)를 따릅니다. 본 문서는 최신 pi.md 스펙을 반영한 전체 구조를 정의합니다.

---

## 목표

1인가구 사용자에게 **AI 바텐더 대화**와 **식생활·음주 추천**을 제공하고, **테이스팅 노트·스트릭**으로 루틴을 만든다.

---

## 논리 구성

`mermaid
flowchart LR
  subgraph client [Frontend]
    UI[React SPA]
  end
  subgraph server [Backend]
    API[FastAPI]
    AUTH[Auth/JWT]
    REG[Feature Registry]
    SVC[Domain services]
  end
  subgraph external [External]
    GEMINI[Gemini API]
    YT[YouTube 검색 URL]
  end
  subgraph data [Data]
    DB[(SQLite)]
  end

  UI -->|HTTPS JSON + Bearer| API
  API --> AUTH
  API --> REG
  API --> SVC
  SVC --> GEMINI
  SVC --> DB
  UI -->|링크 열기| YT
`

- **Frontend:** React + Vite + TypeScript + Tailwind. 라우팅으로 로그인·홈·채팅·추천·냉장고·노트 화면 분리.
- **Backend:** FastAPI가 REST 엔드포인트 제공. 서비스 레이어에서 Feature Registry를 참조하여 AI 컨텍스트 구성.
- **AI (Gemini):** google-genai SDK 사용. chat_rooms 이력을 포함한 대화형 호출과 단발성(stateless) 호출로 구분.
- **DB:** **SQLite**를 기본 저장소로 사용. SQLAlchemy를 통해 추후 PostgreSQL 등 외부 DB로 손쉽게 전환 가능한 구조 유지.
- **음악:** 별도 API 연동 없이 **YouTube 검색 URL** 조합 방식을 유지하여 비용과 복잡도 최소화.

---

## 인증 (Auth)

- **Flow:** signup → login → JWT 발급 → Authorization 헤더 주입.
- **JWT:** sub=user_id를 포함하며, 모든 사용자 전용 API(chat, 
otes, streak)는 이 토큰을 검증하여 current_user를 식별.
- **보안:** 비밀번호는 crypt 해시로 저장하며, 서버 .env에서 관리되는 JWT_SECRET으로 토큰 서명.

---

## 서비스 계층 구조

### 1. Feature Registry (시나리오 관리)
- 각 엔드포인트나 채팅방의 성격(eature_key)에 맞는 **System Instruction**과 메타데이터를 관리.
- 예: whisky_guide는 위스키 전문 지식을, mood_checkin은 공감형 대화를 우선하도록 프롬프트 주입.

### 2. Gemini 연동 계층 (AI Service)
- **Prompt Builder:** eature_registry의 지침 + character_key의 개성 + 대화 이력(History)을 조합.
- **Context Window:** 채팅 시 최근 N개의 메시지를 Gemini contents 형식으로 변환하여 전달함으로써 문맥 유지.

---

## 주요 데이터 흐름

### A. 채팅 시스템 (저장형 / Stateful)
1. **룸 생성:** POST /api/chat/rooms 호출 시 eature_key에 따른 첫 인사 생성 및 DB 저장.
2. **메시지 전송:** 사용자 메시지 저장 → 최근 이력 포함하여 Gemini 호출 → 응답 저장 및 반환.
3. **이력 관리:** chat_rooms의 last_message_at을 갱신하여 목록 정렬 및 프리뷰에 활용.

### B. 단발 추천 (무상태 / Stateless)
- greeting, ecommend, ridge/recipe 등은 사용자의 현재 요청 데이터만으로 Gemini를 호출.
- DB에 이력을 남기지 않아 속도가 빠르고 데이터 비대화를 방지.

### C. 테이스팅 노트 & 스트릭
- **노트:** 작성 시 Gemini가 내용을 분석하여 바텐더 코멘트 생성. 5개 이상 누적 시 nalysis 호출 가능.
- **스트릭:** 앱 진입 시 last_visit과 오늘 날짜를 비교하여 연속 방문 횟수 자동 갱신.

---

## 비기능 (해커톤 범위)

| 항목 | 방향 |
|------|------|
| **DB** | **SQLite** (파일 기반으로 별도 서버 구축 없이 즉시 실행 가능) |
| **운영 확장** | DATABASE_URL 변경만으로 **PostgreSQL** 전환 가능하도록 SQLAlchemy 추상화 유지 |
| **인증** | JWT Access Token 단일 처리 (해커톤 기간 내 Refresh Token 생략 가능) |
| **비밀키** | GEMINI_API_KEY, JWT_SECRET은 서버 .env에서만 관리 |
| **CORS** | CORS_ORIGINS 설정을 통해 프론트엔드 도메인 제한 |

---

## 관련 문서

| 문서 | 내용 |
|------|------|
| [api.md](./api.md) | 엔드포인트별 상세 스펙 |
| [db-schema.md](./db-schema.md) | 테이블 관계 및 정규화 |
| [backend-plan.md](./backend-plan.md) | 구현 단계별 로드맵 |
| [persona.md](./persona.md) | 바텐더 준의 페르소나 정의 |
