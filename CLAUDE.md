# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**에코리포트 (EcoReport)** — 2026 두유톤 해커톤 프로젝트.  
캠퍼스 빈 강의실 에너지 낭비를 학생이 사진으로 제보하면 AI가 판별하고 포인트를 지급하는 크라우드소싱 플랫폼.

기획 문서: `docs/기획/캠퍼스_에너지_절약/README.md`

## Repository Structure

```
be/              # Backend — Spring Boot 4 + MySQL + Gradle
fe/              # Frontend — React 19 + TypeScript + Vite + TailwindCSS v4
docs/            # 기획, 디자인 가이드, 회의록, API 명세
deploy.sh        # 통합 배포 (be/deploy.sh → fe/deploy.sh, Docker Compose)
docker-compose.yml
```

## Backend (be/)

### Commands
```bash
cd be
./gradlew build            # 빌드 (JAR 생성)
./gradlew test             # 전체 테스트
./gradlew test --tests "org.example.be.BeApplicationTests"  # 단일 테스트 클래스
```

> 로컬 BE 실행은 Docker Compose 전용입니다. `bash deploy.sh`로 MySQL·BE·FE를 기동하세요.

### Tech Stack
- Spring Boot 4.0.6, Java 17, Gradle
- Spring Data JPA (Hibernate), MySQL (`ddl-auto: validate` + Flyway)
- springdoc-openapi 3.0.2 — Swagger UI: `http://localhost:8080/swagger-ui.html`
- Spring Actuator — `http://localhost:8080/actuator/health`
- Lombok

### Architecture
레이어드 아키텍처: `Controller → Service(interface/impl) → Repository → Entity`

**응답 규격**
- 성공: `ApiResponse<T> { int code, T body }` — `ResponseCode` 열거형의 숫자 코드 사용 (예: 10001)
- 실패: `ApiErrorResponse { int code, String message }` — `ErrorCode` 열거형 코드 사용 (예: 2001)
- 모든 `BusinessLogicException`은 `ControllerAdvice`에서 일괄 처리

**현재 구현 상태 주의사항**
- `SecurityConfig`: JWT Resource Server 활성 — `/login`, `/register` 등 제외 경로 외 `authenticated`
- CORS: `WebConfig`에서 `allowedOriginPatterns("*")`로 전체 허용
- `MemberAuthService`: BCrypt 로그인 검증 + `JwtTokenProvider` JWT 발급
- `DefaultMemberService`: 회원가입·중복확인 + 가입 시 `MemberPoint` 0P 생성
- P0 API: `GET /api/buildings`, `GET /api/affiliations`, `GET /api/points/me`, `POST/GET /api/reports`, **`/api/admin/location-nodes/*`** (장소 CRUD)
- **소속·역할**: `Affiliation` + Flyway 시드, `GET /api/affiliations`, `LocationNode` 트리, `UserType.ADMIN` 시드, 회원가입·FE 소속 선택 UI ✅
- **장소 모델**: `LocationNode` + LEAF **자원 수량** + **`location_operating_schedule_db`(요일별 on/off)** ✅
- **AI 코드**: monorepo `ai/` — Cloud Run `/analyze` (이미지+metadata → ON/OFF + `expected` 원화). BE는 `expected` 파싱·포인트 저장
- 미구현: GCS·`aiResult` JSON DB 저장·API 상세 반환·admin reports/dashboard API·ResourceType (Phase 2). 제보 포인트는 AI 판별 직후 동기 적립 ✅
- DB·OAuth·JWT·VITE_*: 프로젝트 루트 `.env` 하나만 사용 (`cp .env.example .env`). Git 제외
- DB 연결: `MYSQL_*` + `SPRING_DATASOURCE_*` (동일 user/password). `DB_URL`/`DB_USERNAME`/`DB_PASSWORD`는 사용하지 않음

**패키지 구조**
```
org.example.be
├── api/
│   ├── advice/      # ControllerAdvice (전역 예외 처리)
│   ├── controller/  # @Controller + @ResponseBody
│   ├── request/     # inner static class 방식 (MemberRequest.Login 등)
│   └── response/    # ApiResponse, ApiErrorResponse, ResponseCode
├── config/          # JpaConfig, SecurityConfig, WebConfig, MetricsConfig
├── domain/
│   ├── model/       # @Entity 클래스
│   └── repository/  # JpaRepository 인터페이스
├── exception/       # BusinessLogicException, ErrorCode
└── service/         # 인터페이스 + 구현체 쌍
```

새 서비스 추가 시: 인터페이스(`AuthService`) + 구현체(`MemberAuthService`) 쌍으로 작성.  
새 응답 코드 추가 시: `ResponseCode` 또는 `ErrorCode` 열거형에 숫자 코드와 함께 추가.

## Frontend (fe/)

### Commands
```bash
cd fe
yarn dev          # 개발 서버 실행 (포트 5173)
yarn build        # 프로덕션 빌드
yarn lint         # ESLint
yarn test         # vitest (watch 모드)
yarn test:run     # vitest (1회 실행)
yarn storybook    # Storybook (포트 6006)
yarn format       # Prettier 포맷
```

