from __future__ import annotations

import logging

from fastapi import APIRouter, HTTPException, status

from app.ai.gemini_client import generate_bartender_reply
from app.schemas.chat import ChatRequest, ChatResponse

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
def chat(payload: ChatRequest) -> ChatResponse:
    """Stateless 바텐더 대화 (MVP).

    - DB 저장하지 않습니다.
    - 인증하지 않습니다.
    - messages 가 비어있으면 바텐더 첫 인사를 생성합니다.
    """
    try:
        history = [m.model_dump() for m in payload.messages]
        reply = generate_bartender_reply(history)
    except Exception as exc:
        logger.exception("Gemini upstream call failed")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini upstream error: {exc}",
        ) from exc

    if not reply:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Empty response from Gemini",
        )

    return ChatResponse(reply=reply)
