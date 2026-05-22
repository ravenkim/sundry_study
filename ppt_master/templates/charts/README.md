# SVG 시각화 템플릿 라이브러리(52종)

이 디렉터리는 PPT Master에서 **구조화된 시각화 선택 참조**로 쓰는 **52종 표준화 SVG 시각화 템플릿**을 제공합니다.

> 하위 호환을 위해 디렉터리명은 `charts/`이며, 범위는 차트·인포그래픽·프로세스 다이어그램·관계도·전략 프레임워크를 포함합니다.

- **전체 색인**: [README.md](./README.md)(사람용)
- **JSON 색인**: [charts_index.json](./charts_index.json)(AI·프로그램 조회 — 권장)

차트 페이지를 만들기 전에 해당 템플릿 파일을 검토해 구조·레이아웃을 파악합니다.

## 빠른 선택

> **AI·프로그램 권장**: `charts_index.json` 읽기를 우선합니다. 이 README는 사람이 빠르게 고를 때 씁니다.

| 보여주고 싶은 것 | 권장 시각화 | 파일명 |
|-------------------|---------------------------|----------|
| 핵심 수치 지표 | KPI 카드 | `kpi_cards.svg` |
| 범주 값 비교 | 막대 차트 | `bar_chart.svg` |
| 긴 라벨 순위 | 가로 막대 | `horizontal_bar_chart.svg` |
| 다중 시리즈 비교 | 그룹 막대 | `grouped_bar_chart.svg` |
| 시계열 추세 | 선 차트 | `line_chart.svg` |
| 누적 추세 | 영역 차트 | `area_chart.svg` |
| 비율 구성 | 파이/도넛 | `pie_chart.svg` / `donut_chart.svg` |
| 목표 달성률 | 진행 바/게이지 | `progress_bar_chart.svg` / `gauge_chart.svg` |
| 전환 퍼널 | 퍼널 | `funnel_chart.svg` |
| 일정·일정표 | 간트 | `gantt_chart.svg` |
| 이정표 | 타임라인 | `timeline.svg` |
| 다차원 평가 | 레이더 | `radar_chart.svg` |
| 양방향 비교 | 나비 차트 | `butterfly_chart.svg` |
| 증감 분해 | 워터폴 | `waterfall_chart.svg` |
| 흐름·자금 배분 | 생키 | `sankey_chart.svg` |
| 전략 분석 | SWOT / 포터 5포스 | `swot_analysis.svg` / `porter_five_forces.svg` |
| 사분면 분석 | 매트릭스(2×2) | `matrix_2x2.svg` |

## 전체 시각화 색인

### 비교

| 파일명 | 용도 | 사용 예 |
|----------|---------|-----------|
| `bar_chart.svg` | 세로 막대(3~8개) | 매출 비교, 지역 순위 |
| `horizontal_bar_chart.svg` | 가로 막대(5~12개) | 브랜드 순위, 만족도 |
| `grouped_bar_chart.svg` | 다중 시리즈 그룹 | 분기 제품군, 전년·분기 대비 |
| `stacked_bar_chart.svg` | 누적 구성 비교 | 매출 구성, 점유 변화 |
| `butterfly_chart.svg` | 양방향 비교 | 인구 피라미드, A/B, 수입·지출 |
| `bullet_chart.svg` | 목표 대 실적 | KPI 달성, 성과 평가 |
| `dumbbell_chart.svg` | 다차원 점수 비교 | 경쟁 분석, 복합 지수 |
| `waterfall_chart.svg` | 증감 요인 분해 | 이익 분해, 예산 차이 |

### 추세

| 파일명 | 용도 | 사용 예 |
|----------|---------|-----------|
| `line_chart.svg` | 추세 선(다중 선) | 시계열, 성장 |
| `area_chart.svg` | 누적 영역 추세 | 트래픽, 사용자 증가 |
| `stacked_area_chart.svg` | 다중 누적 추세 | 매출원, 유입원 변화 |
| `dual_axis_line_chart.svg` | 이축 다른 단위 | 매출 vs 이익률, 유입 vs 전환 |

### 비율

| 파일명 | 용도 | 사용 예 |
|----------|---------|-----------|
| `pie_chart.svg` | 기본 비율(3~6조각) | 점유, 예산 배분 |
| `donut_chart.svg` | 링 비율(중앙 수치) | 구조 비, 범주 구성 |
| `treemap_chart.svg` | 계층 면적 비 | 예산, 점유 구성 |

### 지표

| 파일명 | 용도 | 사용 예 |
|----------|---------|-----------|
| `kpi_cards.svg` | 핵심 지표 카드(2×2/1×4) | 재무 개요, 대시보드 |
| `gauge_chart.svg` | 게이지 달성률 | KPI, 모니터링 |
| `progress_bar_chart.svg` | 다항목 진행 바 | OKR, 프로젝트 진행 |

### 분석

| 파일명 | 용도 | 사용 예 |
|----------|---------|-----------|
| `radar_chart.svg` | 다차원 평가(4~8축) | 역량, 경쟁 비교 |
| `scatter_chart.svg` | 상관·분포 | 투입-산출, 가격-수요 |
| `funnel_chart.svg` | 전환 퍼널(3~5단) | 영업, 사용자 전환 |
| `matrix_2x2.svg` | 사분면 분석 | BCG, 우선순위 |
| `bubble_chart.svg` | 3차원 버블(X/Y/크기) | 시장 규모·성장·점유 |
| `heatmap_chart.svg` | 히트맵 행렬 | 활동 시간대, 상관 행렬 |
| `pareto_chart.svg` | 파레토 80/20 | 품질 귀인, 매출 기여 |
| `box_plot_chart.svg` | 박스플롯 분포 | 급여, 품질 관리 |

### 프로젝트·관계

| 파일명 | 용도 | 사용 예 |
|----------|---------|-----------|
| `gantt_chart.svg` | 간트(6~12작업) | PM, 로드맵 |
| `timeline.svg` | 타임라인(3~8노드) | 이정표, 연혁 |
| `process_flow.svg` | 프로세스 단계 | 업무 프로세스, 가이드 |
| `org_chart.svg` | 조직(2~4레벨) | 회사 구조, 보고 관계 |
| `sankey_chart.svg` | 3층 흐름 | 예산 흐름, 전환 경로 |

### 전략 프레임워크

| 파일명 | 용도 | 사용 예 |
|----------|---------|-----------|
| `swot_analysis.svg` | SWOT 사분면 | 전략, 경쟁 |
| `porter_five_forces.svg` | 포터 5가지 힘 | 산업 분석, 진입 평가 |
