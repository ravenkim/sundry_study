# 에코리포트(EcoReport) - 설계 명세

> 이 문서는 설계 정의와 실행 제약을 넘기는 통합 산출물입니다. 시각 사양·콘텐츠 개요·발표 노트 요구·구현 경계를 하류 역할에 전달합니다.

## I. 프로젝트 정보

| 항목 | 값 |
| ---- | ----- |
| **프로젝트 이름** | 에코리포트 (EcoReport) — 2026 두유톤 해커톤 |
| **캔버스 형식** | PPT 16:9 (1280 × 720 px) |
| **페이지 수** | 8장 (01 표지 / 03 문제 / 04 솔루션 / 05 핵심기능 / 06 서비스플로우 / 07 기술스택 / 08 기대효과 / 10 마무리) |
| **디자인 스타일** | A) 일반 다용도 — 시각 임팩트 우선, Google Style 기반 + 에코리포트 브랜드 컬러 교체 |
| **타깃 청중** | 두유톤 해커톤 심사위원 |
| **사용 시나리오** | 5분 발표 (목표 4:40~4:50), 라이브 데모 병행 |
| **작성일** | 2026-05-24 |

---

## II. 캔버스 명세

| 속성 | 값 |
| -------- | ----- |
| **형식** | PPT 16:9 |
| **치수** | 1280 × 720 px |
| **viewBox** | `0 0 1280 720` |
| **여백** | 좌우 60px, 상 50px, 하 50px |
| **콘텐츠 영역** | x: 60–1220, y: 50–670 (1160 × 620 px) |
| **안전 텍스트 영역** | x: 70–1210, y: 55–665 |

---

## III. 비주얼 테마

### 테마 스타일

- **스타일**: Google Style 변형 — Eco Brand
- **테마**: 라이트 테마 (흰 배경 + Eco Green/Volt Yellow 포인트)
- **톤**: 모던·친환경·기술적·활력 있는

### 색 구성

| 역할 | HEX | 용도 |
| ---- | --- | ------- |
| **배경** | `#FFFFFF` | 페이지 기본 배경 |
| **보조 배경** | `#F8F9FA` | 카드 내부, 섹션 구분 영역 |
| **주색 (Eco Green)** | `#4CAF50` | 상단 바 시작, 제목 언더라인, 아이콘 주색, CTA |
| **포인트 (Volt Yellow)** | `#FFC107` | 표지 강조, 핵심 숫자, 배지, 포인트 표현 |
| **딥 그린** | `#2E7D32` | 성공 지표, 데이터 강조 |
| **딥 텍스트** | `#1A237E` | 제목, 중요 텍스트 |
| **본문 텍스트** | `#5F6368` | 설명, 부연 |
| **보조 텍스트** | `#9AA0A6` | 주석, 페이지 번호 |
| **테두리/구분선** | `#E8EAED` | 카드 테두리, 구분선 |
| **경고/강조 레드** | `#EA4335` | 문제 슬라이드 강조, 경고 데이터 |
| **보조 블루** | `#4285F4` | 기술 스택 슬라이드 포인트 |
| **흰 텍스트** | `#FFFFFF` | 어두운 배경 위 텍스트 |

### 그라데이션 방안

```xml
<!-- 상단 4색 장식 바: Green 시작으로 변경 -->
<linearGradient id="topBarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%"   stop-color="#4CAF50"/>
  <stop offset="33%"  stop-color="#FFC107"/>
  <stop offset="66%"  stop-color="#4285F4"/>
  <stop offset="100%" stop-color="#EA4335"/>
</linearGradient>

<!-- 표지 배경 그라데이션 -->
<linearGradient id="coverBg" x1="0%" y1="0%" x2="100%" y2="100%">
  <stop offset="0%"   stop-color="#F1F8E9"/>
  <stop offset="100%" stop-color="#E8F5E9"/>
</linearGradient>

<!-- 제목 텍스트 그라데이션 -->
<linearGradient id="titleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
  <stop offset="0%"   stop-color="#2E7D32"/>
  <stop offset="100%" stop-color="#4CAF50"/>
</linearGradient>
```

