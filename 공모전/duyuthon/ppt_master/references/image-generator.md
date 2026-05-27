# 이미지 생성기(Image_Generator) 참고

> 이 파일은 Image_Generator 역할의 요약 참고입니다. 공통 표준(SVG 제약·캔버스·후처리 등)은 [shared-standards.md](./shared-standards.md)를 참고합니다.

## 핵심 사명

전략가가 출력한 설계 명세·콘텐츠 개요의 "이미지 자원 목록"을 받아, 생성 대기 이미지마다 최적화된 프롬프트를 만들고 AI 도구로 생성해 프로젝트 `images/`에 저장합니다.

**발동 조건**: AI 이미지 생성이 필요할 때(단독 또는 파이프라인 내)

| 모드 | 발동 | 설명 |
|------|---------|-------------|
| **단독** | 이미지 요구를 직접 설명 | 한 장 또는 여러 장 생성 |
| **파이프라인** | PPT 생성 워크플로에서 AI 이미지 선택 | 프로젝트용 일괄 생성 |

> 파이프라인 다음 단계: 실행자가 SVG 생성

---

## 1. 입출력

### 입력

- **설계 명세·콘텐츠 개요**(전략가): 주제·청중·스타일·색·캔버스
- **이미지 자원 목록**(핵심):

  | 파일명 | 치수 | 용도 | 유형 | 상태 | 생성 설명 |
  |----------|-----------|---------|------|--------|----------------------|
  | cover_bg.png | 1920x1080 | 표지 배경 | 배경 | 생성 대기 | 현대적 테크 추상 배경, 딥 블루 그라데이션 |

### 출력

| 산출물 | 경로·설명 | 요구 |
|------------|-------------------|----------|
| 프롬프트 문서 | `project/images/image_prompts.md` | **반드시** 파일 쓰기 도구로 저장 — 대화 출력만으로는 불충분 |
| 최적화 프롬프트 | 이미지마다 하나 | AI 이미지 도구에 바로 넣을 수 있음; alt 텍스트 겸용 |
| 이미지 파일 | `project/images/` | 자원 목록의 파일명 준수 |
| 목록 갱신 | 상태 | "생성 대기" → "생성됨" 등 |

---

## 2. 통합 프롬프트 구조

### 2.1 표준 출력 형식

각 이미지는 아래 형식으로 출력합니다.

```markdown
### 이미지 N: {filename}

| 속성 | 값 |
| --------- | ----- |
| 용도   | {어느 페이지/역할} |
| 유형      | {배경·삽화·사진·다이어그램·장식} |
| 치수 | {가로}x{세로} ({종횡비}) |
| 원본 설명 | {목록의 생성 설명} |

**프롬프트**:
{주제 서술}, {스타일 지시}, {색 지시}, {구도 지시}, {품질 지시}

**네거티브 프롬프트**:
{제외할 요소}

**대체 텍스트**:
> {접근성·캡션용 설명}
```

### 2.2 프롬프트 구성 요소

| 구성 | 설명 | 예 |
|-----------|-------------|---------|
| 주제 서술 | 핵심 내용 | `추상 기하 도형`, `팀 협업 장면` |
| 스타일 지시 | 시각 스타일 | `플랫 디자인`, `3D 아이소메트릭`, `수채 느낌` |
| 색 지시 | 색 팔레트 | `팔레트: 네이비(#1E3A5F), 골드(#D4AF37)` |
| 구도 지시 | 레이아웃 비 | `16:9`, `중앙 구도` |
| 품질 지시 | 해상도·디테일 | `고품질`, `4K`, `선명한 디테일` |
| 네거티브 | 배제 요소 | `텍스트, 워터마크, 흐림, 저품질` |

### 2.3 스타일 키워드 빠른 참고

