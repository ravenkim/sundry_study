from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, Field


# ─────────────────────────────────────────────
# Legacy POST /api/chat (1단계, 단발 호출용)
# ─────────────────────────────────────────────


class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1)


class ChatRequest(BaseModel):
    """POST /api/chat 요청 스키마. messages 가 빈 배열이면 첫 인사 생성."""

    messages: list[ChatMessage] = Field(default_factory=list)


class ChatResponse(BaseModel):
    """POST /api/chat 응답 스키마."""

    model_config = ConfigDict(populate_by_name=True)

    reply: str
    safetyCutoffSuggested: bool = False
    recommendation: Optional[dict] = None


# ─────────────────────────────────────────────
# Chat Rooms (3단계, DB 저장형)
# ─────────────────────────────────────────────


class FeatureItem(BaseModel):
    key: str
    label: str
    description: str
    default_greeting: str


class FeaturesResponse(BaseModel):
    items: list[FeatureItem]


class RoomCreateRequest(BaseModel):
    feature_key: str = Field(min_length=1, max_length=64)
    character_key: str = Field(default="bartender_jun", min_length=1, max_length=64)
    title: Optional[str] = Field(default=None, max_length=255)
    greeting_override: Optional[str] = Field(default=None, max_length=2000)
    system_prompt_override: Optional[str] = Field(default=None, max_length=4000)


class MessageItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    role: Literal["user", "assistant"]
    content: str
    created_at: datetime


class RoomItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    feature_key: str
    character_key: str
    title: Optional[str] = None
    created_at: datetime
    last_message_at: Optional[datetime] = None


class RoomCreatedResponse(RoomItem):
    """채팅방 생성 응답: 룸 메타 + 자동 생성된 첫 인사 메시지."""

    greeting_message: MessageItem


class RoomListItem(RoomItem):
    """룸 목록 한 줄: 룸 메타 + 마지막 메시지 미리보기."""

    preview: Optional[str] = None


class RoomListResponse(BaseModel):
    items: list[RoomListItem]
    next_cursor: Optional[str] = None


class MessageListResponse(BaseModel):
    items: list[MessageItem]
    next_cursor: Optional[str] = None


class SendMessageRequest(BaseModel):
    content: str = Field(min_length=1, max_length=4000)


class SendMessageResponse(BaseModel):
    user_message: MessageItem
    assistant_message: MessageItem
