---
name: ppt-master
description: >
  AI 기반 다형식 SVG 콘텐츠 생성 시스템. 원본 문서(PDF/DOCX/HWP/URL/Markdown)를
  다역할 협업으로 고품질 SVG 페이지로 변환하고 PPTX로 내보냅니다. 사용자가
  "PPT 만들기", "프레젠테이션", "ppt-master" 등을 언급할 때 사용합니다.
---

# PPT Master 스킬

> AI 기반 다형식 SVG 콘텐츠 생성 시스템. 다역할 협업으로 원본 문서를 고품질 SVG 페이지로 만들고 PPTX로 내보냅니다.

**핵심 파이프라인**: `원본 문서 → 프로젝트 생성 → 템플릿 선택 → 전략가 → [이미지 생성기] → 실행자 → 후처리 → 내보내기`

> [!CAUTION]
> ## 전역 실행 규칙(필수)
>
> **이 워크플로는 엄격한 순차 파이프라인입니다. 아래 규칙은 최우선이며, 하나라도 위반하면 실행 실패로 간주합니다.**
>
> 1. **순차 실행** — 단계는 반드시 순서대로 실행합니다. 각 단계의 출력이 다음 단계의 입력입니다. 선행 조건이 충족되면 차단이 아닌 인접 단계는 사용자가 "계속"이라고 하지 않아도 이어서 진행할 수 있습니다.
> 2. **차단 = 완전 정지** — ⛔ 차단으로 표시된 단계는 완전히 멈추고, 사용자의 명시적 응답을 기다려야 하며 사용자 대신 결정하면 안 됩니다.
> 3. **단계 간 묶기 금지** — 서로 다른 단계를 한꺼번에 묶어 실행하는 것은 금지입니다. (참고: 4단계 여덟 가지 확인은 ⛔ 차단 — 권고안을 제시한 뒤 사용자 확인을 받은 뒤에만 진행합니다. 확인 후에는 설계 명세·SVG·발표 노트·후처리 등 차단이 아닌 단계는 추가 확인 없이 자동 진행할 수 있습니다.)
> 4. **진입 전 관문** — 각 단계 상단의 선행 조건(🚧 관문)을 시작 전에 반드시 확인합니다.
> 5. **추측 실행 금지** — 이후 단계용 내용을 미리 준비하는 것은 금지입니다(예: 전략가 단계에서 SVG 코드 작성).
> 6. **하위 에이전트 SVG 생성 금지** — 실행자 6단계 SVG 생성은 맥락 의존적이며 현재 메인 에이전트가 끝까지 수행해야 합니다. 슬라이드 SVG를 하위 에이전트에 위임하는 것은 금지입니다.
> 7. **페이지 순차 생성만 허용** — 실행자 6단계에서 전역 디자인 맥락을 확정한 뒤, SVG 페이지는 한 번에 연속으로 **페이지 단위 순서대로** 생성합니다. 예를 들어 5장씩 묶는 등 배치 생성은 금지입니다.

> [!IMPORTANT]
> ## 언어·소통 규칙
>
> - **응답 언어**: 사용자 입력과 제공된 원본 자료의 언어에 맞춥니다.
> - **명시적 재정의**: 사용자가 특정 언어를 요청하면 그 언어를 사용합니다.
> - **템플릿 형식**: `design_spec.md`는 `templates/design_spec_reference.md`의 **절 구조·표 제목**을 그대로 따릅니다. 채워 넣는 문장·용어는 사용자 언어에 맞춥니다.

> [!IMPORTANT]
> ## 일반 코딩 스킬과의 호환
>
> - `ppt-master`는 저장소 전용 워크플로 스킬이며 일반 앱 뼈대가 아닙니다.
> - 기본적으로 `.worktrees/`, `tests/`, 브랜치 워크플로 등을 만들거나 요구하지 않습니다.
> - 다른 코딩 스킬과 충돌하면 사용자가 달리 요청하지 않는 한 이 스킬을 우선합니다.

