# 템플릿 자원

## 설계 명세·개요 참조

`design_spec_reference.md`는 다음을 한 번에 정의하는 통합 참조 템플릿입니다.

1. **시각 사양**: 캔버스·색 구성·타이포·레이아웃 원칙
2. **콘텐츠 개요**: 슬라이드별 페이지 구조 계획
3. **기술 제약**: SVG 생성·PPT 호환의 강제 요구

[설계 명세 참조 보기](./design_spec_reference.md)

## 페이지 레이아웃 템플릿

`layouts/` 디렉터리에는 디자인 스타일별 기성 페이지 레이아웃이 있습니다.

- **일반**: 다용도 모던, 깔끔하고 유연
- **컨설팅**: 컨설팅형, 전문적이고 구조적
- **상위 컨설팅**: MBB급 컨설팅 스타일
- **학술 발표**: 학위 발표·연구 중심

- **사람용 탐색**: [layouts/README.md](./layouts/README.md)
- **AI·프로그램 조회**: [layouts/layouts_index.json](./layouts/layouts_index.json)

## 시각화 템플릿

`charts/` 디렉터리에는 52종 표준화 SVG 시각화 템플릿이 있습니다. 하위 호환을 위해 디렉터리명은 `charts/`이며, 범위는 차트·인포그래픽·프로세스 다이어그램·관계도·전략 프레임워크를 포함합니다.

- KPI 카드
- 막대 / 누적 막대
- 선 / 이축 선
- 도넛 차트
- 레이더
- 퍼널
- 매트릭스(2×2)
- 타임라인
- 간트
- 프로세스 플로우
- 조직도

- **사람용**: [charts/README.md](./charts/README.md)
- **AI·프로그램**: [charts/charts_index.json](./charts/charts_index.json)

## 아이콘 라이브러리

`icons/` 디렉터리에는 세 개 활성 라이브러리로 6700+ 벡터 아이콘이 있습니다.

| 라이브러리 | 스타일 | 개수 |
|---------|-------|-------|
| `chunk` | 채움 / 직선 기하 | 640 |
| `tabler-filled` | 채움 / 솔리드 | 1000+ |
| `tabler-outline` | 스트로크 / 선 | 5000+ |

- **사용·스타일 규칙**: [icons/README.md](./icons/README.md)
- **검색**: `ls skills/ppt-master/templates/icons/<라이브러리>/ | grep <키워드>`
