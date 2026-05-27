---
description: 기존 프로젝트 파일이나 참조 템플릿을 바탕으로 새 PPT 레이아웃 템플릿을 생성합니다.
---

# 새 템플릿 만들기 워크플로

> **호출 역할**: [Template_Designer](../references/template-designer.md)

**전역 템플릿 라이브러리**에 재사용 가능한 PPT 레이아웃 템플릿 세트를 완성합니다.

> 프로젝트 일회성 커스터마이징이 아니라 **라이브러리 자산 제작**입니다. 산출물은 이후 프로젝트에서 재사용 가능해야 하며 `templates/layouts/layouts_index.json`에서 발견 가능해야 합니다.

## 과정 개요

```
요구 수집 → PPTX 참조 가져오기 → 자산 정규화 → 디렉터리 생성 → Template_Designer 호출 → 자산 검증 → 색인 등록 → 산출
```

---

## 1단계: 템플릿 정보 수집

사용자와 다음을 확인합니다.

| 항목 | 필수 | 설명 |
|------|----------|-------------|
| 새 템플릿 ID | 예 | 템플릿 디렉터리·색인 키. ASCII 슬러그 `my_company` 권장; 브랜드명이 비ASCII면 파일시스템 안전·`layouts_index.json`과 정확히 일치 |
| 표시 이름 | 예 | 문서용 사람이 읽기 쉬운 이름 |
| 카테고리 | 예 | `brand` / `general` / `scenario` / `government` / `special` 중 하나 |
| 적용 시나리오 | 예 | 연차 보고·논문 발표·정부 브리핑 등 |
| 톤 요약 | 예 | 권장용 한 줄 톤, 예: `현대적·절제·데이터 중심` |
| 테마 모드 | 예 | 권장용 테마 설명, 예: `라이트(흰 배경+블루 포인트)` |
| 캔버스 형식 | 예 | 기본 `ppt169`; 다르면 생성 전 명시 |
| 참조 원본 | 선택 | 기존 프로젝트, 스크린샷 폴더, `.pptx` 경로 |
| 테마 색 | 선택 | 주색 HEX(참조에서 자동 추출 가능) |
| 디자인 스타일 | 선택 | 장식 언어·브랜드 단서 등 추가 메모 |
| 자산 목록 | 선택 | 로고·배경 텍스처·참조 이미지 |
| 빠른 검색 태그 | 선택 | `layouts_index.json > quickLookup`용, 예: `technology`, `finance` |

**1단계 필수 결과**:

- **전역 라이브러리 템플릿**으로 위치가 분명함
- SVG 생성 전 캔버스 형식 고정
- `layouts_index.json` 등록에 충분한 메타데이터

**참조 원본이 있으면** 구조를 먼저 봅니다:

```bash
ls -la "<참조_경로>"
```

참조가 `.pptx`면 통합 준비 도구를 씁니다:

```bash
python3 skills/ppt-master/scripts/pptx_template_import.py "<참조_템플릿.pptx>"
```

한 작업 공간에서 PPTX 참조 준비 전 과정을 수행합니다.

- 재사용 자산·스타일 메타데이터 추출
- `manifest.json` 생성
- `analysis.md` 생성
- `master_layout_refs.json` 생성
- `master_layout_analysis.md` 생성
- 슬라이드를 `svg/`로 내보냄
- 큰 인라인 비트맵을 `assets/`로 외부화
- `reference_svg_selection.json` 생성

최종 템플릿으로의 직접 변환이 아니라 **재구성 보조**입니다.

`manifest.json`, `analysis.md`, `master_layout_refs.json`, `master_layout_analysis.md`, `assets/`, `svg/`를 템플릿 재구성의 내부 참고로 사용합니다.

그다음 템플릿 생성 전 **AI 전용 자산 정규화**를 수행합니다.

- `image1.png` 등 내보낸 원본과 정리된 슬라이드 SVG가 쓰는 `inline_*` 비교
- `inline_*`가 내보낸 원본과 같은 이미지면 **원본 자산**을 정본으로
- 대응 원본이 없으면 파생 후보로 유지
- 마스크·알파 보조만인 `inline_*`는 기본적으로 최종 템플릿 자산 세트에 올리지 않음
- 결과를 `<가져오기작업공간>/normalized_assets.json`에 기록