| 디자인 스타일 | 권장 이미지 스타일 | 핵심 키워드 |
|-------------|------------------------|---------------|
| 일반 다용도 | 현대 삽화·플랫 | `modern`, `flat design`, `gradient`, `vibrant colors` |
| 일반 컨설팅 | 깔끔 프로·기업 | `professional`, `clean`, `corporate`, `minimalist` |
| 상위 컨설팅 | 프리미엄 미니멀·추상 기하 | `premium`, `sophisticated`, `geometric`, `abstract`, `elegant` |
| 기술·SaaS | 미래지향·디지털 | `futuristic`, `digital`, `tech grid`, `circuit pattern`, `neon accents`, `dark background` |
| 교육·훈련 | 친근·설명적 | `friendly`, `instructional`, `whiteboard style`, `pastel colors`, `simple shapes` |
| 마케팅·브랜딩 | 대담·에너지 | `bold`, `energetic`, `dynamic composition`, `vivid colors`, `action-oriented` |
| 헬스케어 | 깔끔·안심 | `clean`, `clinical`, `soft blue-green palette`, `organic curves`, `reassuring` |
| 금융·뱅킹 | 보수·신뢰 | `conservative`, `trustworthy`, `blue-gray palette`, `structured`, `precise` |
| 크리에이티브 | 예술적·실험적 | `artistic`, `experimental`, `asymmetric`, `textured`, `hand-crafted feel` |

### 2.4 색 반영 방법

설계 명세에서 색을 뽑아 프롬프트 지시로 변환:

```
주색: #1E3A5F (딥 네이비)  →  "deep navy blue (#1E3A5F)"
보조: #F8F9FA (연회)      →  "light gray (#F8F9FA)"
포인트: #D4AF37 (골드)    →  "gold accent (#D4AF37)"

통합 지시: "color palette: deep navy blue (#1E3A5F), light gray (#F8F9FA), gold accent (#D4AF37)"
```

### 2.5 캔버스 형식·종횡비

| 캔버스 형식 | 배경 종횡비 | 권장 해상도 |
|--------------|------------------------|----------------------|
| PPT 16:9 | 16:9 | 1920x1080 또는 2560x1440 |
| PPT 4:3 | 4:3 | 1600x1200 |
| 샤오홍슈 | 3:4 | 1242x1660 |
| 위챗 모멘츠 | 1:1 | 1080x1080 |
| 스토리 | 9:16 | 1080x1920 |