> **패키지 매니저는 Yarn 4.9.4** — `npm` 사용 금지

### Tech Stack
- React 19, TypeScript ~5.7, Vite 6.2
- TailwindCSS v4 (`@tailwindcss/vite` 플러그인 방식 — `tailwind.config.js` 없음)
- shadcn/ui (`src/shared/lib/shadcn/`) + Radix UI 프리미티브
- Redux Toolkit + redux-saga (상태 관리)
- react-router v7 (파일 기반 자동 라우팅)
- Axios (`src/globals/api/client.tsx`)
- i18next (한국어/영어, `src/assets/locales/`)
- Pretendard 폰트 (`src/assets/fonts/` — 번들 포함)

### 파일 기반 라우팅
`src/pages/url/` 하위 `.tsx` 파일이 자동으로 라우트로 등록됨 (`router.tsx`):
- `src/pages/url/sample/SamplePage.tsx` → `/sample/sample`
- `src/pages/url/[aid]/Sample.tsx` → `/:aid/sample`
- `[파라미터]` → `:파라미터` 변환, `Page` 접미사 제거, 소문자 변환

`/`(루트)는 자동 등록 제외 — `router.tsx`에서 `HomePage`로 수동 등록.

### Redux + Saga 패턴
새 기능 추가 시 `src/features/{기능명}/{기능명}Reducer.ts`에 slice + saga 작성 후 `reduxStore.tsx`에 등록:
```ts
// reduxStore.tsx에 추가
const reducers = { ..., newReducer: newSlice.reducer }
export function* rootSaga() { yield all([..., newSaga()]) }
```

### 테마 / CSS 변수
- shadcn 토큰: `src/styles/variables.css` — oklch 색상, `.dark` 클래스로 다크모드
- `--background` 변경 시 `index.html`에도 동일하게 변경 필요 (주석에 명시됨)
- 프로젝트 브랜드 컬러: `디자인_가이드.md` — Volt Yellow(`#FFC107`), Eco Green(`#4CAF50`) 참조

### 공유 컴포넌트
- `src/shared/lib/shadcn/components/ui/` — shadcn 컴포넌트 (Button, Card, Input 등)
- `src/shared/components/` — 프로젝트 공통 컴포넌트 (SS 접두사)
- `src/shared/layout/` — 레이아웃 컴포넌트 (Wh 접두사)

### API 클라이언트
`src/globals/api/client.tsx`의 axios 인스턴스 사용. `baseURL`은 `VITE_API_HOST` 환경변수.

### 관리자 장소 관리 (FE)
- 라우트: `/admin/buildings` — UI 명칭 **장소 관리**
- 모듈: `fe/src/features/admin/buildings/` (3단 컬럼 탐색기, Sheet CRUD, `useLocationTree`)
- 용어: 1·2·3단계, 그룹/항목 (`locationTreeUtils.ts` → `LOC`)
- API: `locationNodesApi.ts` — **mock fallback 없음**
- 관리자 소속: select 없음, JWT scope에서 `affiliationId` 고정

## 배포

상세: `docs/기획/캠퍼스_에너지_절약/04_기술_기획/배포_가이드.md`

```bash
# 로컬 통합 (FE:8081, BE:8080, MySQL:3306)
bash deploy.sh              # be/deploy.sh → fe/deploy.sh (docker-compose.yml 사용)

# 개별
bash be/deploy.sh           # MySQL(필요 시) + BE
bash fe/deploy.sh           # FE

# Compose 직접 (프로젝트 루트)
docker compose down         # 중지
docker compose logs -f      # 로그
```

Docker: `cp .env.example .env` → `bash deploy.sh` (MySQL + BE + FE, Flyway·헬스체크·스키마 변경 시 DB 자동 초기화)

## 개발 환경 설정

### Backend DB
- Docker Compose 전용: MySQL `energy_db` (`mysql:3306`) + **Flyway** ([`db/migration/V*.sql`](db/migration/)) + `ddl-auto: validate`
- 시드: [`db/migration/R__seed_dev.sql`](db/migration/R__seed_dev.sql) (Flyway repeatable)
- 상세: `docs/기획/캠퍼스_에너지_절약/04_기술_기획/DB_설정_가이드.md`

### 환경변수 (Frontend)
```
VITE_API_HOST=http://localhost:8080
```
Docker/프로덕션 빌드 시 `VITE_API_HOST`가 빌드 타임에 주입된다.

## 계획된 추가 기능 (미구현)
- GCS 이미지 업로드 + `aiResult` JSON 저장·API 반환
- 포인트 적립·월/누적 집계·교환 (`rewards`, `exchange`)
- 관리자 제보 목록·대시보드 API (`GET /api/admin/reports`, `/api/admin/dashboard`) — 장소 CRUD는 ✅
- Kafka Compose + `PointProducer` 연동
- ResourceType / LocationResource (자원 유형)
- 진행 현황: `docs/남은_기능_개발_목록.md`, 장소 모델: `docs/기획/캠퍼스_에너지_절약/04_기술_기획/장소_관리_모델.md`
