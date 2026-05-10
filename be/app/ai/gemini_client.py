"""Thin wrapper around the google-genai SDK for the bartender persona.

- 기본 페르소나 system_instruction 은 `BARTENDER_SYSTEM_INSTRUCTION` 으로 두고,
  feature 별 룸에서는 `system_instruction` 파라미터로 override.
- 응답 톤은 모바일 채팅 UI(카톡 말풍선) 기준이므로 Gemini 가 흔히 내는 마크다운
  (별표 강조, 헤딩, 불릿, 코드펜스, 수평선 등)을 시스템 가이드 + 후처리 양쪽에서 차단합니다.
- 본 모듈은 DB·세션을 모르므로, 호출자가 messages list[dict] 를 전달.
"""

from __future__ import annotations

import re
from typing import Iterable, Optional

from google import genai
from google.genai import types

from app.core.config import get_settings

# 페르소나 코어 — doc/persona.md 의 시스템 프롬프트 초안을 그대로 사용.
BARTENDER_SYSTEM_INSTRUCTION = (
    "당신은 혼자 사는 사람들을 위한 바의 바텐더 '준'이에요.\n"
    "손님을 '단골손님'이라고 부르고, 따뜻하고 친근하게 대화해요.\n"
    "대화 흐름 속에서 자연스럽게 음료·안주·음악을 슬쩍 곁들여요.\n"
    "과음 징후가 보이면 부드럽게 마무리하고 휴식을 권해요.\n"
    "직업적 진단이나 특정 치료를 대신한다고 말하지 않아요."
)

# 모든 호출의 system_instruction 끝에 합성되는 채팅 톤 가이드.
# feature 별 system_prompt 가 따로 지시하더라도 출력 형식·톤만큼은 항상 이 규칙을 따름.
CONVERSATIONAL_STYLE = """\
[응답 형식 — 절대 규칙]

당신은 모바일 메신저 카톡 말풍선에 잠깐 답을 보내는 단골 바텐더예요.
긴 글이나 상담원처럼 정중한 답을 쓰지 마세요. 친한 단골이
짧게 한두 마디 건네는 느낌으로만 답합니다.

말투:
- 구어체. "~예요", "~네요", "~죠", "~어요", "~같아요" 같은 부드러운 종결어미.
- "~입니다", "~합니다" 같은 격식체는 거의 쓰지 않아요.
- 상담원·도우미·강사 톤 금지. 친구가 잠깐 톡 보내는 정도의 거리.
- 정보를 알려주는 게 아니라 분위기와 공감을 먼저 주고, 추천은 슬쩍 곁들이는 정도.

길이와 호흡:
- 한 응답은 보통 3~5 줄. 길어 봐야 6 줄 이내.
- 한 문단은 1~2 문장. 문단 사이는 빈 줄(엔터 두 번)로 띄워서 호흡을 만들어요.
- 한 문장이 길어지면 자연스러운 자리에서 줄바꿈으로 끊어 두 줄로 만듭니다.
- 모바일 말풍선처럼 짧고 빠르게 읽혀야 해요.

쓰면 안 되는 것 (절대):
- 마크다운 문법: **굵게**, *기울임*, _기울임_, 헤딩 #/##/###, 불릿 -/*/1./2.,
  표, 인용 >, 코드 ```...```, 인라인 코드 `...`, 수평선 ---/***
- "술 이름:", "이유:", "안주:", "분위기:", "음악:" 같은 라벨/소제목으로 끊어 적기.
- 한 응답에 메뉴 여러 개를 줄세우는 행위. 가장 어울릴 한 가지만 슬쩍 권해요.
- 백과사전·에세이 톤. 풀어서 길게 설명하지 마세요.
- "왜냐하면", "특히", "예를 들어" 같은 설명조 접속어 남발.

이런 톤이에요 (예시 — 형식만 참고, 내용은 상황에 맞게):

오늘 같은 날엔 막걸리 한 잔 괜찮을 것 같아요.

너무 센 술보단 편하게 긴장 풀리는 느낌이
지금 분위기랑 잘 어울릴 것 같거든요.

김치 같은 거 하나 꺼내놓고 조용히 마시면
오늘 하루 마무리로 딱일 듯해요.
"""

