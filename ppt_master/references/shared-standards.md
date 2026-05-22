# 공통 기술 표준

PPT Master의 공통 기술 제약으로, 역할 간 파일 중복을 없앱니다.

---

## 1. SVG 금지 기능 블랙리스트

아래 기능은 SVG 생성 시 **절대 사용 금지** — 사용 시 PPT 내보내기가 깨집니다.

| 금지 기능 | 설명 |
|----------------|-------------|
| `mask` | 마스크 |
| `<style>` | 임베드 스타일시트 |
| `class` | CSS 선택자 속성(`<defs>` 안의 `id` 참조는 정당하며 금지 아님) |
| 외부 CSS | 외부 스타일시트 링크 |
| `<foreignObject>` | 외부 콘텐츠 임베드 |
| `<symbol>` + `<use>` | 심볼 참조 재사용 |
| `textPath` | 경로를 따른 텍스트 |
| `@font-face` | 사용자 정의 글꼴 선언 |
| `<animate*>` / `<set>` | SVG 애니메이션 |
| `<script>` / 이벤트 속성 | 스크립트·상호작용 |
| `<iframe>` | 임베드 프레임 |

> **`marker-start` / `marker-end`는 조건부 허용** — 제약은 1.1절. 변환기는 조건을 만족하는 마커를 네이티브 DrawingML `<a:headEnd>` / `<a:tailEnd>`로 매핑합니다.
>
> **`<image>`의 `clipPath`는 조건부 허용** — 제약은 1.2절. 변환기는 조건을 만족하는 클립 도형을 네이티브 DrawingML 그림 기하(`<a:prstGeom>` 또는 `<a:custGeom>`)로 매핑합니다.

---

### 1.1 선 끝 마커(조건부 허용)

`<line>`·`<path>`의 `marker-start`·`marker-end`는 참조 `<marker>`가 **모두** 아래를 만족할 때만 허용됩니다.

| 요구 | 이유 |
|-------------|--------|
| `<marker>`가 `<defs>` 안에 정의 | 변환기가 id 색인으로 조회 |
| `orient="auto"` | DrawingML 화살표가 접선 따라 자동 회전; 다른 값은 왕복 어려움 |
| 마커 도형이 **다음 중 하나**: 닫힌 3점 경로/다각형(삼각), 닫힌 4점(다이아), `<circle>`/`<ellipse>` | DrawingML `triangle`/`diamond`/`oval`에 깔끔히 대응. 그 외는 경고 후 무시. |
| 마커 자식의 `fill`이 부모 선의 `stroke`와 **일치** | DrawingML에서 화살촉은 선 색을 상속 — 불일치 시 내보내기에서 어색 |
| `markerWidth`/`markerHeight` 대략 `3–15` | `sm`(<6)/`med`(6–12)/`lg`(>12) 버킷으로 매핑 |

**사용 경계**:

- 연결선이 주인 **커넥터 화살표**에만 `marker-start`/`marker-end` 사용.
- 몸통이 주인 **블록/두꺼운 실선 화살**에는 `marker` 사용 금지.
- 그런 실선 화살은 닫힌 `<path>`/`<polygon>`으로 그리고 `templates/charts/chevron_process.svg` 또는 `templates/charts/process_flow.svg`를 참고.

**DrawingML 매핑**:

| SVG 마커 도형 | DrawingML 출력 |
|------------------|------------------|
| `<path d="M0,0 L10,5 L0,10 Z"/>`(삼각) | `<a:tailEnd type="triangle" w="med" len="med"/>` |
| `<polygon points="0,0 10,5 0,10"/>` | `<a:tailEnd type="triangle" w="med" len="med"/>` |
| 4점 닫힌 path/다각형 | `<a:tailEnd type="diamond" .../>` |
| `<circle cx="5" cy="5" r="4"/>` | `<a:tailEnd type="oval" .../>` |

**권장 템플릿** — 재사용 가능한 표준 화살촉:

```xml
<defs>
  <marker id="arrowHead" markerWidth="10" markerHeight="10" refX="9" refY="5"
          orient="auto" markerUnits="strokeWidth">
    <path d="M0,0 L10,5 L0,10 Z" fill="#1976D2"/>
  </marker>
</defs>
<line x1="100" y1="200" x2="400" y2="200" stroke="#1976D2" stroke-width="3"
      marker-end="url(#arrowHead)"/>
```

> 분류 불가 마커(곡선·다중 세그먼트·꼭짓점 4 초과 등)는 변환기가 경고 후 **조용히 제거** — 선은 남고 화살촉만 없음. 특이한 화살은 수동 `<polygon>` 삼각으로 대체.

---

### 1.2 이미지 클리핑(조건부 허용)

`<image>`에 대한 `clip-path`는 참조 `<clipPath>`가 아래를 만족할 때만 허용됩니다.

| 요구 | 이유 |
|-------------|--------|
| `<clipPath>`가 `<defs>` 안에 정의 | id 색인 조회 |
| **단일** 도형 자식만 | 첫 자식만 사용; 복합 합성 없음 |
| 도형이 `<circle>`, `<ellipse>`, `<rect>`(rx/ry), `<path>`, `<polygon>` 중 하나 | DrawingML 기하(프리셋 또는 커스텀)로 매핑 |
| **`<image>`에만** 사용 | 이미지가 아닌 요소에 clip-path는 **금지** |

**사용 경계**:

- `clip-path`는 **`<image>`를** 원형 아바타·둥근 사진틀·육각 초상 등 **비직사각으로 자를 때만**.
- `<rect>` 등 도형에는 `clip-path` 금지 — 목표 도형을 직접 그림. 직사각을 원으로 자른 것은 곧 원; `<circle>`을 그림.
- PowerPoint SVG 렌더러는 **`clipPath`를 제대로 그리지 않음**(이미지 소실 등). 네이티브 PPTX 변환기는 처리하지만 SVG 참조판은 어긋날 수 있음.

**DrawingML 매핑**:

| SVG 클립 도형 | DrawingML 출력 | 용도 |
|----------------|------------------|----------|
| `<circle>` / `<ellipse>` | `<a:prstGeom prst="ellipse"/>` | 원형 아바타 |
| `<rect rx="..."/>` | `<a:prstGeom prst="roundRect"/>` + adj | 둥근 사진틀 |
| `<path>` / `<polygon>` | `<a:custGeom>` 경로 명령 | 육각·다이아 등 |

**권장 템플릿** — 원형 이미지 클립:

```xml
<defs>
  <clipPath id="avatarClip">
    <circle cx="200" cy="200" r="100"/>
  </clipPath>
</defs>
<image href="../images/photo.jpg" x="100" y="100" width="200" height="200"
       clip-path="url(#avatarClip)" preserveAspectRatio="xMidYMid slice"/>
```

**둥근 사각 클립** — 카드형 이미지:

```xml
<defs>
  <clipPath id="cardClip">
    <rect x="60" y="120" width="400" height="250" rx="16"/>
  </clipPath>
</defs>
<image href="../images/banner.jpg" x="60" y="120" width="400" height="250"
       clip-path="url(#cardClip)" preserveAspectRatio="xMidYMid slice"/>
```

> 이미지가 아닌 요소의 `clip-path`는 **금지** — 품질 검사가 오류로 보고. 도형은 목표 기하를 직접 그리고, 그룹은 레이아웃을 재구성.

---

## 2. PPT 호환 대안

| 금지 문법 | 올바른 대안 |
|---------------|---------------------|
| `fill="rgba(255,255,255,0.1)"` | `fill="#FFFFFF" fill-opacity="0.1"` |
| `<g opacity="0.2">...</g>` | 자식 요소마다 `fill-opacity`/`stroke-opacity` |
| `<image opacity="0.3"/>` | 이미지 뒤에 `<rect fill="배경색" opacity="0.7"/>` 마스크층 |