---

## IV. 타이포 체계

### 글꼴 계획

**권장 프리셋**: P1 (현대 비즈·테크)

| 역할 | 글꼴 |
| ---- | ---- |
| **제목/본문** | Pretendard |
| **대체** | `system-ui, -apple-system, "Segoe UI", Arial, sans-serif` |
| **코드** | Consolas, Monaco |

**글꼴 스택**: `"Pretendard", system-ui, -apple-system, "Segoe UI", Arial, sans-serif`

### 글자 크기 계층

**기준**: 본문 = **20px** (밀집·여유 혼재 슬라이드 고려한 중간값)

| 용도 | 크기 | 굵기 |
| ------- | ----- | ------ |
| 표지 메인 제목 | 54px | 700 Bold |
| 표지 부제 | 26px | 400 Regular |
| 페이지 제목 | 38px | 700 Bold |
| 섹션/카드 제목 | 26px | 600 SemiBold |
| **본문** | **20px** | **400 Regular** |
| 데이터 숫자 (KPI) | 60px | 700 Bold |
| 주석/라벨 | 15px | 400 Regular |
| 페이지 번호/푸터 | 13px | 400 Regular |

---

## V. 레이아웃 원칙

### 페이지 구조

- **헤더 영역**: y=0, h=6px — 4색 그라데이션 장식 바 (전폭)
- **제목 영역**: y=50, h=70px — 페이지 제목 + 4색 세그먼트 언더라인
- **본문 영역**: y=140, h=510px — 메인 콘텐츠
- **푸터 영역**: y=670, h=50px — 4색 도트 장식 + 페이지 번호 (선택)

### 공통 레이아웃 모드

| 모드 | 적합한 경우 |
| ---- | ----------- |
| **중앙 카드** | 표지, 마무리 — 둥근 카드 중앙 배치 |
| **좌우 분할 (6:4)** | 텍스트+마스코트 — 콘텐츠 좌측, 마스코트/스크린샷 우측 |
| **좌우 분할 (5:5)** | 비교·2열 정보 |
| **3열 카드** | 핵심 기능 3가지 나열 |
| **2×2 그리드** | KPI 숫자 카드 |
| **전폭 다이어그램** | 선순환·아키텍처·플로우 |

### 간격 명세

| 요소 | 값 |
| ------- | --- |
| 카드 간격 | 24px |
| 콘텐츠 블록 간격 | 32px |
| 카드 패딩 | 24px |
| 카드 모서리 반경 | 16px |
| 아이콘-텍스트 간격 | 12px |
| 스크린샷 간격 | 16px |

---

## VI. 아이콘 사용 명세

### 출처

- **라이브러리**: `tabler-outline` (화면용 라이트 톤, 흰 배경에 최적)
- **사용 방식**: `{{icon:tabler-outline/아이콘명}}`
- **크기 기준**: 제목 아이콘 32px, 카드 내 아이콘 28px, 인라인 20px
- **색**: 주색 `#4CAF50` 또는 포인트 `#FFC107`, 중립은 `#5F6368`

### 권장 아이콘 목록

| 용도 | 아이콘 경로 | 슬라이드 |
| ------- | --------- | ---- |
| 조명 켜짐 (문제) | `{{icon:tabler-outline/bulb}}` | 03 |
| 에어컨 (문제) | `{{icon:tabler-outline/air-conditioning}}` | 03 |
| 경고 (문제) | `{{icon:tabler-outline/alert-triangle}}` | 03 |
| 선순환/재활용 | `{{icon:tabler-outline/recycle}}` | 04 |
| 카메라·제보 | `{{icon:tabler-outline/camera}}` | 05, 06 |
| AI 분석 | `{{icon:tabler-outline/ai}}` | 05 |
| 포인트·코인 | `{{icon:tabler-outline/coins}}` | 05, 08 |
| 잎·환경 | `{{icon:tabler-outline/leaf}}` | 08 |
| 전기·에너지 | `{{icon:tabler-outline/bolt}}` | 08 |
| 완료·체크 | `{{icon:tabler-outline/circle-check}}` | 06 |
| 클라우드 | `{{icon:tabler-outline/cloud-computing}}` | 07 |
| 건물 | `{{icon:tabler-outline/building-arch}}` | 03, 06 |
| 위치 핀 | `{{icon:tabler-outline/location-check}}` | 05 |
| 어워드 | `{{icon:tabler-outline/award}}` | 08 |