> [!NOTE]
> **Python**: 저장소 루트 가상환경 **`.venv`** 를 기본으로 씁니다. (예: `python3 -m venv .venv` → `source .venv/bin/activate` → `pip install -r requirements.txt`. Windows: `py -m venv .venv` → `.\.venv\Scripts\Activate.ps1`.) 이후 이 문서의 `python3` 호출은 그 환경에서 수행한다고 가정합니다.

## 주요 파이프라인 스크립트

| 스크립트 | 용도 |
|--------|------|
| `${SKILL_DIR}/scripts/source_to_md/pdf_to_md.py` | PDF → Markdown |
| `${SKILL_DIR}/scripts/source_to_md/doc_to_md.py` | 문서 → Markdown — DOCX/HTML/EPUB/IPYNB는 네이티브, **HWP/HWPX**는 `hwp_best_to_md` (pyhwp2md + 선택 LibreOffice→PDF·DOCX와 점수 비교), 구형 형식은 pandoc |
| `${SKILL_DIR}/scripts/source_to_md/ppt_to_md.py` | PowerPoint → Markdown |
| `${SKILL_DIR}/scripts/source_to_md/web_to_md.py` | 웹 페이지 → Markdown |
| `${SKILL_DIR}/scripts/source_to_md/web_to_md.cjs` | 위챗·TLS 제한 사이트용 Node 대안(`curl_cffi` 없을 때만; 설치 시 `web_to_md.py`가 위챗 처리) |
| `${SKILL_DIR}/scripts/project_manager.py` | 프로젝트 초기화·검증·관리 |
| `${SKILL_DIR}/scripts/analyze_images.py` | 이미지 분석 |
| `${SKILL_DIR}/scripts/image_gen.py` | AI 이미지 생성(다중 제공자) |
| `${SKILL_DIR}/scripts/svg_quality_checker.py` | SVG 품질 검사 |
| `${SKILL_DIR}/scripts/total_md_split.py` | 발표 노트 분할 |
| `${SKILL_DIR}/scripts/finalize_svg.py` | SVG 후처리(통합 진입점) |
| `${SKILL_DIR}/scripts/svg_to_pptx.py` | PPTX 내보내기 |

전체 도구 설명은 `${SKILL_DIR}/scripts/README.md`를 참고합니다.

## 템플릿 색인

| 색인 | 경로 | 용도 |
|-------|------|------|
| 레이아웃 템플릿 | `${SKILL_DIR}/templates/layouts/layouts_index.json` | 사용 가능한 페이지 레이아웃 조회 |
| 시각화 템플릿 | `${SKILL_DIR}/templates/charts/charts_index.json` | 차트·인포그래픽·다이어그램·프레임워크 SVG 조회 |
| 아이콘 라이브러리 | `${SKILL_DIR}/templates/icons/` | 필요 시 검색: `ls templates/icons/<라이브러리>/ \| grep <키워드>` (라이브러리: `chunk/`, `tabler-filled/`, `tabler-outline/`) |

## 독립 워크플로

| 워크플로 | 경로 | 용도 |
|----------|------|------|
| `create-template` | `workflows/create-template.md` | 독립 템플릿 제작 워크플로 |

---

## 워크플로

### 1단계: 원본 콘텐츠 처리

🚧 **관문**: 사용자가 원본 자료를 제공함(PDF/DOCX/HWP/HWPX/EPUB/URL/Markdown/텍스트/대화 내용 등 어떤 형태든 가능).

Markdown이 아닌 경우 즉시 변환합니다.

| 사용자 제공 | 명령 |
|---------------|---------|
| PDF | `python3 ${SKILL_DIR}/scripts/source_to_md/pdf_to_md.py <파일>` |
| DOCX/Word/Office | `python3 ${SKILL_DIR}/scripts/source_to_md/doc_to_md.py <파일>` |
| HWP/HWPX(한컴) | `python3 ${SKILL_DIR}/scripts/source_to_md/doc_to_md.py <파일>` (`pip install pyhwp2md`) |
| PPTX/PowerPoint | `python3 ${SKILL_DIR}/scripts/source_to_md/ppt_to_md.py <파일>` |
| EPUB/HTML/LaTeX/RST/기타 | `python3 ${SKILL_DIR}/scripts/source_to_md/doc_to_md.py <파일>` |
| 웹 링크 | `python3 ${SKILL_DIR}/scripts/source_to_md/web_to_md.py <URL>` |
| 위챗·고보안 사이트 | `python3 ${SKILL_DIR}/scripts/source_to_md/web_to_md.py <URL>` (`curl_cffi` 필요; 없으면 `node web_to_md.cjs <URL>`) |
| Markdown | 직접 읽기 |

