# 문제 해결

## `pip install`에서 `pycairo` 빌드 실패 (Unknown compiler / `cc` 없음)

`svglib` 의존성으로 `pycairo`가 설치되는데, 미리 빌드된 wheel이 없으면 소스에서 컴파일합니다. 이때 **C 컴파일러**와 **Cairo 개발 패키지**가 필요합니다.

**Ubuntu / Debian / WSL:**

```bash
sudo apt update
sudo apt install build-essential libcairo2-dev pkg-config python3-dev
```

설치 후 venv를 켠 상태에서 다시 실행합니다.

```bash
pip install -r requirements.txt
```

**macOS:** `brew install cairo pkg-config` 후 재시도.

---

## 검증 실패

1. 실행:

```bash
python3 scripts/project_manager.py validate <프로젝트경로>
```

2. 검증기가 보고한 누락 파일·잘못된 디렉터리를 수정합니다.
3. 후처리·내보내기 전에 검증을 다시 실행합니다.

## SVG 미리보기가 이상함

1. 경로·파일명을 확인합니다.
2. 명명 규칙이 일관한지 확인합니다.
3. 브라우저에서 파일 직접 열기가 불안정하면 로컬 서버로 미리봅니다:

```bash
python3 -m http.server --directory <svg_output경로> 8000
```

## 발표 노트가 분할되지 않음

`total.md`를 확인합니다:
- 제목은 `# `로 시작해야 함
- 제목 텍스트가 SVG 파일명과 일치해야 함
- 절 사이는 `---`로 구분

그다음:

```bash
python3 scripts/total_md_split.py <프로젝트경로>
```

## PPT 내보내기 품질 문제

권장 순서:

```bash
python3 scripts/total_md_split.py <프로젝트경로>
python3 scripts/finalize_svg.py <프로젝트경로>
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final
```

`svg_final/`이 있을 때 `svg_output/`에서 직접 내보내지 않습니다.

## 의존성 체크리스트

대부분 표준 라이브러리만 사용합니다. 필요할 때만 추가 설치:

```bash
pip install -r requirements.txt
```

중요 선택 패키지:
- PPTX 내보내기: `python-pptx`
- 이미지 유틸: `Pillow`
- 워터마크 제거: `numpy`
- PDF 변환: `PyMuPDF`
- 이미지 생성 백엔드: `google-genai` / `openai`