**암기**: PPT는 rgba·그룹 불투명도·이미지 불투명도를 인식하지 않습니다.

> 화살표: 커넥터 선은 1.1절 조건을 만족하는 `<marker>`의 `marker-end` 권장 — 네이티브 DrawingML 화살촉이 회전합니다. 블록 화살은 `marker` 대신 닫힌 도형을 씁니다. 단계 화살은 `templates/charts/chevron_process.svg`, 혼합 흐름은 `templates/charts/process_flow.svg`.

---

## 3. 캔버스 형식 빠른 참고

### 발표

| 형식 | viewBox | 치수 | 비율 |
|--------|---------|------------|-------|
| PPT 16:9 | `0 0 1280 720` | 1280x720 | 16:9 |
| PPT 4:3 | `0 0 1024 768` | 1024x768 | 4:3 |

### 소셜

| 형식 | viewBox | 치수 | 비율 |
|--------|---------|------------|-------|
| 샤오홍슈(RED) | `0 0 1242 1660` | 1242x1660 | 3:4 |
| 위챗 모멘츠 / 인스타 포스트 | `0 0 1080 1080` | 1080x1080 | 1:1 |
| 스토리 / 틱톡 세로 | `0 0 1080 1920` | 1080x1920 | 9:16 |

### 마케팅 자료

| 형식 | viewBox | 치수 | 비율 |
|--------|---------|------------|-------|
| 위챗 기사 헤더 | `0 0 900 383` | 900x383 | 2.35:1 |
| 가로 배너 | `0 0 1920 1080` | 1920x1080 | 16:9 |
| 세로 포스터 | `0 0 1080 1920` | 1080x1920 | 9:16 |
| A4 인쇄(150dpi) | `0 0 1240 1754` | 1240x1754 | 1:1.414 |

---

## 4. 기본 SVG 규칙

- **viewBox**는 캔버스와 일치(`width`/`height`도 viewBox와 일치)
- **배경**: 페이지 배경색은 `<rect>`로 정의
- **줄바꿈**: 수동 줄바꿈은 `<tspan>`; `<foreignObject>` 금지
- **글꼴**: 시스템 글꼴만(Malgun Gothic, Arial, Calibri 등); `@font-face` 금지
- **스타일**: 인라인만(`fill="..."` `font-size="..."`); `<style>`/`class` 금지(`<defs>`의 `id`는 정당)
- **색**: HEX; 투명은 `fill-opacity`/`stroke-opacity`
- **이미지**: `<image href="../images/xxx.png" preserveAspectRatio="xMidYMid slice"/>`
- **아이콘 플레이스홀더**: `<use data-icon="chunk/name" .../>`(기본); 덱에서 선택한 라이브러리가 `tabler-filled`/`tabler-outline`이면 그 접두사.(후처리에서 자동 삽입). 접두사 필수. **한 프레젠테이션 = 한 라이브러리 — 혼합 금지.**

### 요소 그룹화(필수)

논리적으로 묶인 요소는 **반드시** `<g>`로 감쌉니다. 내보낸 PPTX에서 PowerPoint 그룹이 되어 선택·이동·편집이 쉬워집니다.

> **`<g opacity="...">`만 금지**(2절 참고). 구조적 그룹용 일반 `<g>`는 필수.

**묶을 단위**:

| 묶음 단위 | 포함 내용 |
|---------------|----------|
| 카드/패널 | 배경 rect + 그림자 + 아이콘 + 제목 + 본문 |
| 프로세스 단계 | 번호 원 + 아이콘 + 라벨 + 설명 |
| 목록 항목 | 글머리/번호 + 아이콘 + 제목 + 설명 |
| 아이콘-텍스트 | 아이콘 + 인접 라벨 |
| 페이지 헤더 | 제목 + 부제 + 포인트 장식 |
| 페이지 푸터 | 페이지 번호 + 브랜딩 |
| 장식 군 | 관련 장식 도형(링, 구, 점) |