**체크포인트 — 원본 준비 확인 후 2단계로 진행.**

---

### 2단계: 프로젝트 초기화

🚧 **관문**: 1단계 완료; 원본 준비됨(Markdown, 대화 텍스트, 대화로 정의된 요구사항 모두 유효).

```bash
python3 ${SKILL_DIR}/scripts/project_manager.py init <프로젝트명> --format <형식>
```

형식: `ppt169`(기본), `ppt43`, `xhs`, `story` 등. 전체 목록은 `references/canvas-formats.md`.

원본 반입(상황에 맞게 선택):

| 상황 | 조치 |
|-----------|--------|
| 원본 파일 있음(PDF/MD 등) | `python3 ${SKILL_DIR}/scripts/project_manager.py import-sources <프로젝트경로> <원본들...> --move` |
| 대화로만 텍스트 제공 | 반입 불필요 — 이후 단계에서 대화 맥락 직접 참조 |

> ⚠️ **`--move` 필수**: 원본(PDF/MD/이미지)은 **복사가 아니라 이동**하여 `sources/`에 보관해야 합니다.
> - 1단계에서 만든 Markdown, 원본 PDF/MD — **모두** `import-sources --move`로 프로젝트에 넣습니다.
> - `_files/` 등 중간 산출물은 스크립트가 처리합니다.
> - 실행 후 원본 경로에는 파일이 남지 않습니다.

**체크포인트 — 프로젝트 구조·`sources/`·변환 자료 확인 후 3단계로 진행.**

---

### 3단계: 템플릿 선택

🚧 **관문**: 2단계 완료; 프로젝트 디렉터리 준비됨.

⛔ **차단**: 템플릿 사용 여부가 불명확하면 옵션을 제시하고 **명시적 사용자 응답을 기다린 뒤** 진행합니다. 이미 "템플릿 없음" 또는 특정 템플릿을 밝혔다면 이 프롬프트를 건너뜁니다.

**조기 종료**: 대화 어디에서든 사용자가 "템플릿 없음"/자유 설계에 해당하는 의사를 밝혔다면 **`layouts_index.json`을 조회하지 말고** 바로 4단계로 갑니다.

**템플릿 권장 흐름**(사용자가 아직 결정하지 않은 경우만):
`${SKILL_DIR}/templates/layouts/layouts_index.json`을 읽어 사용 가능한 템플릿과 스타일 설명을 나열합니다.
**옵션 제시 시 현재 주제·콘텐츠에 맞는 전문적 권고**(특정 템플릿 또는 자유 설계, 이유 포함)를 반드시 포함합니다. 기본적으로 **자유 설계를 선호**하되, 컨설팅 보고서·연차 보고·학술 논문처럼 고정 구조가 분명히 이득인 경우는 예외입니다. 그런 뒤 사용자에게 묻습니다:

> **AI 권고**: 주제(간단 요약)를 바탕으로 **[특정 템플릿 / 자유 설계]**를 권합니다. 이유: …
>
> 참고: 두 방식 모두 완성된 디자인 결과를 냅니다. 템플릿은 검증된 **"구조+스타일" 프리셋**이고, 자유 설계는 콘텐츠에 맞춰 구조·스타일을 맞춥니다.
>
> 어떤 방식을 원하시나요?
> **A) 기존 템플릿** — 검증된 구조+스타일(템플릿명 또는 스타일 선호를 알려 주세요)
> **B) 자유 설계**(대부분 권장) — 콘텐츠에 맞춘 구조·스타일

A 확인 후 템플릿 파일을 프로젝트로 복사:
```bash
cp ${SKILL_DIR}/templates/layouts/<템플릿명>/*.svg <프로젝트경로>/templates/
cp ${SKILL_DIR}/templates/layouts/<템플릿명>/design_spec.md <프로젝트경로>/templates/
cp ${SKILL_DIR}/templates/layouts/<템플릿명>/*.png <프로젝트경로>/images/ 2>/dev/null || true
cp ${SKILL_DIR}/templates/layouts/<템플릿명>/*.jpg <프로젝트경로>/images/ 2>/dev/null || true
```