`normalized_assets.json` 권장 필드:

- 정본 자산 경로
- 매칭된 `inline_*` 참조
- 역할 추정: `cover_background`, `content_background`, `brand_overlay`, `mask_only` 등
- 최종 패키지 포함 여부

참조가 `.pptx`일 때 템플릿 작성 시 내부 우선순위:

1. `manifest.json`
2. `master_layout_refs.json`
3. `master_layout_analysis.md`
4. `analysis.md`
5. `normalized_assets.json`
6. `assets/`
7. `svg/`의 정리된 슬라이드 SVG
8. 사용자 스크린샷 또는 원본 PPTX는 시각 교차 검증용

해석 규칙:

- `manifest.json`: 슬라이드 크기·테마 색·글꼴·배경 상속·재사용 자산의 사실 원천
- `master_layout_refs.json`: 고유 레이아웃/마스터 구조·배경 상속·슬라이드 재사용 관계
- `master_layout_analysis.md`: 마스터/레이아웃 모티프 빠른 이해용 요약
- `analysis.md`: 페이지 유형 선택 가이드 요약
- `normalized_assets.json`: 어떤 가져온 자산이 정본이고 어떤 `inline_*`가 보조인지
- `assets/`: 정규화 후에도 무분별 소비 금지
- 정리된 `svg/`: 리듬·구도·고정 장식 구조 참고에 필수
- 정리 참조 페이지가 `<= 10`이면 전부 읽기; `> 10`이면 대표 10장만
- 스크린샷은 구도·스타일 판단에 유용하나, 가져오기 결과가 명확히 불완전하지 않은 한 메타데이터를 덮어쓰지 않음

**하드 관문**:

- 템플릿 파일 생성 전 `reference_svg_selection.json`에 나열된 **모든** SVG를 읽어야 함
- 템플릿 생성 시작 전 읽은 슬라이드 인덱스를 명시적으로 보고

가져온 PPTX나 내보낸 슬라이드 SVG를 최종 템플릿 자산으로 직접 취급하지 않습니다. 목표는 깨끗하고 유지보수 가능한 PPT Master 템플릿 패키지 재구성입니다.

---

## 2단계: 가져온 자산 정규화

참조 원본이 `.pptx`이면 템플릿 생성 전 정규화 산출물을 만듭니다.

**2단계 필수 결과**:

- 내보낸 원본과 `inline_*` 비교 완료
- 신뢰 가능한 매칭이 있으면 원본을 정본으로 선호
- 마스크 전용·보조 전용 `inline_*`는 기본적으로 최종 후보에서 제외
- `normalized_assets.json`이 하류 템플릿 생성에 사용 가능

`.pptx`가 없으면 이 단계는 생략합니다.

---

## 3단계: 템플릿 디렉터리 생성

```bash
mkdir -p "skills/ppt-master/templates/layouts/<template_id>"
```

> **출력 위치**: 전역 템플릿은 `skills/ppt-master/templates/layouts/`; 프로젝트 템플릿은 `projects/<프로젝트>/templates/`
>
> 생성된 디렉터리 이름은 `layouts_index.json`에 쓸 최종 템플릿 ID와 일치해야 합니다.

---

## 4단계: Template_Designer 역할 호출

**Template_Designer 역할로 전환**해 역할 정의대로 생성합니다. 입력은 1단계에서 확정한 템플릿 브리프이지 프로젝트 설계 명세가 아닙니다.

참조가 `.pptx`이면 역할에 다음 내부 패키지를 넘깁니다.

- 1단계 확정 브리프
- `manifest.json`
- `master_layout_refs.json`
- `master_layout_analysis.md`
- `analysis.md`
- `normalized_assets.json`
- `assets/`
- `svg/`의 정리된 슬라이드 SVG
- `reference_svg_selection.json`
- 선택: 스크린샷

역할은 가져오기 출력으로 테마 색·글꼴·배경·브랜딩 자산 등 사실을 고정한 뒤, PPT Master 제약에 맞는 단순 유지보수 가능한 SVG로 재구축합니다.

1. **design_spec.md** — 설계 명세 문서
2. **핵심 템플릿 4종** — 표지·챕터·본문·맺음
3. **목차 페이지(선택)** — `02_toc.svg`
4. **템플릿 자산(선택)** — 로고·PNG·JPG·패키지에 필요한 참조 SVG

