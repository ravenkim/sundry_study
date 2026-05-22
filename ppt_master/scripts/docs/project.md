# 프로젝트 도구

프로젝트 생성·검증·표준 PPT Master 작업 공간 점검을 담당합니다.

## `project_manager.py`

프로젝트 설정·검증의 메인 진입점입니다.

```bash
python3 scripts/project_manager.py init <프로젝트명> --format ppt169
python3 scripts/project_manager.py import-sources <프로젝트경로> <원본1> [<원본2> ...]
python3 scripts/project_manager.py validate <프로젝트경로>
python3 scripts/project_manager.py info <프로젝트경로>
```

참고:
- 저장소 밖 파일은 기본적으로 `sources/`로 **복사**
- `--move`면 저장소 밖 파일은 **이동**
- 이미 저장소 안에 있는 소스는 기본 **이동**(stderr 안내), 실수 커밋 방지
- 저장소 내 소스를 복사만 하려면 `--copy`
- `--move`와 `--copy`는 동시 사용 불가

흔한 형식:
- `ppt169`
- `ppt43`
- `xiaohongshu`
- `moments`
- `story`
- `banner`
- `a4`

예:

```bash
python3 scripts/project_manager.py init my_presentation --format ppt169
python3 scripts/project_manager.py validate projects/my_presentation_ppt169_20251116
python3 scripts/project_manager.py info projects/my_presentation_ppt169_20251116
```

## `project_utils.py`

다른 스크립트가 쓰는 공유 헬퍼 모듈입니다.

```python
from project_utils import get_project_info, validate_project_structure
```

직접 실행해 빠르게 확인할 수도 있습니다:

```bash
python3 scripts/project_utils.py <프로젝트경로>
```

## `batch_validate.py`

프로젝트 구조·준수를 일괄 검사합니다.

```bash
python3 scripts/batch_validate.py examples
python3 scripts/batch_validate.py examples projects
python3 scripts/batch_validate.py --all
python3 scripts/batch_validate.py examples --export
```

릴리스 전·정리 전 저장소 전체 건강 점검에 사용합니다.

## `generate_examples_index.py`

`examples/README.md`를 자동으로 다시 만듭니다.

```bash
python3 scripts/generate_examples_index.py
python3 scripts/generate_examples_index.py examples
```

## `pptx_template_import.py`

`/create-template`용 통합 PPTX 준비 진입점입니다.

```bash
python3 scripts/pptx_template_import.py <template.pptx>
python3 scripts/pptx_template_import.py <template.pptx> -o <출력디렉터리>
python3 scripts/pptx_template_import.py <template.pptx> --manifest-only
python3 scripts/pptx_template_import.py <template.pptx> --keep-raw
python3 scripts/pptx_template_import.py <template.pptx> --skip-manifest
```

참고:
- `ppt/media/`에서 재사용 미디어 추출
- 슬라이드 크기·테마 색·글꼴 메타데이터 요약
- 슬라이드·레이아웃·마스터 간 배경 이미지 상속 추론
- `manifest.json`, `analysis.md`, `master_layout_refs.json`, `master_layout_analysis.md`, `assets/`, 정리된 슬라이드 SVG, `reference_svg_selection.json` 생성
- 네이티브 SVG 내보내기는 설치된 Microsoft PowerPoint가 있는 **Windows 전용**
- macOS에서는 Keynote로 PDF 내보낸 뒤 PDF 페이지를 SVG로 변환하는 폴백
- 인라인 Base64 이미지 페이로드를 외부화한 뒤 정리된 SVG를 `svg/`에 기록
- 참조 원본이 `.pptx`일 때 `/create-template`에 필요
- 기본 출력 디렉터리는 `<pptx_stem>_template_import/`
- `--manifest-only`는 슬라이드 SVG 내보내기 없이 가벼운 출력만 원할 때
- 템플릿 참조 준비용이며 최종 1:1 템플릿 납품이 아님

구현 참고: 내부 헬퍼는 `scripts/template_import/` 아래에 있습니다.

## `error_helper.py`

흔한 프로젝트 오류에 대한 표준 수정 안내를 출력합니다.

```bash
python3 scripts/error_helper.py
python3 scripts/error_helper.py missing_readme
python3 scripts/error_helper.py missing_readme project_path=my_project
```
