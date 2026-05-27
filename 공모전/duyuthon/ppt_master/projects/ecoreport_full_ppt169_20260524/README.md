# ecoreport_full

- Canvas format: ppt169 (1280×720)
- Created: 20260524
- Slides: **30장** (5분 압축 8장 / 12분 풀 30장)

## 소스 문서

- `sources/5분_발표_개요.md` — 30장 구성·시간 분량·슬라이드별 4블록
- `sources/slides.md` — PPT 제작 원고 (8장 압축 버전)
- `sources/README.md` ~ `7_구현상세.md` — 최종 제안서

## Directories

- `svg_output/`: raw SVG output (30장)
- `svg_final/`: finalized SVG output (30장)
- `images/`: 마스코트·FE 스크린샷
- `notes/`: 발표자 노트
- `templates/`: 프로젝트 템플릿
- `sources/`: docs에서 import한 원본
- `exports/`: 생성된 PPTX (타임스탬프)

## 빌드

```bash
cd ppt_master
python3 scripts/finalize_svg.py projects/ecoreport_full_ppt169_20260524
python3 scripts/svg_to_pptx.py projects/ecoreport_full_ppt169_20260524 -s final
```

## 5분 발표 필수 슬라이드

01 → 03+03c → 04 → 05+05b+06 → 07 → 08+10