**예시**:

```xml
<g id="card-benefits-1">
  <rect x="60" y="115" width="565" height="260" rx="20" fill="#FFFFFF" filter="url(#shadow)"/>
  <use data-icon="bolt" x="108" y="163" width="44" height="44" fill="#0071E3"/>
  <text x="105" y="270" font-size="56" font-weight="bold" fill="#0071E3">10×</text>
  <text x="250" y="270" font-size="30" font-weight="bold" fill="#1D1D1F">더 빠름</text>
  <text x="105" y="310" font-size="18" fill="#6E6E73">제작 기간을 며칠에서 몇 시간으로 단축합니다.</text>
</g>
```

**명명**: `<g>`에 설명적 `id` 권장(`card-1`, `step-discover`, `header` 등). 필수는 아니나 가독성에 유리.

---

## 5. 후처리 파이프라인(3단계)

순서대로만 실행 — 건너뛰거나 추가 플래그 금지:

```bash
# 1. 발표 노트를 페이지별 파일로 분할
python3 scripts/total_md_split.py <프로젝트경로>

# 2. SVG 후처리(아이콘 삽입, 이미지 크롭·삽입, 텍스트 평탄화, 둥근 rect→path)
python3 scripts/finalize_svg.py <프로젝트경로>

# 3. PPTX 내보내기(svg_final/에서, 발표 노트 기본 삽입)
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final
# 출력: exports/<프로젝트명>_<타임스탬프>.pptx + exports/<프로젝트명>_<타임스탬프>_svg.pptx
```

**금지**:
- `finalize_svg.py` 대신 `cp` 사용 금지
- `svg_output/`에서 직접 내보내기 금지 — 반드시 `svg_final/`(`-s final`)
- `--only` 등 추가 플래그 금지

**재실행 규칙**: 후처리 완료 후 `svg_output/`를 수정(페이지 수정·추가·삭제)하면 2·3단계를 다시 실행. 1단계는 `notes/total.md`도 바뀌었을 때만.

---

## 6. 그림자·오버레이 기법

> `<mask>`와 `<image opacity="...">`는 금지. 항상 겹친 `<rect>`나 그라데이션 오버레이(2절).

### 그림자

#### 필터 소프트 그림자 — 권장

카드·떠 있는 패널·입체 요소에 적합. `svg_to_pptx`가 `feGaussianBlur`+`feOffset`을 네이티브 `<a:outerShdw>`로 변환합니다.

```xml
<defs>
  <filter id="softShadow" x="-15%" y="-15%" width="140%" height="140%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="12"/>
    <feOffset dx="0" dy="6" result="offsetBlur"/>
    <feFlood flood-color="#000000" flood-opacity="0.15" result="shadowColor"/>
    <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="shadow"/>
    <feMerge>
      <feMergeNode in="shadow"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
<rect x="60" y="60" width="400" height="240" rx="12" fill="#FFFFFF" filter="url(#softShadow)"/>
```

권장 파라미터:
```
stdDeviation:   10–16    (작을수록 선명, 클수록 부드러움)
flood-opacity:  0.12–0.20  (너무 낮으면 PPTX에서 안 보임)
dy:             4–8      (상단 광원 느낌으로 세로>가로)
dx:             0–2
```

#### 컬러 그림자

포인트 버튼·브랜드색 카드. 검정 대신 요소 색군 사용.