> **역할 상세**: [template-designer.md](../references/template-designer.md)

**신규 라이브러리 템플릿 플레이스홀더 계약(필수)**:

- 표지: `{{TITLE}}`, `{{SUBTITLE}}`, `{{DATE}}`, `{{AUTHOR}}`
- 챕터: `{{CHAPTER_NUM}}`, `{{CHAPTER_TITLE}}`
- 본문: `{{PAGE_TITLE}}`, `{{CONTENT_AREA}}`, `{{PAGE_NUM}}`
- 맺음: `{{THANK_YOU}}`, `{{CONTACT_INFO}}`
- 목차: `{{TOC_ITEM_1_TITLE}}` 및 선택 `{{TOC_ITEM_1_DESC}}` 등 인덱스형

신규 템플릿에 `{{CHAPTER_01_TITLE}}` 같은 일회성 패턴을 도입하지 않습니다. 확장 플레이스홀더가 정말 필요하면 `design_spec.md`에 명시하고 명명 규칙을 일관되게 유지합니다.

---

## 5단계: 템플릿 자산 검증

```bash
ls -la "skills/ppt-master/templates/layouts/<template_id>"
```

템플릿 디렉터리에 SVG 검증:

```bash
python3 skills/ppt-master/scripts/svg_quality_checker.py "skills/ppt-master/templates/layouts/<template_id>" --format <canvas_format>
```

**체크리스트**:

- [ ] `design_spec.md`에 설계 명세가 완전함
- [ ] 핵심 템플릿 4종 존재
- [ ] 목차가 있으면 플레이스홀더가 표준 인덱스형
- [ ] SVG viewBox가 선택한 캔버스와 일치(`ppt169`: `0 0 1280 720`)
- [ ] 플레이스홀더명이 신규 계약·`design_spec.md`와 일치
- [ ] SVG가 참조하는 자산 파일이 패키지에 실제 존재

이 단계는 **하드 관문**입니다. 검증 통과 전 라이브러리 색인에 등록하지 않습니다.

---

## 6단계: 라이브러리 색인 등록

`skills/ppt-master/templates/layouts/layouts_index.json` 갱신:

- `meta.total`
- `meta.updated`
- `categories.<category>.layouts` 항목
- `quickLookup` 항목
- `layouts.<template_id>` 메타데이터 블록

`layouts_index.json`이 메인 PPT 생성 워크플로에서 템플릿 탐색의 **단일 진실 공급원**입니다. 여기 없는 디렉터리는 미완으로 봅니다.

사람용 `templates/layouts/README.md` 요약 표를 수동 관리한다면 JSON 갱신 후 맞춥니다. 우선순위는 JSON입니다.

---

## 7단계: 산출 확인

```markdown
## 템플릿 생성 완료

**템플릿 이름**: <template_id> (<display_name>)
**경로**: `skills/ppt-master/templates/layouts/<template_id>/`
**카테고리**: <category>
**캔버스 형식**: <canvas_format>
**색인 등록**: 완료

### 포함 파일

| 파일 | 상태 |
|------|--------|
| `design_spec.md` | 완료 |
| `01_cover.svg` | 완료 |
| `02_chapter.svg` | 완료 |
| `03_content.svg` | 완료 |
| `04_ending.svg` | 완료 |
| `02_toc.svg` | 선택 |
```

---

## 색 구성 빠른 참고

| 스타일 | 주색 | 용도 |
|-------|---------------|-----------|
| 테크 블루 | `#004098` | 인증·평가 |
| 맥킨지 | `#005587` | 전략 컨설팅 |
| 정부 블루 | `#003366` | 정부·공공 |
| 비즈니스 그레이 | `#2C3E50` | 일반 비즈니스 |

---

## 참고

1. **SVG 기술 제약**: [template-designer.md](../references/template-designer.md) 기술 제약 절
2. **색 일관성**: 모든 SVG가 동일 팔레트 사용
3. **플레이스홀더**: `{{}}` 형식과 위 신규 계약 준수
4. **탐색 요구**: 신규 템플릿은 `layouts_index.json`에 없으면 메인 워크플로에서 권장 불가

> **상세 사양**: [template-designer.md](../references/template-designer.md)
