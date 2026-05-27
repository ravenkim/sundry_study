# 변환 도구

원본을 PDF·문서·슬라이드 덱·웹 페이지에서 Markdown으로 바꾼 뒤 프로젝트를 만듭니다.

## `source_to_md/pdf_to_md.py`

네이티브 PDF에 권장되는 첫 선택입니다.

```bash
python3 scripts/source_to_md/pdf_to_md.py book.pdf
python3 scripts/source_to_md/pdf_to_md.py book.pdf -o output.md
python3 scripts/source_to_md/pdf_to_md.py ./pdfs
python3 scripts/source_to_md/pdf_to_md.py ./pdfs -o ./markdown
```

용도:
- Word·PowerPoint·LaTeX 등에서 내보낸 네이티브 PDF
- 로컬에 두어야 하는 민감 문서
- OCR·레이아웃 도구로 넘기기 전 1차 추출

다음 경우 MinerU 등 OCR·레이아웃 도구를 고려:
- 스캔·이미지 위주 PDF
- 다단 파싱이 나쁨
- 인코딩 깨짐

의존성:

```bash
pip install PyMuPDF
```

## `source_to_md/doc_to_md.py`

하이브리드 변환기: 흔한 형식은 순수 Python, 나머지는 pandoc 폴백.

네이티브 경로(외부 바이너리 불필요):
- `.docx` — `mammoth`
- `.html` / `.htm` — `markdownify` + `beautifulsoup4`
- `.epub` — `ebooklib` + `markdownify`
- `.ipynb` — `nbconvert`

한컴( `pyhwp2md` 필수, Python 3.10+; LibreOffice는 선택):

- `.hwp`, `.hwpx` — `hwp_best_to_md`가 **동시에** (1) `pyhwp2md` 직접,(2) LibreOffice로
  HWP→PDF 뒤 `pdf_to_md.py`, (3) HWP→DOCX 뒤 `mammoth`를 돌리고, 텍스트·표·
  머리말·이미지 링크 등 **휴리스틱 점수**로 가장 나은 MD 하나를 골라 저장합니다.
- LibreOffice가 HWP을 열 수 없는 환경(필터 없음)이면 ①만 사용합니다.
- 스크립트만 단독 실행: `python3 scripts/source_to_md/hwp_best_to_md.py file.hwp -o out.md`

Pandoc 폴백(필요할 때만):
- `.doc`, `.odt`, `.rtf`, `.tex`/`.latex`, `.rst`, `.org`, `.typ`

```bash
python3 scripts/source_to_md/doc_to_md.py lecture.docx
python3 scripts/source_to_md/doc_to_md.py lecture.docx -o output.md
python3 scripts/source_to_md/doc_to_md.py notes.epub
python3 scripts/source_to_md/doc_to_md.py paper.tex -o paper.md  # pandoc 사용
```

의존성:

```bash
# 네이티브 경로 — 항상 필요
pip install mammoth markdownify ebooklib nbconvert beautifulsoup4

# 한글 .hwp / .hwpx (pyhwp2md; project requirements.txt에 포함)
pip install pyhwp2md

# 폴백 — .doc/.odt/.rtf/.tex/.rst/.org/.typ 만 필요할 때
# macOS:   brew install pandoc
# Ubuntu:  sudo apt install pandoc
# Windows: https://pandoc.org/installing.html
```

모든 경로는 동일 규칙으로 `<입력>.md`와 형제 `<입력>_files/`(추출 이미지·상대 참조)를 만듭니다.

## `source_to_md/ppt_to_md.py`

Open XML 슬라이드 덱용 PowerPoint→Markdown 변환기.

지원 형식:
- `.pptx`, `.pptm`
- `.ppsx`, `.ppsm`
- `.potx`, `.potm`

```bash
python3 scripts/source_to_md/ppt_to_md.py sales_deck.pptx
python3 scripts/source_to_md/ppt_to_md.py sales_deck.pptx -o output.md
python3 scripts/source_to_md/ppt_to_md.py ./decks
python3 scripts/source_to_md/ppt_to_md.py ./decks -o ./markdown
python3 scripts/source_to_md/ppt_to_md.py template.ppsx -o notes/template.md
```

동작:
- 읽기 순서대로 슬라이드 텍스트 추출
- PowerPoint 표를 Markdown 표로 변환
- 형제 `_files/`에 삽입 그림 내보내기
- 발표 노트가 있으면 덧붙임

의존성:

```bash
pip install python-pptx
```

레거시 `.ppt`는 직접 파싱하지 않습니다. `.pptx`로 다시 저장하거나 PDF로 내보낸 뒤 변환하세요.

## `source_to_md/web_to_md.py` / `source_to_md/web_to_md.cjs`

웹 페이지를 Markdown으로 변환하고 이미지를 로컬에 받습니다.

### Python 버전(권장)

```bash
python3 scripts/source_to_md/web_to_md.py https://example.com/article
python3 scripts/source_to_md/web_to_md.py https://url1.com https://url2.com
python3 scripts/source_to_md/web_to_md.py -f urls.txt
python3 scripts/source_to_md/web_to_md.py https://example.com -o output.md
```

`curl_cffi`가 설치되어 있으면(`requirements.txt` 포함) 최신 Chrome TLS 지문을 흉내 내어, Python 기본 `requests` TLS로 차단되는 일부 포털·SNS 페이지를 가져올 수 있습니다. 추가 플래그 없이 동작하며, 없으면 일반 `requests`로 폴백합니다.

### Node.js 버전(폴백)

`curl_cffi`를 설치하기 어려운 환경용 백업:

```bash
node scripts/source_to_md/web_to_md.cjs https://example.com/article
```

대부분 Python 버전만으로 충분합니다. TLS 지문 검사가 심한 도메인은 `curl_cffi` 또는 Node 폴백을 검토하세요.

## `rotate_images.py`

다운로드·가져오기 자산의 EXIF 방향을 바로잡습니다.

```bash
python3 scripts/rotate_images.py auto projects/xxx_files
python3 scripts/rotate_images.py gen projects/xxx_files
python3 scripts/rotate_images.py fix fixes.json
```

변환·가져오기 후 사진이 눕는 현상에 사용합니다.