```xml
<filter id="colorShadow" x="-15%" y="-15%" width="140%" height="140%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
  <feOffset dx="0" dy="6" result="offsetBlur"/>
  <feFlood flood-color="#1A73E8" flood-opacity="0.20" result="shadowColor"/>
  <feComposite in="shadowColor" in2="offsetBlur" operator="in" result="shadow"/>
  <feMerge>
    <feMergeNode in="shadow"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

`flood-color`는 브랜드색으로; `flood-opacity`는 0.15~0.25.

#### 글로우

제목 강조·핵심 지표·히어로 텍스트. `feOffset` 없는 `feGaussianBlur`는 네이티브 `<a:glow>`로 변환됩니다.

```xml
<defs>
  <filter id="titleGlow" x="-30%" y="-30%" width="160%" height="160%">
    <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur"/>
    <feFlood flood-color="#1A73E8" flood-opacity="0.45" result="glowColor"/>
    <feComposite in="glowColor" in2="blur" operator="in" result="glow"/>
    <feMerge>
      <feMergeNode in="glow"/>
      <feMergeNode in="SourceGraphic"/>
    </feMerge>
  </filter>
</defs>
<text x="640" y="360" text-anchor="middle" font-size="48" fill="#1A73E8" filter="url(#titleGlow)">핵심 인사이트</text>
```

권장:
```
stdDeviation:   4–8
flood-color:    브랜드/포인트(검정 금지)
flood-opacity:  0.35–0.55
```

**그림자와 차이**: `<feOffset>` 없음(또는 dx=dy=0). 변환기가 글로우와 구분.

#### 레이어 rect 그림자 — 호환성 폴백

구형 PowerPoint 최대 호환. 메인 카드 뒤에 반투명 rect 2~3장 스택:

```xml
<!-- 그림자층(뒤→앞, 큰 오프셋부터) -->
<rect x="68" y="72" width="400" height="240" rx="16" fill="#000000" fill-opacity="0.03"/>
<rect x="65" y="69" width="400" height="240" rx="14" fill="#000000" fill-opacity="0.05"/>
<rect x="62" y="66" width="400" height="240" rx="12" fill="#1A73E8" fill-opacity="0.04"/>
<!-- 메인 카드 -->
<rect x="60" y="60" width="400" height="240" rx="12" fill="#FFFFFF"/>
```

### 이미지 오버레이

#### 선형 그라데이션 — 가장 흔함

이미지+텍스트 페이지. 텍스트 위치에 맞춰 그라데이션 방향 조정(텍스트가 왼쪽이면 왼쪽으로 어둡게).

```xml
<image href="..." x="0" y="0" width="1280" height="720" preserveAspectRatio="xMidYMid slice"/>
<defs>
  <linearGradient id="imgOverlay" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="#1A1A2E" stop-opacity="0.85"/>
    <stop offset="55%"  stop-color="#1A1A2E" stop-opacity="0.30"/>
    <stop offset="100%" stop-color="#1A1A2E" stop-opacity="0"/>
  </linearGradient>
</defs>
<rect x="0" y="0" width="1280" height="720" fill="url(#imgOverlay)"/>
```

#### 하단 그라데이션 바

표지·풀 이미지+하단 제목.

```xml
<defs>
  <linearGradient id="bottomBar" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="#000000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.72"/>
  </linearGradient>
</defs>
<rect x="0" y="380" width="1280" height="340" fill="url(#bottomBar)"/>
```

#### 방사형 그라데이션 — 비네트

분위기 슬라이드; 시선을 중앙으로.

```xml
<defs>
  <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
    <stop offset="0%"   stop-color="#000000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.58"/>
  </radialGradient>
</defs>
<rect x="0" y="0" width="1280" height="720" fill="url(#vignette)"/>
```

#### 브랜드색 오버레이

브랜드 정체성을 강하게 줄 때.

```xml
<defs>
  <linearGradient id="brandOverlay" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="#005587" stop-opacity="0.80"/>
    <stop offset="100%" stop-color="#005587" stop-opacity="0.10"/>
  </linearGradient>
