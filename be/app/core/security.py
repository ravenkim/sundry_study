"""Password hashing and JWT helpers.

- 패스워드: bcrypt 직접 사용 (passlib 의존 X — bcrypt 4.x 호환 이슈 회피)
- JWT: python-jose
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone

import bcrypt
from jose import jwt

from app.core.config import get_settings


def hash_password(password: str) -> str:
    """Return a bcrypt hash for the given plain password."""
    salt = bcrypt.gensalt()
    digest = bcrypt.hashpw(password.encode("utf-8"), salt)
    return digest.decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except ValueError:
        # 잘못된 해시 형식 등
        return False


def create_access_token(*, subject: str | int, expires_hours: int | None = None) -> str:
    settings = get_settings()
    expires_delta = timedelta(
        hours=expires_hours if expires_hours is not None else settings.JWT_EXPIRES_HOURS
    )
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(subject),
        "iat": int(now.timestamp()),
        "exp": int((now + expires_delta).timestamp()),
    }
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)


def decode_access_token(token: str) -> dict:
    settings = get_settings()
    return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