> 지원 비율 예: `1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `4:5`, `5:4`, `9:16`, `16:9`, `21:9`(Gemini는 `1:4`, `1:8`, `4:1`, `8:1` 등 추가 지원)

### 2.6 다중 이미지 일관성

한 덱에 여러 장일 때 **덱 스타일 앵커** — 모든 이미지 프롬프트 앞에 붙일 공통 15~25단어 접두어.

**구성**: 2.3 스타일 키워드 + 2.4 색 지시 + 품질 지시를 한 덩어리로.

**예외**: 배경 이미지는 스타일 키워드를 `background`, `backdrop`, `negative space for text overlay` 쪽으로 바꿔도 되며, 색 지시는 동일하게 유지해 색 일관만 확보.

**규칙**: 프롬프트 문서 헤더(5절)에 앵커를 한 번 정의하고 각 이미지에서 참조.

---

## 3. 이미지 유형 분류·처리

### 유형 판별 흐름

1. 풀페이지·넓은 배경 → **배경**(3.1)
2. 실경·인물·제품 → **사진**(3.2)
3. 플랫·삽화·카툰 → **삽화**(3.3)
4. 프로세스·아키텍처·관계 → **다이어그램**(3.4)
5. 부분 장식·질감 → **장식 패턴**(3.5)

### 3.1 배경

**특징**: 표지·챕터 풀 배경; 텍스트 오버레이 가능해야 함

| 포인트 | 설명 |
|-----------|-------------|
| 배경임을 강조 | `background`, `backdrop` |
| 텍스트 영역 확보 | `negative space in center for text overlay` |
| 피사체 과다 금지 | 추상·그라데이션·기하 위주 |
| 디테일은 낮은 대비 | `subtle`, `soft`, `muted` |

**템플릿**: `Abstract {주제 요소} background, {스타일} style, {주색} to {보색} gradient, subtle {장식}, clean negative space in center for text overlay, {비율} aspect ratio, high resolution, professional presentation background`

**네거티브**: `text, letters, watermark, faces, busy patterns, high contrast details`

### 3.2 사진

**특징**: 실경·인물·제품·건축 — 사진적 질감

| 포인트 | 설명 |
|-----------|-------------|
| 사실감 | `photography`, `photorealistic`, `real photo` |
| 조명 | `natural lighting`, `soft shadows`, `studio lighting` |
| 배경 | `white background` / `blurred background` / `contextual setting` |
| 인물 다양성 | `diverse`, `professional attire` |

**템플릿**: `{주제 서술}, professional photography, {조명} lighting, {배경} background, color grading matching {색 구성}, high quality, sharp focus, 8K resolution`

**네거티브**: `watermark, text overlay, artificial, CGI, illustration, cartoon, distorted faces`

### 3.3 삽화

**특징**: 플랫·벡터 느낌·카툰·개념도

| 포인트 | 설명 |
|-----------|-------------|
| 스타일 명시 | `flat design`, `isometric`, `vector style`, `hand-drawn` |
| 디테일 절제 | `simplified`, `clean lines`, `minimal details` |
| 팔레트 통일 | 설계 명세 색 엄수 |
| 배경 | `white background` 또는 `transparent background` |

**템플릿**: `{주제 서술}, {삽화 스타일} illustration style, {디테일 수준} with clean lines, color palette: {색 목록}, {배경} background, professional {용도} illustration`

**네거티브**: `realistic, photography, 3D render, complex textures, watermark`

### 3.4 다이어그램

**특징**: 플로차트·아키텍처·개념 관계·데이터 시각화 느낌의 정적 이미지

| 포인트 | 설명 |
|-----------|-------------|
| 구조 명료 | `clear structure`, `organized layout`, `logical flow` |
| 연결 표현 | `arrows indicating flow`, `connecting lines` |
| 톤 | `suitable for academic publication`, `professional diagram` |
| 배경 | `white background` 또는 `light gray background` |

**템플릿**: `{도식 유형} diagram showing {내용 서술}, {구성 요소} connected by {연결 방식}, {스타일} style with {색 구성}, white background, clear labels, professional technical diagram`

**네거티브**: `cluttered, messy, overlapping elements, dark background, realistic, photography`

### 3.5 장식 패턴

**특징**: 부분 장식·질감·테두리·구분 요소

| 포인트 | 설명 |
|-----------|-------------|
| 반복 가능 | 필요 시 `seamless`, `tileable`, `repeatable` |
| 보조 역할 | `subtle`, `understated`, `supporting element` |
| 투명 친화 | `transparent background` 또는 `isolated element` |
| 소형 가독 | 작은 크기에서도 읽힘 고려 |

**템플릿**: `{패턴 유형} decorative pattern, {스타일} style, {색 구성}, {배경} background, subtle and elegant, suitable for {용도}`

**네거티브**: `busy, cluttered, high contrast, distracting, photorealistic`

---

## 4. 이미지 생성 워크플로

### 4.1 분석 단계

1. 설계 명세 읽기; 프로젝트 전반 스타일 파악
2. 색 구성·캔버스·청중 추출
3. 자원 목록 이미지를 하나씩 분석
4. 유형 판별(3절)

### 4.2 프롬프트 생성 단계

"생성 대기" 이미지마다:

1. **유형 결정** → 배경·사진·삽화·다이어그램·장식
2. **용도 이해** → 어느 페이지·역할
3. **원본 설명 분석** → 목록의 "생성 설명"
4. **유형별 포인트 적용** → 해당 절의 표
5. **최적화 프롬프트 작성** → 2.1 형식
6. **문서 저장** → **반드시** `project/images/image_prompts.md`에 기록

### 4.3 이미지 생성 단계

> 선행: 4.2 완료; `images/image_prompts.md` 존재

#### 방법 1: 통합 CLI(권장)

```bash
python3 scripts/image_gen.py "프롬프트 내용" \
  --aspect_ratio 16:9 --image_size 1K \
  --output project/images --filename cover_bg