</defs>
<rect x="0" y="0" width="1280" height="720" fill="url(#brandOverlay)"/>
```

### 빠른 참고 표

| 시나리오 | 권장 | 피할 것 |
|----------|-----------------------|-------|
| 카드/패널 그림자 | 필터 소프트(`flood-opacity` ≤ 0.12) | 딱딱한 검정 그림자 |
| 포인트/CTA 버튼 | 컬러 그림자(같은 색군) | 무난한 회색만 |
| 제목/지표 강조 | 글로우(브랜드색, 오프셋 없음) | 본문 남용 |
| 이미지 위 텍스트 | 선형 오버레이(텍스트 쪽으로 어둡게) | 전면 균일 불투명 |
| 표지/풀 이미지 | 하단 바 + 브랜드색 | 순검정 덮음 |
| 분위기/히어로 | 방사 비네트 | 가공 없는 원본만 |
| PPT 호환 최우선 | 레이어 rect 그림자 | 필터 그림자 |

---

## 7. 스트로크·텍스트·도형 효과

### stroke-dasharray — 점선

네이티브 `<a:prstDash>`로 변환. 프리셋 패턴 권장:

| SVG 값 | PPTX 프리셋 | 용도 |
|-----------|-------------|----------|
| `4,4` | Dash | 일반 점선·구분 |
| `2,2` | Dot | 은은한 점 테두리·플레이스홀더 |
| `8,4` | Long dash | 타임라인·흐름 화살 |
| `8,4,2,4` | Long dash-dot | 기술 도면·치수선 |

```xml
<rect x="60" y="60" width="400" height="240" rx="12"
  fill="none" stroke="#999999" stroke-width="2" stroke-dasharray="4,4"/>

<line x1="100" y1="360" x2="1180" y2="360"
  stroke="#CCCCCC" stroke-width="1" stroke-dasharray="2,2"/>
```

### stroke-linejoin

모서리 연결 방식이 네이티브 선 연결 유형으로 변환됩니다.

| SVG | PPTX | 용도 |
|-----------|-----------------|----------|
| `round` | Round join | 부드러운 꺾은선·유기적 형태 |
| `bevel` | Bevel join | 기술 도면 |
| `miter` | Miter(기본) | 각진 사각·화살 |

```xml
<polyline points="100,200 200,100 300,200" fill="none"
  stroke="#1A73E8" stroke-width="3" stroke-linejoin="round"/>
```

### text-decoration

네이티브 텍스트 서식으로 변환:

| SVG | PPTX | 용도 |
|-----------|-----------------|----------|
| `underline` | 한 줄 밑줄 | 강조·링크·핵심 용어 |
| `line-through` | 취소선 | 삭제 항목·전후 비교 |

```xml
<text x="100" y="200" font-size="20" fill="#333333" text-decoration="underline">중요 용어</text>

<!-- tspan별 장식 -->
<text x="100" y="240" font-size="18" fill="#333333">
  일반 텍스트 <tspan text-decoration="line-through" fill="#999999">이전 값</tspan> 새 값
</text>
```

### 그라데이션 채우기 — linearGradient·radialGradient

`<defs>`에 정의하고 `fill="url(#id)"`로 참조하면 `<a:gradFill>`로 변환. 오버레이뿐 아니라 도형 면에 써서 마감을 높입니다.

**선형** — 버튼·헤더 바·패널:

```xml
<defs>
  <linearGradient id="btnGrad" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#1A73E8"/>
    <stop offset="100%" stop-color="#0D47A1"/>
  </linearGradient>
</defs>
<rect x="540" y="600" width="200" height="48" rx="24" fill="url(#btnGrad)"/>
```

**방사형** — 스포트라이트 배경·원형 악센트:

```xml
<defs>
  <radialGradient id="spotBg" cx="50%" cy="50%" r="70%">
    <stop offset="0%" stop-color="#1A73E8" stop-opacity="0.15"/>
    <stop offset="100%" stop-color="#1A73E8" stop-opacity="0"/>
  </radialGradient>
