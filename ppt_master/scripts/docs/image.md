# 이미지 도구

프롬프트 기반 생성·이미지 검사·Gemini 워터마크 제거를 다룹니다.

## `image_gen.py`

통합 이미지 생성 진입점입니다.

```bash
python3 scripts/image_gen.py "현대적인 미래형 업무 공간"
python3 scripts/image_gen.py "추상 테크 배경" --aspect_ratio 16:9 --image_size 4K
python3 scripts/image_gen.py "콘셉트 카" -o projects/demo/images
python3 scripts/image_gen.py "풍경" -n "저품질, 흐림, 워터마크"
python3 scripts/image_gen.py --list-backends
```

지원 등급:
- 핵심: `gemini`, `openai`, `qwen`, `zhipu`, `volcengine`
- 확장: `stability`, `bfl`, `ideogram`
- 실험: `minimax`, `siliconflow`, `fal`, `replicate`

백엔드 선택:

```bash
python3 scripts/image_gen.py "고양이" --backend openai
python3 scripts/image_gen.py "시네마틱 인물" --backend minimax
python3 scripts/image_gen.py "제품 히어로 이미지" --backend qwen
python3 scripts/image_gen.py "프롬프트 예시" --backend zhipu
python3 scripts/image_gen.py "프롬프트 예시" --backend volcengine
```

설정 출처:

1. 현재 프로세스 환경 변수
2. 저장소 루트 `.env` 보조

활성 백엔드는 항상 `IMAGE_BACKEND`로 명시합니다.

예시 `.env`:

```env
IMAGE_BACKEND=gemini
GEMINI_API_KEY=your-api-key
GEMINI_BASE_URL=https://your-proxy-url.com/v1beta
GEMINI_MODEL=gemini-3.1-flash-image-preview
```

예시 프로세스 환경:

```bash
export IMAGE_BACKEND=gemini
export GEMINI_API_KEY=your-api-key
export GEMINI_MODEL=gemini-3.1-flash-image-preview
```

프로세스 환경이 `.env`보다 우선합니다.

제공자별 키만 사용: `GEMINI_API_KEY`, `OPENAI_API_KEY`, `MINIMAX_API_KEY`, `QWEN_API_KEY`, `ZHIPU_API_KEY`, `VOLCENGINE_API_KEY`, `FAL_KEY`, `REPLICATE_API_TOKEN` 등.

`IMAGE_API_KEY`, `IMAGE_MODEL`, `IMAGE_BASE_URL`은 의도적으로 미지원입니다.

`.env`나 환경에 여러 제공자가 있으면 `IMAGE_BACKEND`로 활성 제공자를 고릅니다.

권장:
- 일상 PPT 작업은 핵심 등급 기본
- 특정 모델 스타일이 필요할 때만 확장
- 실험 등급은 옵트인

MiniMax 백엔드 예시 `.env`:

```env
IMAGE_BACKEND=minimax
MINIMAX_API_KEY=your-api-key
# 선택: 기본 URL 재정의(기본 https://api.minimaxi.com, 국내 엔드포인트)
# 해외: https://api.minimax.io
# MINIMAX_BASE_URL=https://api.minimax.io
# MINIMAX_MODEL=image-01
```

## `analyze_images.py`

설계 명세 작성·슬라이드 구도 전에 프로젝트 디렉터리 이미지를 분석합니다.

```bash
python3 scripts/analyze_images.py <프로젝트경로>/images
```

워크플로를 따를 때 이미지 파일을 직접 열지 않고 이 스크립트 출력을 사용합니다.

## `gemini_watermark_remover.py`

수동 다운로드 후 Gemini 워터마크 자산을 제거합니다.

```bash
python3 scripts/gemini_watermark_remover.py <이미지경로>
python3 scripts/gemini_watermark_remover.py <이미지경로> -o output_path.png
python3 scripts/gemini_watermark_remover.py <이미지경로> -q
```

참고:
- `scripts/assets/bg_48.png`, `scripts/assets/bg_96.png` 필요
- "원본 크기" 다운로드 Gemini 이미지 처리 후에 가장 잘 맞음

의존성:

```bash
pip install Pillow numpy
```