B(자유 설계) 확인 시 바로 4단계로 진행합니다.

> 새 전역 템플릿을 만들려면 `workflows/create-template.md`를 읽습니다.

**체크포인트 — 사용자가 템플릿을 선택했고(A인 경우 파일 복사 완료). 4단계로 진행.**

---

### 4단계: 전략가 단계(필수·생략 불가)

🚧 **관문**: 3단계 완료; 템플릿 선택 확정.

역할 정의 읽기:
```
Read references/strategist.md
```

> ⚠️ **`strategist.md` 필수 관문**: `design_spec.md` 작성 전에 Strategist는 `read_file templates/design_spec_reference.md`를 읽고 I~XI 전체 구조를 따라야 합니다. 자세한 규칙은 `strategist.md` 1절.

**여덟 가지 확인** 완료(`templates/design_spec_reference.md`의 전체 템플릿 구조):

⛔ **차단**: 여덟 가지 확인은 **한 묶음의 권고안**으로 제시하고, 사용자가 확인·수정할 때까지 **기다린 뒤** 설계 명세·콘텐츠 개요를 출력합니다. 워크플로의 핵심 확인 지점은 템플릿 선택과 이 단계 두 곳입니다. 확인 후 이미지 생성·슬라이드 생성·후처리는 자동으로 이어갑니다.

1. 캔버스 형식
2. 페이지 수 범위
3. 핵심 정보(청중 등)
4. 스타일 목표
5. 색 구성
6. 아이콘 사용 방식
7. 타이포 계획
8. 이미지 사용 방식

사용자가 이미지를 제공했다면 설계 명세 출력 **전에** 분석 스크립트 실행(이미지 파일을 직접 열지 말고 스크립트 출력만 사용):
```bash
python3 ${SKILL_DIR}/scripts/analyze_images.py <프로젝트경로>/images
```

> ⚠️ **이미지 규칙**: AI는 이미지 파일(`.jpg`, `.png` 등)을 직접 열거나 보면 안 됩니다. 정보는 `analyze_images.py` 출력 또는 설계 명세의 이미지 자원 목록에서만 가져옵니다.

**산출물**: `<프로젝트경로>/design_spec.md`

**체크포인트 — 단계 산출물 완료 후 다음 단계 자동 진행**:
```markdown
## 전략가 단계 완료
- [x] 여덟 가지 확인(사용자 확인)
- [x] 설계 명세·콘텐츠 개요 생성
- [ ] **다음**: [이미지 생성기 / 실행자] 단계로 자동 진행
```

---

### 5단계: 이미지 생성기 단계(조건부)

🚧 **관문**: 4단계 완료; 설계 명세·개요 생성 및 사용자 확인 완료.

> **발동 조건**: 이미지 방식에 "AI 생성"이 포함될 때. 해당 없으면 6단계로 건너뜁니다(6단계 관문은 여전히 충족해야 함).

`references/image-generator.md` 읽기

1. 설계 명세에서 상태가 "생성 대기"인 이미지를 모두 추출
2. 프롬프트 문서 생성 → `<프로젝트경로>/images/image_prompts.md`
3. 이미지 생성(CLI 권장):
   ```bash
   python3 ${SKILL_DIR}/scripts/image_gen.py "프롬프트" --aspect_ratio 16:9 --image_size 1K -o <프로젝트경로>/images
   ```

**체크포인트 — 이미지 준비 후 6단계**:
```markdown
## 이미지 생성기 단계 완료
- [x] 프롬프트 문서 작성
- [x] 모든 이미지를 images/에 저장
```

---

### 6단계: 실행자 단계

🚧 **관문**: 4단계 완료(및 5단계 해당 시 완료); 선행 산출물 준비됨.

선택한 스타일에 맞는 역할 정의 읽기:
```
Read references/executor-base.md          # 필수: 공통 지침
Read references/executor-general.md       # 일반 유연 스타일
Read references/executor-consultant.md    # 컨설팅 스타일
Read references/executor-consultant-top.md # 상위 컨설팅(MBB급)
```