---

## VII. 시각화 참조 목록

| 시각화 유형 | 참조 템플릿 | 사용 슬라이드 | 목적 |
| ---------- | ---------- | ----------- | ---- |
| `cycle_diagram` | `templates/charts/cycle_diagram.svg` | 04 솔루션 | 학생제보→AI→포인트→관리자 선순환 구조 |
| `comparison_table` | `templates/charts/comparison_table.svg` | 03 문제, 07 기술 | 기존 해결책 한계 비교 / 기술 레이어 표 |
| `numbered_steps` | `templates/charts/numbered_steps.svg` | 05 핵심기능 | AI 3단계 파이프라인 |
| `icon_grid` | `templates/charts/icon_grid.svg` | 05 핵심기능 | 3대 핵심 기능 카드 |
| `kpi_cards` | `templates/charts/kpi_cards.svg` | 08 기대효과 | 핵심 임팩트 숫자 2개 크게 |
| `pros_cons_chart` | `templates/charts/pros_cons_chart.svg` | 04 솔루션 | IoT vs 에코리포트 비교 |
| `snake_flow` | `templates/charts/snake_flow.svg` | 06 서비스플로우 | 6단계 사용자 여정 |

---

## VIII. 이미지 자원 목록

### 마스코트 (세로형, 좌우 분할 배치)

| 파일명 | 치수 | 비율 | 용도 | 상태 |
| -------- | --------- | ----- | ------- | ------ |
| `smile.png` | 335×512 | 0.65 | 01 표지 우측, 10 마무리 우측 | 기존 |
| `sleepy.png` | 320×512 | 0.62 | 03 문제정의 우측 하단 — "방치" 표현 | 기존 |
| `recognize.png` | 356×512 | 0.70 | 04 솔루션 우측 — "발견·인식" 표현 | 기존 |

### FE 스크린샷 (세로형 390×844, 좌우 분할 배치)

| 파일명 | 화면 | 용도 | 상태 |
| -------- | ---- | ------- | ------ |
| `screen_login.png` | 로그인 | 01 표지 우측 보조 (작게) | 기존 |
| `screen_home.png` | 홈 (포인트+건물절약) | 05 핵심기능 우측 | 기존 |
| `screen_report_form.png` | 제보 작성 | 06 서비스플로우 우측 상단 | 기존 |
| `screen_report_success.png` | 제보 완료 (+100P) | 06 서비스플로우 우측 하단 | 기존 |
| `screen_reports.png` | 제보 이력 | 05 핵심기능 보조 | 기존 |
| `screen_shop.png` | 포인트샵 | 05 핵심기능 우측 | 기존 |
| `screen_admin_dashboard.png` | 관리자 대시보드 | 06 서비스플로우 하단 | 기존 |
| `screen_admin_stats.png` | 통계·차트 | 08 기대효과 보조 | 기존 |

---

## IX. 콘텐츠 개요

### 슬라이드 01 — 표지

- **레이아웃**: 중앙 카드 + 좌 4색 세로 바 + 우측 마스코트
- **제목**: EcoReport
- **부제**: AI 기반 캠퍼스 에너지 낭비 제보·보상 플랫폼
- **한 줄**: 빈 강의실 사진 한 장 → AI 분석 → 포인트 적립
- **팀 정보**: 14팀 · 김해준 · 차성호 · 이은총 | 2026 두유톤
- **시각화**: 없음 (마스코트 `smile.png` 우측 배치)
- **이미지**: `smile.png` 우측, `screen_login.png` 로고 영역 소형 미리보기