# messages 가 비어있을 때 사용하는 인사 트리거.
EMPTY_OPENING_USER_PROMPT = (
    "[화면에 처음 입장한 단골손님께 따뜻하게 한두 줄로 짧게 인사 건네고, "
    "오늘 기분이나 마시고 싶은 거 가볍게 한 번만 물어봐 줘요.]"
)


# ──────────────────────────────────────────────
# Markdown stripper (안전망)
# ──────────────────────────────────────────────

# 코드펜스: ```python ... ``` 또는 ``` ... ```
_RE_CODE_FENCE = re.compile(r"```[a-zA-Z0-9_+\-]*\s*\n?")
# 인라인 코드: `code` → code
_RE_INLINE_CODE = re.compile(r"`([^`\n]+?)`")
# **bold** → bold
_RE_BOLD = re.compile(r"\*\*([^*\n]+?)\*\*")
# *italic* → italic  (단일 별표; 단어 경계로 보호)
_RE_ITALIC_STAR = re.compile(r"(?<![*\w])\*([^*\n]+?)\*(?![*\w])")
# _italic_ → italic
_RE_ITALIC_UNDER = re.compile(r"(?<![_\w])_([^_\n]+?)_(?![_\w])")
# # heading 줄 시작
_RE_HEADING = re.compile(r"^\s{0,3}#{1,6}[ \t]+", re.MULTILINE)
# 수평선 줄 (---, ***, ___) 통째로 제거
_RE_HORIZONTAL_RULE = re.compile(r"^[ \t]{0,3}(?:-{3,}|\*{3,}|_{3,})[ \t]*$", re.MULTILINE)
# 줄 시작의 불릿(- / * / • / 1.)
_RE_BULLET = re.compile(r"^[ \t]{0,3}(?:[*\-•]|\d{1,2}\.)[ \t]+", re.MULTILINE)
# 인용부호 > 줄 시작
_RE_BLOCKQUOTE = re.compile(r"^\s{0,3}>[ \t]?", re.MULTILINE)
# [text](url) → text url
_RE_LINK = re.compile(r"\[([^\]\n]+)\]\((https?://[^)\s]+)\)")
# 줄 끝 공백
_RE_TRAILING_WS = re.compile(r"[ \t]+$", re.MULTILINE)
# 빈 줄 3개 이상 → 2개로 압축
_RE_MULTIBLANK = re.compile(r"\n{3,}")


def strip_markdown_for_chat(text: str) -> str:
    """모바일 채팅 말풍선용으로 LLM 응답에 남은 마크다운 잔여물을 제거."""
    if not text:
        return text
    s = text
    s = _RE_CODE_FENCE.sub("", s)
    s = _RE_INLINE_CODE.sub(r"\1", s)
    s = _RE_BOLD.sub(r"\1", s)
    s = _RE_ITALIC_STAR.sub(r"\1", s)
    s = _RE_ITALIC_UNDER.sub(r"\1", s)
    s = _RE_HEADING.sub("", s)
    s = _RE_HORIZONTAL_RULE.sub("", s)
    s = _RE_BULLET.sub("", s)
    s = _RE_BLOCKQUOTE.sub("", s)
    s = _RE_LINK.sub(r"\1 \2", s)
    s = _RE_TRAILING_WS.sub("", s)
    s = _RE_MULTIBLANK.sub("\n\n", s)
    return s.strip()


def _compose_system_instruction(base: Optional[str]) -> str:
    """feature/persona system_prompt 끝에 채팅 톤 가이드를 항상 합성."""
    return f"{base or BARTENDER_SYSTEM_INSTRUCTION}\n\n{CONVERSATIONAL_STYLE}"


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
        - 어떤 호출이든 모바일 채팅 톤 가이드 + 마크다운 stripping 이 적용됩니다.
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
            system_instruction=_compose_system_instruction(system_instruction),
        ),
    )

    raw_text = (response.text or "").strip()
    return strip_markdown_for_chat(raw_text)