```

**매개변수**:

| 매개변수 | 짧은 이름 | 설명 | 기본값 |
|-----------|-------|-------------|---------|
| `prompt` | - | 긍정 프롬프트(위치 인자) | - |
| `--negative_prompt` | `-n` | 네거티브 | 없음 |
| `--aspect_ratio` | - | 종횡비 | `1:1` |
| `--image_size` | - | 크기(`1K`/`2K`/`4K`) | `1K` |
| `--output` | `-o` | 출력 디렉터리 | 현재 디렉터리 |
| `--filename` | `-f` | 파일명(확장자 없음) | 자동 |
| `--backend` | `-b` | 백엔드 재정의 | 없음 |
| `--model` | `-m` | 모델명 | 백엔드 기본 |
| `--list-backends` | - | 지원 등급 출력 후 종료 | `false` |

**설정 출처**:
- 현재 프로세스 환경 변수
- 저장소 루트 `.env` 보조

우선순위: 프로세스 환경이 이김; `.env`는 비어 있는 값만 채움.

| 변수 | 필수 | 설명 |
|----------|----------|-------------|
| `IMAGE_BACKEND` | 예 | `gemini` / `openai` / `stability` / `bfl` / `ideogram` / `qwen` / `zhipu` / `volcengine` / `siliconflow` / `fal` / `replicate` |
| `{PROVIDER}_API_KEY` | 예 | 제공자별 키, 예: `GEMINI_API_KEY`, `ZHIPU_API_KEY` |
| `{PROVIDER}_BASE_URL` | 선택 | 사용자 정의 엔드포인트 |
| `{PROVIDER}_MODEL` | 선택 | 모델 재정의 |

> 제공자별 이름만 사용: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `STABILITY_API_KEY`, `BFL_API_KEY`, `IDEOGRAM_API_KEY`, `QWEN_API_KEY` / `DASHSCOPE_API_KEY`, `ZHIPU_API_KEY` / `BIGMODEL_API_KEY`, `VOLCENGINE_API_KEY` / `ARK_API_KEY`, `SILICONFLOW_API_KEY`, `FAL_KEY`, `REPLICATE_API_TOKEN`.

> `IMAGE_API_KEY`, `IMAGE_MODEL`, `IMAGE_BASE_URL`은 의도적으로 미지원.

> `.env`나 환경에 여러 제공자가 있으면 `IMAGE_BACKEND`로 활성 제공자를 명시.

**지원 등급(권장)**:
- 핵심: `gemini`, `openai`, `qwen`, `zhipu`, `volcengine`
- 확장: `stability`, `bfl`, `ideogram`
- 실험: `siliconflow`, `fal`, `replicate`

**생성 페이싱(필수)**:
- 생성 명령은 한 번에 하나; 파일 확인 후 다음
- 이미지 사이 2~5초 간격 권장(동시성 실패 방지)
- 실패·무출력 시 대기열 중단, `IMAGE_BACKEND`·자격증명·출력 폴더 확인 후 재개

#### 방법 2: 자동 생성

이미지 생성 API를 직접 호출해 다운로드 후 `project/images/`에 저장.

#### 방법 3: Gemini 웹 UI

1. [Gemini](https://gemini.google.com/)에서 이미지 생성
2. **원본 크기 다운로드** 선택
3. 워터마크 제거: `python3 scripts/gemini_watermark_remover.py <이미지경로>`
4. 처리된 파일을 `project/images/`에 배치

#### 방법 4: 수동 생성(기타 플랫폼)

프롬프트는 `images/image_prompts.md`에 있음; 사용자에게 경로 안내. Midjourney·DALL-E·Stable Diffusion 등에서 생성 후 `project/images/`에 넣도록 안내.

### 4.4 검증 단계

- 모든 이미지가 `images/`에 있는지 확인
- 파일명이 자원 목록과 일치하는지 확인
- 자원 목록 상태를 "생성됨" 등으로 갱신

---

## 5. 프롬프트 문서 템플릿

`project/images/image_prompts.md` 작성 시 구조:

```markdown
# 이미지 생성 프롬프트