### 슬라이드 03 — 문제 정의

- **레이아웃**: 좌우 분할 (콘텐츠 좌 7 / 마스코트 우 3)
- **제목**: 왜 지금, 왜 학생인가
- **시각화**: `comparison_table` — 기존 해결책 한계 (IoT·관리인·캠페인 3행)
- **핵심 숫자 (크게)**: 교내 에너지 비용의 **30%** 빈 공간 낭비
- **내용**:
  - 수업 후 강의실 조명·에어컨 방치 — 보이지 않는 낭비
  - 100개 강의실 기준 월 **10만 원+** 불필요 지출
  - 기존 방안 3가지 한계 표 (`{{icon:tabler-outline/alert-triangle}}` 각 행)
  - 핵심 가설: 합리적 보상 → 학생 자발 제보
- **이미지**: `sleepy.png` 우측 하단 (방치 표현)

### 슬라이드 04 — 솔루션

- **레이아웃**: 상단 2열 비교 + 하단 전폭 선순환 다이어그램
- **제목**: 크라우드소싱 + AI + 포인트 보상
- **시각화**: `pros_cons_chart` → IoT(고비용·장기) vs 에코리포트(즉시·저비용) / `cycle_diagram` → 선순환 4단계
- **내용**:
  - 3축: 크라우드소싱 + AI + 포인트 보상
  - 차별점: 설비 투자 없음 · 즉시 도입 · 학생 동기
  - 선순환: 학생 제보 → AI 판별 → 포인트 적립 → 절약 → 포인트 풀 재순환
  - AI 3단계 이름만: YOLOv8n → Custom AC → Gemini 2.5 Flash
- **이미지**: `recognize.png` 우측 (발견·인식 표현)

### 슬라이드 05 — 핵심 기능

- **레이아웃**: 좌 2/3 콘텐츠 + 우 1/3 스크린샷 2개
- **제목**: 세 가지 핵심 기능
- **시각화**: `icon_grid` 3열 카드 + `numbered_steps` AI 파이프라인
- **내용**:
  - 카드 1 (`{{icon:tabler-outline/camera}}`): AI 이미지 분석 — 3단계, 5초 이내, Cloud Run 연동 ✅
  - 카드 2 (`{{icon:tabler-outline/coins}}`): 제보·포인트 — 사진+장소 → 낭비 확인 → 즉시 적립
  - 카드 3 (`{{icon:tabler-outline/building-arch}}`): 관리자 대시보드 — 6화면, 장소 관리 BE 연동 ✅
  - AI numbered_steps: ① YOLOv8n(사람·가구) → ② Custom AC(mAP 0.990) → ③ Gemini 2.5 Flash(ON/OFF)
  - 학생 UI 9화면 / 관리자 UI 6화면 (한 줄)
- **이미지**: `screen_home.png` + `screen_shop.png` 우측 2단 배치

### 슬라이드 06 — 서비스 플로우 / 데모

- **레이아웃**: 좌 플로우 + 우 스크린샷 2장 + 하단 구현 범위 표
- **제목**: 실제로 이렇게 동작합니다
- **시각화**: `snake_flow` 6단계 사용자 여정
- **내용**:
  - 6단계: 로그인 → 홈 → 제보 작성 → AI 분석 → 완료(+100P) → 이력·포인트샵
  - 시나리오: 공학관 A동 303호, 조명 켜짐 → +100P
  - 구현 범위 미니 표:
    - ✅ 완료: 전체 UI·JWT·Google OAuth·제보 API·Cloud Run AI·장소 관리 CRUD·Docker 배포
    - 🔶 mock: AI 진행 UX·포인트 적립·관리자 대시보드 데이터
  - 각주: "AI 판별은 BE→Cloud Run 연동 완료, FE 진행 UI는 UX 시연용"
- **이미지**: `screen_report_form.png` + `screen_report_success.png` 우측 2단

### 슬라이드 07 — 기술 스택

