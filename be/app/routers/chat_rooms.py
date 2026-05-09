"""Chat room / message endpoints (3단계).

본 단계에서 인증은 강제하지 않습니다. JWT 강제로 전환할 때:
- `Depends(get_active_user)` → `Depends(get_current_user)` 로 교체.
"""

from __future__ import annotations

from typing import Optional

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.deps import get_active_user
from app.db.base import get_db
from app.models.user import User
from app.schemas.chat import (
    FeatureItem,
    FeaturesResponse,
    MessageItem,
    MessageListResponse,
    RoomCreatedResponse,
    RoomCreateRequest,
    RoomItem,
    RoomListItem,
    RoomListResponse,
    SendMessageRequest,
    SendMessageResponse,
)
from app.services import chat_service, feature_registry

router = APIRouter(prefix="/api/chat", tags=["chat-rooms"])


@router.get("/features", response_model=FeaturesResponse, summary="feature 카탈로그")
def get_features() -> FeaturesResponse:
    items = [FeatureItem(**f) for f in feature_registry.list_features()]
    return FeaturesResponse(items=items)


@router.post(
    "/rooms",
    response_model=RoomCreatedResponse,
    status_code=status.HTTP_201_CREATED,
    summary="채팅방 생성 (첫 인사 자동 삽입)",
)
def create_room(
    payload: RoomCreateRequest,
    user: User = Depends(get_active_user),
    db: Session = Depends(get_db),
) -> RoomCreatedResponse:
    room, greeting = chat_service.create_room(
        db,
        user=user,
        feature_key=payload.feature_key,
        character_key=payload.character_key,
        title=payload.title,
        greeting_override=payload.greeting_override,
        system_prompt_override=payload.system_prompt_override,
    )
    return RoomCreatedResponse(
        id=room.id,
        feature_key=room.feature_key,
        character_key=room.character_key,
        title=room.title,
        created_at=room.created_at,
        last_message_at=room.last_message_at,
        greeting_message=MessageItem.model_validate(greeting),
    )


@router.get("/rooms", response_model=RoomListResponse, summary="내 채팅방 목록")
def list_rooms(
    feature_key: Optional[str] = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    user: User = Depends(get_active_user),
    db: Session = Depends(get_db),
) -> RoomListResponse:
    pairs = chat_service.list_rooms(
        db, user=user, feature_key=feature_key, limit=limit
    )
    items = [
        RoomListItem(
            id=room.id,
            feature_key=room.feature_key,
            character_key=room.character_key,
            title=room.title,
            created_at=room.created_at,
            last_message_at=room.last_message_at,
            preview=preview,
        )
        for room, preview in pairs
    ]
    return RoomListResponse(items=items, next_cursor=None)


@router.get(
    "/rooms/{room_id}",
    response_model=RoomItem,
    summary="채팅방 단건",
)
def get_room(
    room_id: int,
    user: User = Depends(get_active_user),
    db: Session = Depends(get_db),
) -> RoomItem:
    # _ensure_room_owner 가 404 처리.
    room = chat_service._ensure_room_owner(db, room_id=room_id, user=user)
    return RoomItem.model_validate(room)


@router.get(
    "/rooms/{room_id}/messages",
    response_model=MessageListResponse,
    summary="채팅방 메시지 목록",
)
def list_messages(
    room_id: int,
    limit: int = Query(default=50, ge=1, le=200),
    before: Optional[int] = Query(default=None, ge=1),
    user: User = Depends(get_active_user),
    db: Session = Depends(get_db),
) -> MessageListResponse:
    messages = chat_service.list_messages(
        db, user=user, room_id=room_id, limit=limit, before=before
    )
    items = [MessageItem.model_validate(m) for m in messages]
    return MessageListResponse(items=items, next_cursor=None)


@router.post(
    "/rooms/{room_id}/messages",
    response_model=SendMessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="메시지 전송 (Gemini 응답 생성)",
)
def send_message(
    room_id: int,
    payload: SendMessageRequest,
    user: User = Depends(get_active_user),
    db: Session = Depends(get_db),
) -> SendMessageResponse:
    user_msg, assistant_msg = chat_service.send_message(
        db, user=user, room_id=room_id, content=payload.content
    )
    return SendMessageResponse(
        user_message=MessageItem.model_validate(user_msg),
        assistant_message=MessageItem.model_validate(assistant_msg),
    )
