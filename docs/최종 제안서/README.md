# 에코리포트 (EcoReport) — 최종 제안서

> 2026 두유톤 해커톤 | 14팀  
> **"빈 강의실에 켜진 전등 사진 한 장 → AI 분석 → 포인트 적립"**

---

## 구현 범위

| 구분 | 상태 | 비고 |
|------|------|------|
| **사용자 UI** | ✅ | 홈·제보·이력·포인트샵·마이페이지·관리자 6화면 |
| **이메일 회원가입/로그인** | ✅ | BCrypt + JWT — 소속 선택 후 가입 |
| **Google OAuth** | ✅ | OAuth2 Resource Server + `/oauth/callback` |
| **계정 찾기** | ✅ | `/find-account` 화면 |
| **제보 생성 API** | ✅ | `POST /api/reports` — Cloud Run `/analyze` 연동 |
| **AI 3단계 파이프라인** | ✅ | YOLOv8n → YOLOv8n Custom → Gemini 2.5 Flash |
| **절약 금액·전기량 산출** | ✅ | `estimatedSavingsKrw`·`estimatedKwh`·`estimatedPoint` DB 저장 |
| **제보 포인트 적립** | ✅ | `WASTE_DETECTED` 시 `MemberPoint` 자동 적립 |
| **장소 관리 API + FE** | ✅ | `/api/admin/location-nodes` CRUD + 3단 컬럼 UI |
| **운영 스케줄 모델** | ✅ | `LocationOperatingSchedule` 요일별 on/off — AI metadata 연동 |
| **리워드 목록 API** | ✅ | `GET /api/rewards` |
| **포인트 교환 API** | ✅ | `POST /api/points/exchange` |
| **교환 이력 조회** | ✅ | `GET /api/points/exchanges/me` |
| **건물별 절약량 API** | ✅ | `GET /api/savings/buildings/me` |
| **관리자 기프티콘 관리** | ✅ | `/api/admin/gifticon-exchanges` |
| **관리자 제보·대시보드** | ✅ | 제보 목록·월간 절감 현황 |
| **JWT** | ✅ | HS256 발급·검증 |
| **운영 배포** | ✅ | `ubuntu03` Docker Compose (FE:8081, BE:8080, MySQL) |

---

## 문서 목차

| # | 문서 | 설명 |
|---|------|------|
| 1 | [팀 소개](./1_팀소개.md) | 14팀 구성원, 역할, 강점 |
| 2 | [서비스 개요](./2_서비스개요.md) | 서비스명, 문제 정의, 해결 방안 |
| 3 | [주요 기능](./3_주요기능.md) | AI 분석, 제보·포인트, 관리자 대시보드 |
| 4 | [지속 가능성 및 확장 가능성](./4_지속가능성_및_확장가능성.md) | 기대 효과, 수익화, 확장 로드맵 |
| 5 | [기술 스택](./5_기술스택.md) | Front-End, Back-End, AI, Infra |
| 6 | [시스템 구조](./6_시스템구조.md) | 아키텍처 다이어그램, 서버 흐름도 |
| 7 | [구현 상세](./7_구현상세.md) | 스택별 기술적 구현 특징 |
| 8 | [개발 환경 및 운영 서버](./8_개발환경_및_운영서버.md) | IDE·AI·디자인 도구, ubuntu03 서버 사양 |

---

## 서비스 핵심 가치

IoT 설비 없이, 스마트폰만으로 캠퍼스 전기료를 줄이고 그 절약분을 학생에게 돌려주는  
**크라우드소싱 기반 AI 에너지 절약 플랫폼**.

---

## 관련 문서

- [기획 문서 인덱스](../기획/캠퍼스_에너지_절약/README.md)
- [발표 PPT 슬라이드 구성](../발표/5분_발표_개요.md)