- **레이아웃**: 좌 기술 표 + 우 아키텍처 다이어그램
- **제목**: 기술 스택
- **시각화**: `comparison_table` 4레이어 표 (맞춤 레이아웃)
- **내용**:
  - FE: React 19 · Vite · TailwindCSS v4 · Redux-Saga · shadcn/ui · Recharts
  - BE: Spring Boot 4 · MySQL 8.4 · JPA · JWT(HS256) · Flyway · Google OAuth2
  - AI: YOLOv8n × 2 + Gemini 2.5 Flash · FastAPI · Cloud Run ✅
  - Infra: Docker Compose · ubuntu03 (FE:8081 / BE:8080 / MySQL)
  - 아키텍처 플로우 (SVG 직접 그리기):
    React → Spring Boot → MySQL / Cloud Run
- **이미지**: 없음

### 슬라이드 08 — 기대효과

- **레이아웃**: 상단 KPI 카드 2개 크게 + 하단 확장 텍스트
- **제목**: 기대 임팩트
- **시각화**: `kpi_cards` 2개 (좌: 월 절약 전기 / 우: 월 탄소 절감)
- **내용**:
  - KPI 1: 월 **600~1,000 kWh** 절약 (100개 강의실 기준)
  - KPI 2: 월 **280~470 kg CO₂** 절감
  - 연간: 소나무 **50~80그루** 흡수량
  - 확장: 전국 대학 → 공공기관 · 오피스 · 아파트 공용부
  - 사회적 가치: 학생 주도 탄소중립 · IoT 없는 스마트캠퍼스
- **이미지**: `screen_admin_stats.png` 우측 소형 (통계 차트 실제 UI)

### 슬라이드 10 — 마무리 · Q&A

- **레이아웃**: 중앙 카드 + 마스코트 우측
- **핵심 메시지**: *"사진 한 장이 캠퍼스 전기료를 줄입니다."*
- **내용**:
  - GitHub: https://github.com/ravenkim/duyuthon
  - 배포 URL: ubuntu03 서버 (`.env` 기준)
  - Q&A 안내
  - 팀: 14팀 · 김해준 · 차성호 · 이은총
- **시각화**: 없음
- **이미지**: `smile.png` 우측 크게

---

## X. 발표 노트 요구

- **파일 명명**: SVG명 일치 — `01_cover.md`, `03_problem.md`, `04_solution.md`, `05_features.md`, `06_demo.md`, `07_tech.md`, `08_impact.md`, `10_ending.md`
- **전체 발표 시간**: 5분 (목표 4:40~4:50)
- **노트 톤**: 대화체 — 발표자가 자연스럽게 읽을 수 있는 스크립트
- **목적**: 알림 + 설득 + 고무
- **분할 노트 파일에는 `#` 제목 줄 금지**

---

## XI. 기술 제약 알림

### SVG 생성 시 준수

1. viewBox: `0 0 1280 720`
2. 배경은 `<rect>` 요소 (전체 배경 반드시 포함)
3. 줄바꿈은 `<tspan dy="1.4em">`(`<foreignObject>` 금지)
4. 투명도는 `fill-opacity` / `stroke-opacity`; `rgba()` 금지
5. 금지: `clipPath`, `mask`, `<style>`, `class`, `foreignObject`
6. 금지: `textPath`, `animate*`, `script`
7. `marker-start/end` 조건부 허용: `<marker>`는 `<defs>` 안, `orient="auto"`
8. 스크린샷 이미지는 `{{image:파일명}}` 플레이스홀더로 삽입 (`finalize_svg.py`가 처리)
9. 마스코트 이미지도 동일하게 `{{image:smile.png}}` 형식 사용

### PPT 호환 규칙

- `<g opacity="...">` 금지(그룹 불투명도); 자식 요소마다 개별 설정
- 그림자는 미세 테두리 색 변화로 시뮬레이션
- 인라인 스타일만; 외부 CSS·`@font-face` 금지
- 그라데이션 `id`는 슬라이드별로 고유하게 접두사 붙이기 (예: `s01_titleGrad`)
