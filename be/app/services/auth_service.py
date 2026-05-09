"""Business logic for user signup / authentication."""

from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models.user import User


def normalize_email(email: str) -> str:
    return email.strip().lower()


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    stmt = select(User).where(User.email == normalize_email(email))
    return db.execute(stmt).scalar_one_or_none()


def create_user(
    db: Session,
    *,
    email: str,
    password: str,
    nickname: Optional[str],
) -> User:
    normalized = normalize_email(email)
    final_nickname = (nickname or "").strip() or normalized.split("@", 1)[0]
    user = User(
        email=normalized,
        password_hash=hash_password(password),
        nickname=final_nickname,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate(db: Session, *, email: str, password: str) -> Optional[User]:
    user = get_user_by_email(db, email)
    if user is None:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user
