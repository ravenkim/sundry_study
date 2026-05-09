# 바텐더 — 개발 환경 설정

> 계획된 스택: React + Vite + TypeScript, Tailwind, FastAPI, SQLite, Claude API ([features.md](./features.md)). 레포 초기 상태에서는 `fe/`·`be/` 스캐폴딩 전일 수 있습니다. 아래는 그 전제에서의 표준 로컬 절차입니다.

---

## 필요 도구

| 도구 | 용도 | 비고 |
|------|------|------|
| Node.js | 프론트엔드 | LTS 권장 (예: 20.x) |
| pnpm 또는 npm 또는 yarn | 패키지 설치 | 팀 규칙에 맞게 하나 선택 |
| Python | 백엔드 | 3.11+ 권장 |
| uv 또는 pip + venv | Python 의존성 | 편한 쪽 선택 |

---

## 저장소 받기

```bash
git clone <repository-url>
cd gdg-daejeon
```

---

## Frontend (`fe/`)

스캐폴딩이 없을 경우, 루트에서 예시로 생성합니다.

```bash
cd fe
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

개발 서버 실행(템플릿 기준):

```bash
npm run dev
```

브라우저에서 Vite 안내 포트(보통 `http://localhost:5173`)를 연다.

**환경 변수(예정)**

프론트는 API 베이스 URL만 필요할 수 있습니다.

```env
VITE_API_BASE_URL=http://localhost:8000
```

구현 후 `vite.config.ts` 프록시로 CORS를 피할 수도 있습니다.

---

## Backend (`be/`)

가상환경 생성 및 실행 예시입니다.

```bash
cd be
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy
# Claude SDK는 팀이 선택한 패키지(예: anthropic 공식 SDK)에 맞게 추가
```

앱 엔트리가 `main:app`이라고 가정할 때:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**환경 변수(서버 전용)**

```env
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=sqlite:///./bartender.db
```

API 키는 **절대** 프론트 저장소나 클라이언트 번들에 넣지 않습니다.

---

## DB

- SQLite 파일 경로는 `DATABASE_URL`로 통일합니다.  
- 스키마는 [db-schema.md](./db-schema.md)를 따르고, Alembic 도입 시 마이그레이션으로 반영합니다.

---

## 통합 확인

1. 백엔드 `GET /health` 또는 `GET /docs`(FastAPI Swagger) 등으로 서버 기동 확인.  
2. 프론트에서 인사 요청 `GET /api/greeting` 연동 테스트.  
3. [api.md](./api.md)에 맞춰 나머지 엔드포인트 순차 연결.

스캐폴딩이 생기면 이 문서의 경로·스크립트 이름을 실제 `package.json` / `pyproject.toml`과 맞추어 수정합니다.