> `executor-base` + 스타일 파일 하나만 읽으면 됩니다.

**디자인 파라미터 확인(필수)**: 첫 SVG 전에 설계 명세에서 캔버스·색·글꼴·본문 크기 등 핵심 파라미터를 검토·출력합니다. 자세한 내용은 `executor-base.md` 2절.

> ⚠️ **메인 에이전트 전용**: 6단계 SVG 생성은 원본·명세·템플릿·이미지·페이지 간 일관성에 의존하므로 현재 메인 에이전트가 수행합니다. 하위 에이전트에 슬라이드 SVG를 맡기지 않습니다.
> ⚠️ **생성 리듬**: 전역 디자인 파라미터 확정 후 **한 페이지씩 순서대로** 같은 연속 맥락에서 생성합니다. 예: 5장 단위 배치 생성 금지.

**시각 구축 단계**:
- SVG 페이지를 연속으로 한 장씩 순서대로 생성 → `<프로젝트경로>/svg_output/`

**논리 구축 단계**:
- 발표 노트 생성 → `<프로젝트경로>/notes/total.md`

**체크포인트 — SVG·노트 모두 생성 후 바로 7단계 후처리**:
```markdown
## 실행자 단계 완료
- [x] 모든 SVG를 svg_output/에 생성
- [x] 발표 노트를 notes/total.md에 생성
```

---

### 7단계: 후처리·내보내기

🚧 **관문**: 6단계 완료; `svg_output/`에 SVG 전부; `notes/total.md` 존재.

> ⚠️ 아래 세 하위 단계는 **반드시 하나씩 따로** 실행합니다. 각 명령이 성공했는지 확인한 뒤 다음을 실행합니다.
> ❌ 세 명령을 **한 코드 블록이나 한 번의 셸 호출**에 넣지 않습니다.

**7.1** — 발표 노트 분할:
```bash
python3 ${SKILL_DIR}/scripts/total_md_split.py <프로젝트경로>
```

**7.2** — SVG 후처리(아이콘 삽입·이미지 크롭·텍스트 평탄화·둥근 사각형을 path로 등):
```bash
python3 ${SKILL_DIR}/scripts/finalize_svg.py <프로젝트경로>
```

**7.3** — PPTX 내보내기(발표 노트 기본 삽입):
```bash
python3 ${SKILL_DIR}/scripts/svg_to_pptx.py <프로젝트경로> -s final
# 출력: exports/<프로젝트명>_<타임스탬프>.pptx + exports/<프로젝트명>_<타임스탬프>_svg.pptx
# --only native  SVG 참조판 생략
# --only legacy  SVG 이미지판만
```

> ❌ `finalize_svg.py` 대신 `cp` 사용 금지
> ❌ `svg_output/`에서 직접 내보내기 금지 — 반드시 `-s final`로 `svg_final/`에서 내보냄
> ❌ 후처리에 `--only` 등 추가 플래그 넣지 않기

---

## 역할 전환 규칙

역할을 바꾸기 전에 **반드시** 해당 참조 파일을 먼저 읽습니다. 출력 마커:

```markdown
## [역할 전환: <역할명>]
📖 역할 정의 읽기: references/<파일명>.md
📋 현재 작업: <간단 설명>
```

---

## 참고 자료

| 자료 | 경로 |
|----------|------|
| 공통 기술 제약 | `references/shared-standards.md` |
| 캔버스 형식 | `references/canvas-formats.md` |
| 이미지 레이아웃 | `references/image-layout-spec.md` |
| SVG 이미지 삽입 | `references/svg-image-embedding.md` |

---

## 참고

- 후처리 명령에 `--only` 등 추가 플래그를 넣지 않습니다 — 그대로 실행합니다.
- 로컬 미리보기: `python3 -m http.server -d <프로젝트경로>/svg_final 8000`
- **문제 해결**: 레이아웃 넘침·내보내기 오류·빈 이미지 등은 `docs/faq.md`를 확인하도록 안내합니다(실사용 사례 기반, 지속 갱신).