> 프로젝트: {project_name}
> 작성일: {date}
> 색 구성: 주색 {#HEX} | 보조 {#HEX} | 포인트 {#HEX}

---

## 이미지 목록 개요

| # | 파일명 | 유형 | 치수 | 상태 |
|---|----------|------|-----------|--------|
| 1 | cover_bg.png | 배경 | 1920x1080 | 생성 대기 |

---

## 상세 프롬프트

### 이미지 1: cover_bg.png

| 속성 | 값 |
|-----------|-------|
| 용도 | 표지 배경 |
| 유형 | 배경 |
| 치수 | 1920x1080 (16:9) |
| 원본 설명 | 현대적 테크 추상 배경, 딥 블루 그라데이션 |

**프롬프트**:
흐르는 디지털 파동의 미래지향 추상 배경…

**대체 텍스트**:
> 딥 블루 그라데이션의 현대적 테크 추상 배경, 디지털 파동, 은은한 입자

---

## 사용 방법

1. 위 "프롬프트"를 AI 이미지 도구에 복사
2. 권장: Midjourney / DALL-E 3 / Gemini / Stable Diffusion
3. 생성 파일을 해당 파일명으로 변경
4. `images/` 폴더에 배치
```

---

## 6. 네거티브 프롬프트 빠른 참고

### 유형별

| 유형 | 권장 네거티브 |
|------|---------------------------|
| 배경 | `text, letters, watermark, faces, busy patterns, high contrast details` |
| 사진 | `watermark, text overlay, artificial, CGI, illustration, cartoon, distorted faces` |
| 삽화 | `realistic, photography, 3D render, complex textures, watermark` |
| 다이어그램 | `cluttered, messy, overlapping elements, dark background, realistic` |
| 장식 패턴 | `busy, cluttered, high contrast, distracting, photorealistic` |

### 범용

- **표준**: `text, watermark, signature, blurry, distorted, low quality`
- **확장**(인물): `text, watermark, signature, blurry, low quality, distorted, extra fingers, mutated hands, poorly drawn face, bad anatomy, extra limbs, disfigured, deformed`

---

## 7. 흔한 이슈

### "생성 설명"이 없을 때 기본 추론

| 용도 | 기본 추론 |
|---------|------------------|
| 표지 배경 | 추상 그라데이션 배경, 중앙 텍스트 영역 확보 |
| 챕터 배경 | 깔끔한 기하 패턴, 단색 중심 |
| 팀 소개 | 팀 협업 장면 삽화(플랫 스타일) |
| 데이터 페이지 | 깔끔한 기하 또는 단색 배경 |
| 제품 쇼케이스 | 제품 사진 스타일, 흰색 또는 그라데이션 배경 |

### 결과가 마음에 들지 않을 때

| 문제 | 진단 | 프롬프트 조정 |
|---------|-----------|-------------------|
| 스타일 불일치 | 플랫를 원했는데 사진 같음 | 스타일 지시를 `photography`에서 `flat design illustration`로 |
| 색 불일치 | 설계 명세 팔레트와 다름 | HEX를 명시적으로 반복, 색 이름 강화 |
| 구도 불일치 | 피사체가 치우치거나 슬라이드에 안 맞음 | `centered composition`, `rule of thirds`, `wide negative space on left` 등 추가 |
| 피사체 불일치 | 설명과 다른 피사체 | 주제 서술을 더 구체적으로 다시 작성 |
| 저품질 | 흐림·아티팩트·디테일 부족 | `highly detailed, sharp focus, professional quality, 8K resolution` 추가 |

**변형 워크플로**:
1. 원본 프롬프트를 `image_prompts.md`에 "변형 A"로 보존
2. 위 표에 따른 수정본을 "변형 B"
3. 필요 시 "변형 C"로 다른 스타일 접근
4. 변형을 명확히 라벨해 사용자가 비교 가능하게

---

## 8. 역할 협업

### 전략가와 인계

| 방향 | 내용 |
|-----------|---------|
| 수신 | 설계 명세·콘텐츠 개요(이미지 자원 목록 포함) |
| 발동 조건 | "이미지 사용"에서 "C) AI 생성" 선택 |
| 핵심 정보 | 색 구성·디자인 스타일·캔버스 형식 |

### 실행자와 인계

| 방향 | 내용 |
|-----------|---------|
| 전달 | 모든 이미지를 `project/images/`에 배치 |
| 실행자 참조 | `<image href="../images/xxx.png" .../>` |
| 경로 | SVG는 `svg_output/`, 이미지는 `images/`; 상대 경로 `../images/` |

---

## 9. 작업 완료 체크포인트

### 필수 완료

- [ ] `project/images/image_prompts.md` 작성
- [ ] 이미지마다: 유형 판별 + 최적 프롬프트 + 네거티브 + 대체 텍스트
- [ ] 2.1 표준 형식 준수
- [ ] 단계 완료 확인 출력

### 이미지 준비(하나 이상 충족)

- [ ] 모든 이미지를 `project/images/`에 저장
- [ ] 또는: 사용자에게 `image_prompts.md`로 자가 생성하도록 명확히 안내

### 파이프라인

- [ ] 다음 단계(실행자 역할) 진행 안내

> **중요**: `images/image_prompts.md`가 없거나 2.1 형식이 아니면 작업 **미완료**.

### 완료 확인 출력 형식

```markdown
## 이미지 생성기 단계 완료

- [x] `project/images/image_prompts.md` 작성
- [x] N개 이미지에 대한 최적화 프롬프트 작성
- [x] 모든 이미지를 `images/`에 저장
- [x] 이미지 자원 목록 상태 갱신

**이미지 상태 요약**:

| 파일명 | 유형 | 치수 | 상태 |
|----------|------|-----------|--------|
| cover_bg.png | 배경 | 1920x1080 | 생성됨 |

**다음 단계**: 실행자 역할로 전환해 SVG 생성 시작
```
