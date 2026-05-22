# PPT Master 도구 모음

이 디렉터리는 변환·프로젝트 설정·SVG 처리·내보내기·이미지 생성용 사용자 대면 스크립트를 담습니다.

## 디렉터리 구조

- 최상위 `scripts/`: 실행 진입 스크립트
- `scripts/source_to_md/`: 원본 → Markdown 변환기(`pdf_to_md.py`, `doc_to_md.py`, `hwp_best_to_md.py`, `ppt_to_md.py`, `web_to_md.py`, `web_to_md.cjs`)
- `scripts/image_backends/`: `image_gen.py`가 쓰는 내부 제공자 구현
- `scripts/template_import/`: `pptx_template_import.py`가 쓰는 PPTX 참조 준비 헬퍼
- `scripts/svg_finalize/`: `finalize_svg.py`가 쓰는 후처리 헬퍼
- `scripts/docs/`: 주제별 스크립트 문서
- `scripts/assets/`: 스크립트가 소비하는 정적 자산

## 빠른 시작

전형적인 끝에서 끝 워크플로:

```bash
python3 scripts/source_to_md/pdf_to_md.py <file.pdf>
# 또는
python3 scripts/source_to_md/doc_to_md.py <file.hwp>  # or .hwpx; pyhwp2md
python3 scripts/source_to_md/ppt_to_md.py <deck.pptx>
python3 scripts/project_manager.py init <프로젝트명> --format ppt169
python3 scripts/project_manager.py import-sources <프로젝트경로> <원본들...> --move
python3 scripts/total_md_split.py <프로젝트경로>
python3 scripts/finalize_svg.py <프로젝트경로>
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final
```

저장소 갱신:

```bash
python3 scripts/update_repo.py
```

## 스크립트 색인

| 영역 | 주요 스크립트 | 문서 |
|------|-----------------|---------------|
| 변환 | `source_to_md/pdf_to_md.py`, `doc_to_md.py`, `ppt_to_md.py`, `web_to_md.py`, `web_to_md.cjs` | [docs/conversion.md](./docs/conversion.md) |
| 프로젝트 | `project_manager.py`, `batch_validate.py`, `generate_examples_index.py`, `error_helper.py`, `pptx_template_import.py` | [docs/project.md](./docs/project.md) |
| SVG 파이프라인 | `finalize_svg.py`, `svg_to_pptx.py`, `total_md_split.py`, `svg_quality_checker.py` | [docs/svg-pipeline.md](./docs/svg-pipeline.md) |
| 이미지 | `image_gen.py`, `analyze_images.py`, `gemini_watermark_remover.py` | [docs/image.md](./docs/image.md) |
| 저장소 유지보수 | `update_repo.py` | README 설치/갱신 절 |
| 문제 해결 | 검증·미리보기·내보내기·의존성 | [docs/troubleshooting.md](./docs/troubleshooting.md) |

## 자주 쓰는 명령

변환:

```bash
python3 scripts/source_to_md/pdf_to_md.py <file.pdf>
python3 scripts/source_to_md/ppt_to_md.py <deck.pptx>
python3 scripts/source_to_md/doc_to_md.py <file.docx>
python3 scripts/source_to_md/doc_to_md.py <file.hwp>  # or .hwpx
python3 scripts/source_to_md/web_to_md.py <url>
```

프로젝트 설정:

```bash
python3 scripts/project_manager.py init <프로젝트명> --format ppt169
python3 scripts/project_manager.py import-sources <프로젝트경로> <원본들...> --move
python3 scripts/project_manager.py validate <프로젝트경로>
```

템플릿 원본 가져오기:

```bash
python3 scripts/pptx_template_import.py <template.pptx>
python3 scripts/pptx_template_import.py <template.pptx> --manifest-only
```

후처리·내보내기:

```bash
python3 scripts/total_md_split.py <프로젝트경로>
python3 scripts/finalize_svg.py <프로젝트경로>
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final
```

이미지 생성:

```bash
python3 scripts/image_gen.py "현대적인 미래형 업무 공간"
python3 scripts/image_gen.py --list-backends
python3 scripts/analyze_images.py <프로젝트경로>/images
```

저장소 갱신:

```bash
python3 scripts/update_repo.py
python3 scripts/update_repo.py --skip-pip
```

## 권장 사항

- 워크플로당 사용자 대면 진입점은 `scripts/` 최상위에 하나씩 유지
- 제공자별·헬퍼 내부 구현은 하위 디렉터리로 분리
- 통합 진입점으로 `project_manager.py`, `finalize_svg.py`, `image_gen.py` 우선
- 내보내기는 `svg_output/`보다 `svg_final/` 우선

## 관련 문서

- [변환 도구](./docs/conversion.md)
- [프로젝트 도구](./docs/project.md)
- [SVG 파이프라인](./docs/svg-pipeline.md)
- [이미지 도구](./docs/image.md)
- [문제 해결](./docs/troubleshooting.md)
- [AGENTS 가이드](../../../AGENTS.md)

_최종 갱신: 2026-04-09_