</defs>
<circle cx="640" cy="360" r="300" fill="url(#spotBg)"/>
```

### transform: rotate — 요소 회전

`<a:xfrm rot="...">`로 변환. `rect`, `circle`, `ellipse`, `line`, `path`, `polygon`, `polyline`, `image`, `text` 지원.

```xml
<!-- 회전 장식 -->
<rect x="100" y="100" width="60" height="60" fill="#1A73E8" fill-opacity="0.1"
  transform="rotate(45, 130, 130)"/>

<!-- 회전 라벨 -->
<text x="50" y="400" font-size="14" fill="#999999"
  transform="rotate(-90, 50, 400)">Y축 라벨</text>
```

**문법**: `rotate(각)` 또는 `rotate(각, cx, cy)` — `cx,cy`는 회전 중심. 양각은 시계 방향.

### 호 경로 — 도넛/파이

`<path>`로 부채를 그릴 때 호 끝점은 삼각함수로 **정확히** 계산합니다. **추정 금지** — 작은 오차도 형태를 크게 망칩니다.

**계산식**(중심 `cx,cy`, 반지름 `r`, 각 `θ` 도):
```
x = cx + r × cos(θ × π / 180)
y = cy + r × sin(θ × π / 180)
```

**규칙**:
1. **-90°**(12시 방향)에서 시작, 시계 방향
2. 각 부채는 `비율 × 360°`
3. 부채가 180° 초과면 **large-arc=1**, 아니면 0
4. 바깥 호 sweep=1, 안쪽 되돌아오기는 0
5. 모든 부채 각 합이 360°인지, 마지막 끝점이 첫 시작과 맞닿는지 **검증**

**예 — 75% 도넛**(중심 400,400, 외 r=180, 내 r=100):
```
시작 -90° → 외곽(400,220), 내곽(400,300)
끝 -90+270=180° → 외곽(220,400), 내곽(300,400)
large-arc: 1 (270° > 180°)

<path d="M 400,220 A 180,180 0 1,1 220,400 L 300,400 A 100,100 0 1,0 400,300 Z"/>
```

### 대각선 위 다각형 화살촉

> 커넥터는 1.1절 `marker-end` 권장. 두꺼운 실선·비커넥터 화살은 `marker` 대신 독립 다각형/경로.

`<polygon>` 삼각 화살촉은 수평·수직선은 단순 오프셋으로 가능하지만, **대각선**은 선 방향에 맞게 꼭짓점을 회전해야 합니다.

**방법**: 방향 벡터로 삼각 점 계산:

```
선분 (x1,y1)-(x2,y2):
1. 방향: dx = x2-x1, dy = y2-y1
2. 정규화: len = √(dx²+dy²), ux = dx/len, uy = dy/len
3. 수직: px = -uy, py = ux
4. 끝점 = (x2, y2)
5. 뒤 점1 = (x2 - ux×12 + px×5,  y2 - uy×12 + py×5)
6. 뒤 점2 = (x2 - ux×12 - px×5,  y2 - uy×12 - py×5)
```

**예 — 대각선** (260,310)-(370,430):
```
dx=110, dy=120, len≈162.8, ux=0.676, uy=0.737
px=-0.737, py=0.676
끝: (370, 430)
뒤1: (358.2, 424.6)
뒤2: (365.6, 417.8)

<polygon points="370,430 365.6,417.8 358.2,424.6" fill="#C8A96E"/>
```

대각선에 고정 하향/우향 삼각을 쓰면 **방향이 틀립니다**.

---

## 8. 프로젝트 디렉터리 구조

```
project/
├── svg_output/    # 원본 SVG(실행자 출력, 플레이스홀더 포함)
├── svg_final/     # 후처리 최종 SVG(finalize_svg.py 출력)
├── images/        # 이미지 자산(사용자+AI 생성)
├── notes/         # 발표 노트(SVG명과 대응하는 .md)
│   └── total.md   # 분할 전 통합 발표 노트
├── templates/     # 프로젝트 템플릿(있는 경우)
└── *.pptx         # 내보낸 PPT
```
