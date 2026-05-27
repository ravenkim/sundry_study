# SVG 아이콘 라이브러리

이 디렉터리는 PPT Master가 생성하는 SVG에 바로 삽입할 수 있는 **6700+ 고품질 SVG 아이콘**(세 라이브러리)을 제공합니다.

## 라이브러리

| 라이브러리 | 스타일 | 개수 | viewBox | 접두사 |
|---------|-------|-------|---------|--------|
| `chunk` | 채움·직선 기하(각진·직교) | 640 | `0 0 16 16` | `chunk/` |
| `tabler-filled` | 채움·베지어 곡선(부드러운 윤곽) | 1000+ | `0 0 24 24` | `tabler-filled/` |
| `tabler-outline` | 스트로크 / 선 | 5000+ | `0 0 24 24` | `tabler-outline/` |

---

## 사용법

SVG 생성 **중** 플레이스홀더 문법:

```xml
<!-- chunk (기본 — 솔리드, 기하, 미니멀) -->
<use data-icon="chunk/home" x="100" y="200" width="48" height="48" fill="#0076A8"/>

<!-- tabler-filled (chunk에 없을 때 대안) -->
<use data-icon="tabler-filled/home" x="100" y="200" width="48" height="48" fill="#0076A8"/>

<!-- tabler-outline (얇은 선형 — 화면용 라이트 톤 덱) -->
<use data-icon="tabler-outline/home" x="100" y="200" width="48" height="48" fill="#0076A8"/>
```

**속성**:
- `data-icon` — `<라이브러리>/<아이콘명>`(`.svg` 제외)
- `x`, `y` — 위치
- `width`, `height` — 크기(가독을 위해 32~48px 권장)
- `fill` — 색

`finalize_svg.py`가 후처리에서 모든 플레이스홀더를 삽입합니다. 수동 실행:

```bash
python3 scripts/svg_finalize/embed_icons.py svg_output/*.svg
```

---

## 아이콘 검색

`ls | grep` — 토큰 비용 없음:

```bash
ls skills/ppt-master/templates/icons/chunk/ | grep home
ls skills/ppt-master/templates/icons/tabler-filled/ | grep home
ls skills/ppt-master/templates/icons/tabler-outline/ | grep chart
```

---

## 스타일 규칙

**기본은 `chunk`** — 경로가 M/L/H/V/Z 직선만으로 각진 정밀 각도를 만듭니다.

**`tabler-filled`**는 C/A 등 베지어·호로 윤곽이 부드럽고 유기적입니다.

**한 프레젠테이션 = 한 라이브러리.** 시작할 때 고르고 끝까지 동일하게 씁니다. 정확히 일치하는 아이콘이 없으면 **같은 라이브러리 안**에서 가장 가까운 대안을 쓰고, 라이브러리를 섞지 않습니다.

| 라이브러리 | 사용 시점 |
|---------|-------------|
| `chunk` 기본 | 대부분 — 각진 기하, 구조적, 가독성 높음 |
| `tabler-filled` | 부드럽고 둥근 유기적 형태가 필요할 때 |
| `tabler-outline` | 화면용 덱에서 가볍고 우아한 선형 톤이 필요할 때 |

한 덱에서 서로 다른 라이브러리 아이콘을 **섞지 마세요**. 하나를 고르고 일관되게 사용합니다.
