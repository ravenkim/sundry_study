# 에코리포트 (EcoReport)

> **2026 두유톤 해커톤 14팀** · AI 기반 캠퍼스 에너지 낭비 제보 및 보상 플랫폼

**"빈 강의실에 켜진 전등 사진 한 장 → AI 분석 → 포인트 적립"**

IoT 설비 없이 스마트폰만으로 캠퍼스 전기 낭비를 제보하면, AI가 자동 판별하고 절약 금액을 계산해 포인트를 지급하는 **크라우드소싱 기반 에너지 절약 플랫폼**입니다.

---

## 주요 기능

| 영역 | 기능 |
|------|------|
| **학생** | 제보 작성·이력 조회, 포인트 적립·교환, 건물별 절약량 확인 |
| **AI 분석** | YOLOv8n → YOLOv8n Custom → Gemini 2.5 Flash 3단 파이프라인 |
| **인증** | 이메일 회원가입/로그인, Google OAuth, JWT |
| **관리자** | 장소 관리(3단 트리), 제보·대시보드, 기프티콘·포인트 관리 |
| **리워드** | 포인트샵, 기프티콘 교환, 교환 이력 |

---

## 기술 스택

| 구분 | 기술 |
|------|------|
| **Frontend** | React 19, TypeScript, Vite 6, TailwindCSS v4, Redux Toolkit, shadcn/ui |
| **Backend** | Spring Boot 4, Java 17, JPA, Spring Security (JWT + OAuth2) |
| **Database** | MySQL 8.4, Flyway |
| **AI** | YOLOv8, Gemini Vision, FastAPI (Cloud Run) |
| **Infra** | Docker Compose, Gradle, Yarn 4 |

---

## 프로젝트 구조

```
duyuthon/
├── be/                 # Spring Boot 백엔드
├── fe/                 # React 프론트엔드
├── ai/                 # AI 학습·테스트·Cloud Run 배포
├── db/migration/       # Flyway SQL 마이그레이션
├── docs/               # 기획·발표·최종 제안서
├── deploy.sh           # 통합 배포 (MySQL + BE + FE)
└── docker-compose.yml
```

---

## 빠른 시작

### 1. 환경 변수 설정

```bash
cp .env.example .env
# .env 에 MYSQL_*, JWT_SECRET, GOOGLE_CLIENT_ID 등 설정
```

### 2. 통합 배포 (Docker Compose)

```bash
bash deploy.sh
```

| 서비스 | URL |
|--------|-----|
| Frontend | http://localhost:8081 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Health Check | http://localhost:8080/actuator/health |

### 3. 개별 개발

```bash
# Backend
cd be && ./gradlew build && ./gradlew test

# Frontend (Yarn 4 필수 — npm 사용 금지)
cd fe && yarn install && yarn dev   # http://localhost:5173
```

> 로컬 BE 실행은 Docker Compose 전용입니다. `bash deploy.sh`로 MySQL·BE·FE를 함께 기동하세요.

---

## 팀 소개 (14팀)

| 이름 | 역할 |
|------|------|
| **김해준** | 기획 총괄 · 프론트엔드 · UI/UX · 인프라 |
| **차성호** | 백엔드 개발 (Spring Boot REST API) |
| **이은총** | AI · 백엔드 · 인프라 (YOLOv8, Cloud Run, Kafka) |

---

## 기여자 (Git 커밋)

총 **186** commits · [GitHub](https://github.com/ravenkim/duyuthon)

| 이름 | GitHub | 커밋 | 주요 기여 |
|------|--------|------|-----------|
| 김해준 | [@ravenkim](https://github.com/ravenkim) | 158 | FE·BE·기획·문서·Docker 배포·Flyway |
| 이은총 | [@BarrelZebra2149](https://github.com/BarrelZebra2149) | 23 | BE API·AI 파이프라인·Gemini 연동 |
| 차성호 | [@WhiteMilk357](https://github.com/WhiteMilk357) | 5 | BE API (회원·제보·소속) |

> 줄 수 통계는 실수로 커밋됐다가 삭제된 `legalize-kr/` 법률 문서, `yarn.lock`, 이미지 파일을 제외한 **프로젝트 코드 기준**입니다.  

### 기여도 요약 (프로젝트 코드 기준)

| 작성자 | 커밋 | 추가(+) | 삭제(-) | 순 변경 | 총 변경 | 비율 |
|--------|-----:|--------:|--------:|--------:|--------:|-----:|
| **ravenkim** | 158 | +249,771 | -12,432 | +237,339 | 262,203 | **97.1%** |
| **BarrelZebra2149** | 23 | +6,226 | -841 | +5,385 | 7,067 | **2.6%** |
| **WhiteMilk** | 5 | +656 | -27 | +629 | 683 | **0.3%** |
| **합계** | **186** | **+256,653** | **-13,300** | **+243,353** | **269,953** | 100% |

### 영역별 추가 줄 수 (+)

| 작성자 | BE | FE | AI | docs | db | 기타 |
|--------|---:|---:|---:|-----:|---:|-----:|
| ravenkim | 8,296 | 31,789 | 786 | 16,138 | 661 | 192,101 |
| BarrelZebra2149 | 3,234 | 0 | 2,461 | 478 | 0 | 53 |
| WhiteMilk | 656 | 0 | 0 | 0 | 0 | 0 |

---

## 문서

| 문서 | 설명 |
|------|------|
| [최종 제안서](./docs/최종%20제안서/README.md) | 서비스 개요·기능·기술 스택·시스템 구조 |
| [기획 문서](./docs/기획/캠퍼스_에너지_절약/README.md) | 기능 정의·API 명세·DB 가이드 |
| [AI README](./ai/README.md) | YOLOv8 학습·Cloud Run 배포 |
| [FE README](./fe/README.md) | 프론트엔드 개발 가이드 |

---

## 라이선스

2026 두유톤 해커톤 프로젝트 — 14팀
