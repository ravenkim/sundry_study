# SVG 파이프라인 도구

후처리·SVG 검증·발표 노트·PPTX 내보내기를 다룹니다.

## 권장 파이프라인

아래 순서로 실행합니다.

```bash
python3 scripts/total_md_split.py <프로젝트경로>
python3 scripts/finalize_svg.py <프로젝트경로>
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final
```

## `finalize_svg.py`

통합 후처리 진입점. SVG 정리의 권장 방법입니다.

포함 작업:
- `embed_icons.py`
- `crop_images.py`
- `fix_image_aspect.py`
- `embed_images.py`
- `flatten_tspan.py`
- `svg_rect_to_path.py`

## `svg_to_pptx.py`

프로젝트 SVG를 PPTX로 변환합니다.

```bash
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final --only native
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final --only legacy
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final --no-notes
python3 scripts/svg_to_pptx.py <프로젝트경로> -t none
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final --auto-advance 3
```

동작:
- 기본 출력: `exports/`에 타임스탬프 한 쌍 — `<프로젝트명>_<타임스탬프>.pptx`(네이티브 편집) + `<프로젝트명>_<타임스탬프>_svg.pptx`(SVG 스냅샷)
- 권장 소스 디렉터리: `svg_final/`
- `--no-notes`가 아니면 발표 노트 자동 삽입

의존성:

```bash
pip install python-pptx
```

## `total_md_split.py`

`total.md`를 슬라이드별 노트 파일로 나눕니다.

```bash
python3 scripts/total_md_split.py <프로젝트경로>
python3 scripts/total_md_split.py <프로젝트경로> -o <출력디렉터리>
python3 scripts/total_md_split.py <프로젝트경로> -q
```

요구사항:
- 각 절은 `# `로 시작
- 제목 텍스트가 SVG 파일명과 일치
- 절 사이는 `---`로 구분

## `svg_quality_checker.py`

SVG 기술 준수를 검사합니다.

```bash
python3 scripts/svg_quality_checker.py examples/project/svg_output/01_cover.svg
python3 scripts/svg_quality_checker.py examples/project/svg_output
python3 scripts/svg_quality_checker.py examples/project
python3 scripts/svg_quality_checker.py examples/project --format ppt169
python3 scripts/svg_quality_checker.py --all examples
python3 scripts/svg_quality_checker.py examples/project --export
```

검사 항목 예:
- `viewBox`
- 금지 요소
- width/height 일관성
- 줄바꿈 구조

## `svg_position_calculator.py`

차트 좌표를 분석하거나 미리 계산합니다.

```bash
python3 scripts/svg_position_calculator.py analyze <svg_file>
python3 scripts/svg_position_calculator.py interactive
python3 scripts/svg_position_calculator.py calc bar --data "East:185,South:142"
python3 scripts/svg_position_calculator.py calc pie --data "A:35,B:25,C:20"
python3 scripts/svg_position_calculator.py from-json config.json
```

AI 생성 전후 차트 기하를 검증할 때 사용합니다.

## 고급 단독 도구

### `flatten_tspan.py`

```bash
python3 scripts/svg_finalize/flatten_tspan.py examples/<프로젝트>/svg_output
python3 scripts/svg_finalize/flatten_tspan.py path/to/input.svg path/to/output.svg
```

### `svg_rect_to_path.py`

```bash
python3 scripts/svg_finalize/svg_rect_to_path.py <프로젝트경로>
python3 scripts/svg_finalize/svg_rect_to_path.py <프로젝트경로> -s final
python3 scripts/svg_finalize/svg_rect_to_path.py path/to/file.svg
```

PowerPoint 도형 변환 후에도 둥근 모서리를 살리려 할 때 사용합니다.

### `fix_image_aspect.py`

```bash
python3 scripts/svg_finalize/fix_image_aspect.py path/to/slide.svg
python3 scripts/svg_finalize/fix_image_aspect.py 01_cover.svg 02_toc.svg
python3 scripts/svg_finalize/fix_image_aspect.py --dry-run path/to/slide.svg
```

삽입 이미지가 PowerPoint 도형 변환 후 늘어날 때 사용합니다.

### `embed_icons.py`

```bash
python3 scripts/svg_finalize/embed_icons.py output.svg
python3 scripts/svg_finalize/embed_icons.py svg_output/*.svg
python3 scripts/svg_finalize/embed_icons.py --dry-run svg_output/*.svg
```

`<use data-icon="chunk/name" .../>` 등 플레이스홀더를 실제 경로 요소로 바꿉니다. `finalize_svg.py` 밖에서 수동 확인할 때 사용합니다.

## PPT 호환 규칙

PowerPoint에 안전한 투명도 문법을 씁니다.

| 피하기 | 대신 |
|------|------|
| `fill=\"rgba(...)\"` | `fill=\"#hex\"` + `fill-opacity` |
| `<g opacity=\"...\">` | 자식마다 불투명도 설정 |
| `<image opacity=\"...\">` | 마스크층 `<rect>` 겹치기 |

PowerPoint가 애매하게 다루는 것:
- 마커 기반 화살표
- 지원되지 않는 필터
- DrawingML에 매핑되지 않는 직접 SVG 기능
