"""FastAPI dependencies (auth / db).

본 단계에서 채팅은 **인증을 강제하지 않습니다**.
- 토큰이 있으면 검증해서 그 사용자로 동작.
- 토큰이 없으면 로컬 demo user 로 fallback (DB에 없으면 생성).

JWT 강제로 전환할 때:
- routers/chat_rooms.py 등에서 `Depends(get_active_user)` → `Depends(get_current_user)` 로 교체.
"""

from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.base import get_db
from app.models.user import User

DEMO_EMAIL = "demo@local.bartender"
DEMO_NICKNAME = "단골손님"
# 사용 불가능한 더미 해시 — bcrypt.checkpw 가 False/예외를 내므로 로그인 차단됨.
DEMO_DISABLED_PASSWORD_HASH = "!disabled"

bearer_scheme = HTTPBearer(auto_error=False, bearerFormat="JWT")


def _unauthorized(detail: str = "Not authenticated") -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Strict JWT auth. 토큰 없거나 잘못되면 401."""
    if credentials is None or not credentials.credentials:
        raise _unauthorized("Missing authorization header")

    try:
        payload = decode_access_token(credentials.credentials)
    except JWTError:
        raise _unauthorized("Invalid or expired token")

    sub = payload.get("sub")
    if not sub:
        raise _unauthorized("Invalid token payload")

    try:
        user_id = int(sub)
    except (TypeError, ValueError):
        raise _unauthorized("Invalid token payload")

    user = db.get(User, user_id)
    if user is None:
        raise _unauthorized("User not found")
    return user


def get_or_create_demo_user(db: Session) -> User:
    """로그인 없이 사용할 수 있도록 단일 demo user 를 lazy 생성."""
    from sqlalchemy import select

    stmt = select(User).where(User.email == DEMO_EMAIL)
    user = db.execute(stmt).scalar_one_or_none()
    if user is not None:
        return user

    user = User(
        email=DEMO_EMAIL,
        password_hash=DEMO_DISABLED_PASSWORD_HASH,
        nickname=DEMO_NICKNAME,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_active_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Lenient auth: 토큰 있으면 검증, 없으면 demo user.

    - 토큰이 있는데 검증 실패면 401 (잘못된 토큰을 silently demo로 떨어뜨리지 않음).
    - 토큰이 없으면 demo user 반환 (해커톤 단계).
    """
    if credentials is not None and credentials.credentials:
        return get_current_user(credentials=credentials, db=db)
    return get_or_create_demo_user(db)
