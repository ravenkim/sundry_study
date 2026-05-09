"""Thin wrapper around the google-genai SDK for the bartender persona.

- 기본 페르소나 system_instruction 은 `BARTENDER_SYSTEM_INSTRUCTION` 으로 두고,
  feature 별 룸에서는 `system_instruction` 파라미터로 override.
- 본 모듈은 DB·세션을 모르므로, 호출자가 messages list[dict] 를 전달.
"""

from __future__ import annotations

from typing import Iterable, Optional

from google import genai
from google.genai import types

from app.core.config import get_settings

# 페르소나 코어 — doc/persona.md 의 시스템 프롬프트 초안을 그대로 사용.
BARTENDER_SYSTEM_INSTRUCTION = (
    "당신은 혼자 사는 사람들을 위한 바의 바텐더 '준'입니다.\n"
    "손님을 '단골손님'이라고 부르고, 따뜻하고 친근하게 대화합니다.\n"
    "대화 시작 시에는 반드시 먼저 기분이나 원하는 음료를 물어봅니다.\n"
    "대화 흐름 속에서 자연스럽게 음료·안주·음악을 추천합니다.\n"
    "과음 징후가 보이면 부드럽게 마무리하고 휴식을 권합니다.\n"
    "직업적 진단이나 특정 치료를 대신한다고 말하지 않습니다."
)

# messages 가 비어있을 때 사용하는 인사 트리거.
EMPTY_OPENING_USER_PROMPT = (
    "[화면에 처음 입장한 단골손님께 따뜻하게 첫 인사를 건네고, "
    "오늘의 기분이나 마시고 싶은 음료를 가볍게 한 번만 물어봐 주세요.]"
)


def _build_client() -> genai.Client:
    return genai.Client(api_key=get_settings().GEMINI_API_KEY)


def _to_gemini_contents(messages: Iterable[dict]) -> list[types.Content]:
    """API 요청의 {role, content} 메시지를 Gemini contents 형식으로 변환.

    Gemini는 'user' / 'model' role을 사용하므로 'assistant' → 'model' 매핑.
    """
    contents: list[types.Content] = []
    for message in messages:
        role = "user" if message["role"] == "user" else "model"
        contents.append(
            types.Content(
                role=role,
                parts=[types.Part.from_text(text=message["content"])],
            )
        )
    return contents


def generate_bartender_reply(
    messages: list[dict],
    *,
    system_instruction: Optional[str] = None,
) -> str:
    """Generate a bartender reply.

    Args:
        messages: [{"role": "user" | "assistant", "content": str}, ...]
        system_instruction: feature 별 시스템 프롬프트. 미지정 시 기본 페르소나.

    Behavior:
        - messages 가 비어있으면 첫 인사 트리거를 사용해 응답을 생성합니다.
        - 그 외에는 전달된 대화 이력을 그대로 사용해 다음 턴을 생성합니다.
    """
    settings = get_settings()
    client = _build_client()

    if not messages:
        contents = _to_gemini_contents(
            [{"role": "user", "content": EMPTY_OPENING_USER_PROMPT}]
        )
    else:
        contents = _to_gemini_contents(messages)

    response = client.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction or BARTENDER_SYSTEM_INSTRUCTION,
        ),
    )

    text = (response.text or "").strip()
    return text
