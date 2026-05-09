"""Chat room / message orchestration on top of SQLAlchemy + Gemini."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.ai import feature_registry, gemini_client
from app.models.chat import ChatMessage, ChatRoom
from app.models.user import User

# Gemini 호출 시 함께 보낼 최근 메시지 개수 (system 제외, user/assistant)
HISTORY_TURNS = 20


def _now_utc() -> datetime:
    return datetime.now(timezone.utc)


def _ensure_room_owner(db: Session, *, room_id: int, user: User) -> ChatRoom:
    room = db.get(ChatRoom, room_id)
    if room is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    if room.user_id != user.id:
        # 본인 룸이 아닌 경우 정보 누출 방지를 위해 404 처리.
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Room not found"
        )
    return room


def _autogen_title(label: str) -> str:
    return f"{label} - {_now_utc().strftime('%Y-%m-%d %H:%M')}"


def create_room(
    db: Session,
    *,
    user: User,
    feature_key: str,
    character_key: str,
    title: Optional[str],
    greeting_override: Optional[str],
    system_prompt_override: Optional[str],
) -> tuple[ChatRoom, ChatMessage]:
    """Create a chat room and insert the first assistant greeting message."""
    feature = feature_registry.get_feature(feature_key)
    if feature is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unknown feature_key: {feature_key}",
        )

    greeting_text = (greeting_override or "").strip() or feature["default_greeting"]
    final_title = (title or "").strip() or _autogen_title(feature["label"])

    now = _now_utc()
    room = ChatRoom(
        user_id=user.id,
        feature_key=feature_key,
        character_key=character_key,
        title=final_title,
        last_message_at=now,
    )
    db.add(room)
    db.flush()  # room.id 확보

    greeting = ChatMessage(
        room_id=room.id,
        role="assistant",
        content=greeting_text,
    )
    db.add(greeting)
    db.commit()
    db.refresh(room)
    db.refresh(greeting)

    # system_prompt_override 는 룸 단위 메타로 저장하지 않음 (스키마 단순 유지).
    # 향후 필요 시 chat_rooms 에 컬럼 추가하거나 별도 테이블로 확장.
    _ = system_prompt_override
    return room, greeting


def list_rooms(
    db: Session,
    *,
    user: User,
    feature_key: Optional[str] = None,
    limit: int = 20,
) -> list[tuple[ChatRoom, Optional[str]]]:
    """Return (room, last_message_preview) tuples ordered by last_message_at DESC."""
    limit = max(1, min(limit, 100))

    stmt = (
        select(ChatRoom)
        .where(ChatRoom.user_id == user.id)
        .order_by(ChatRoom.last_message_at.desc().nullslast(), ChatRoom.id.desc())
        .limit(limit)
    )
    if feature_key:
        stmt = stmt.where(ChatRoom.feature_key == feature_key)
    rooms = list(db.execute(stmt).scalars())

    results: list[tuple[ChatRoom, Optional[str]]] = []
    for room in rooms:
        last_stmt = (
            select(ChatMessage)
            .where(ChatMessage.room_id == room.id)
            .order_by(ChatMessage.id.desc())
            .limit(1)
        )
        last_msg = db.execute(last_stmt).scalar_one_or_none()
        preview: Optional[str] = None
        if last_msg is not None:
            preview = last_msg.content[:120]
        results.append((room, preview))
    return results


def list_messages(
    db: Session,
    *,
    user: User,
    room_id: int,
    limit: int = 50,
    before: Optional[int] = None,
) -> list[ChatMessage]:
    """Return room messages ordered by id ASC."""
    _ensure_room_owner(db, room_id=room_id, user=user)
    limit = max(1, min(limit, 200))

    stmt = select(ChatMessage).where(ChatMessage.room_id == room_id)
    if before is not None:
        stmt = stmt.where(ChatMessage.id < before)
    stmt = stmt.order_by(ChatMessage.id.asc()).limit(limit)
    return list(db.execute(stmt).scalars())


def send_message(
    db: Session,
    *,
    user: User,
    room_id: int,
    content: str,
) -> tuple[ChatMessage, ChatMessage]:
    """Append user message, call Gemini with history, append assistant message."""
    room = _ensure_room_owner(db, room_id=room_id, user=user)

    feature = feature_registry.get_feature(room.feature_key)
    if feature is None:
        # 룸 생성 후 feature_registry 가 바뀐 비정상 상황 — 명확히 500.
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Room references unknown feature_key: {room.feature_key}",
        )

    user_msg = ChatMessage(room_id=room.id, role="user", content=content)
    db.add(user_msg)
    db.flush()
    db.refresh(user_msg)

    # 최근 N개 메시지를 시간 순서대로 (지금 추가한 user 메시지 포함).
    recent_stmt = (
        select(ChatMessage)
        .where(ChatMessage.room_id == room.id)
        .order_by(ChatMessage.id.desc())
        .limit(HISTORY_TURNS)
    )
    recent_desc = list(db.execute(recent_stmt).scalars())
    recent_asc = list(reversed(recent_desc))
    history = [{"role": m.role, "content": m.content} for m in recent_asc]

    try:
        reply_text = gemini_client.generate_bartender_reply(
            history,
            system_instruction=feature["system_prompt"],
        )
    except Exception as exc:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Gemini upstream error: {exc}",
        ) from exc

    if not reply_text:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Empty response from Gemini",
        )

    assistant_msg = ChatMessage(room_id=room.id, role="assistant", content=reply_text)
    db.add(assistant_msg)
    room.last_message_at = _now_utc()
    db.add(room)
    db.commit()
    db.refresh(user_msg)
    db.refresh(assistant_msg)

    return user_msg, assistant_msg
