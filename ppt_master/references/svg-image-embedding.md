> 공통 기술 제약은 shared-standards.md를 참고합니다.

# SVG 이미지 삽입 가이드

SVG에 이미지를 넣을 때의 기술 사양과 권장 워크플로입니다.

---

## 이미지 자원 목록 형식

설계 명세·콘텐츠 개요에 정의; 각 이미지에 상태 표기. 이미지 방식에 "B) 사용자 제공"이 있으면 전략가가 여덟 가지 확인 직후 `analyze_images.py`를 실행하고 설계 명세 출력 전에 목록을 완성합니다.

```markdown
| 파일명 | 치수 | 용도 | 상태 | 생성 설명 |
|----------|-----------|---------|--------|----------------------|
| cover_bg.png | 1280x720 | 표지 배경 | 생성 대기 | 현대적 테크 추상 배경, 딥 블루 그라데이션 |
| product.png | 600x400 | 3페이지 | 기존 | - |
| team.png | 600x400 | 5페이지 | 플레이스홀더 | 팀 협업 장면(후속 삽입) |
```

### 세 가지 상태

| 상태 | 의미 | 실행자 처리 |
|--------|---------|-------------------|
| **생성 대기** | AI 생성 필요, 설명 있음 | 먼저 `images/`에 생성 후 `<image>` 참조 |
| **기존** | 사용자 보유 | `images/`에 두고 `<image>` 참조 |
| **플레이스홀더** | 미처리 | 점선 플레이스홀더; 이후 교체 |

---

## 워크플로

```
1. 전략가가 이미지 요구 정의 → 자원 목록·상태 표기
2. 이미지 준비(생성 대기/기존) → project/images/
3. 실행자가 SVG 생성(svg_output/)
   ├── 기존/생성 완료 → <image href="../images/xxx.png" .../>
   └── 플레이스홀더 → 점선+설명 텍스트
4. 미리보기: python3 -m http.server -d <프로젝트경로> 8000 → /svg_output/<파일>.svg
5. 후처리·내보내기
   ├── python3 scripts/finalize_svg.py <프로젝트경로>
   └── python3 scripts/svg_to_pptx.py <프로젝트경로> -s final
```

> 생성 중에는 `svg_output/`에 외부 참조를 유지합니다. `finalize_svg.py`가 `svg_final/`에 이미지를 삽입한 뒤, `svg_final/`에서 PPTX를 내보냅니다.

---

## 외부 참조 vs Base64 삽입

| 방식 | 장점 | 단점 | 적합 |
|--------|------|------|-------------|
| **외부 참조** | 용량 작음, 반복 치환 쉬움 | 미리보기는 프로젝트 루트에서 HTTP 서버 권장 | `svg_output/` 개발 단계 |
| **Base64** | 단일 파일, 내보내기 안정 | 용량 큼 | `svg_final/` 납품 단계 |

---

## 방법 1: 외부 참조(생성 단계 권장)

### 문법

```xml
<image href="../images/image.png" x="0" y="0" width="1280" height="720"
       preserveAspectRatio="xMidYMid slice"/>
```

### 주요 속성

| 속성 | 설명 | 예 |
|-----------|-------------|---------|
| `href` | 이미지 경로(상대·절대) | `"../images/cover.png"` |
| `x`, `y` | 좌상단 | `x="0" y="0"` |
| `width`, `height` | 표시 크기 | `width="1280" height="720"` |
| `preserveAspectRatio` | 스케일 모드 | `"xMidYMid slice"` |

### preserveAspectRatio 흔한 값

| 값 | 효과 |
|-------|--------|
| `xMidYMid slice` | 중앙 기준 채움(CSS `cover` 유사) |
| `xMidYMid meet` | 전체 표시(CSS `contain` 유사) |
| `none` | 늘려 채움, 비율 무시 |

### 미리보기

브라우저 보안으로 로컬 파일 직접 열기 시 외부 이미지가 막힐 수 있습니다. 프로젝트 루트에서 HTTP 서버를 띄웁니다.

```bash
python3 -m http.server -d <프로젝트경로> 8000
# http://localhost:8000/svg_output/파일.svg
```

---

## 방법 2: Base64 삽입(납품 단계 권장)

### 문법

```xml
<image href="data:image/png;base64,iVBORw0KGgo..." x="0" y="0" width="1280" height="720"/>
```

### MIME

| MIME | 형식 |
|-----------|-------------|
| `image/png` | PNG |
| `image/jpeg` | JPG/JPEG |
| `image/gif` | GIF |
| `image/webp` | WebP |
| `image/svg+xml` | SVG |

---

## 변환 과정

### 권장: finalize_svg.py(통합 파이프라인)

```bash
python3 scripts/finalize_svg.py <프로젝트경로>         # 아이콘·이미지·텍스트·둥근 사각형 등 일괄
python3 scripts/svg_to_pptx.py <프로젝트경로> -s final  # 최종본에서 PPTX
```

### 단독: embed_images.py(고급)

전체 파이프라인 없이 특정 SVG만 처리:

```bash
python3 scripts/svg_finalize/embed_images.py <svg_file>
python3 scripts/svg_finalize/embed_images.py <프로젝트경로>/svg_output/*.svg
python3 scripts/svg_finalize/embed_images.py --dry-run <프로젝트경로>/svg_output/*.svg
```

---

## 모범 사례

### 이미지 최적화

삽입 전 압축해 용량을 줄입니다.

```bash
convert input.png -quality 85 -resize 1920x1080\> output.png  # ImageMagick
pngquant --quality=65-80 input.png -o output.png               # pngquant(권장)
```

### 파일 구성

```
project/
├── images/            # 이미지 자산
├── sources/           # 원본 및 동봉 이미지
│   └── article_files/
├── svg_output/        # 원본(외부 참조)
└── svg_final/         # 최종(이미지 삽입됨)
```

### 둥근 모서리(clipPath 금지)

PPT와 맞지 않는 `clipPath`로 이미지 둥근 모서리를 만들지 않습니다. 대안:
- 이미지 생성·내보내기 단계에서 둥근 PNG로 처리
- 또는 가장자리에 동일 크기 둥근 `<rect>`를 덧씌워 시각적으로 시뮬레이션

---

## FAQ

**Q: SVG만 열면 이미지가 안 보입니다.**  
브라우저 정책으로 교차 디렉터리 요청이 막힐 수 있습니다. 프로젝트 루트에서 HTTP 서버를 쓰거나, 먼저 `finalize_svg.py` 후 `svg_final/`에서 확인합니다.

**Q: Base64 파일이 너무 큽니다.**  
원본 압축, JPEG 사용, 해상도를 실제 표시 크기에 맞춤.

**Q: Base64를 다시 파일로 뽑으려면?**
```bash
base64 -d image.b64 > image.png
```
