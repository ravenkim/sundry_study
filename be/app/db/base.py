"""SQLAlchemy 2.x base + engine + session factory.

해커톤 단계라 Alembic 없이 `Base.metadata.create_all` 로 테이블을 생성합니다.
DATABASE_URL 만 바꾸면 추후 PostgreSQL로도 그대로 동작 가능하도록 분기합니다.
"""

from __future__ import annotations

from typing import Iterator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import get_settings


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""


_settings = get_settings()

_engine_kwargs: dict = {}
if _settings.DATABASE_URL.startswith("sqlite"):
    # SQLite + FastAPI(uvicorn) 멀티 스레드 호환
    _engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(_settings.DATABASE_URL, future=True, **_engine_kwargs)


@event.listens_for(engine, "connect")
def _enable_sqlite_foreign_keys(dbapi_connection, _connection_record) -> None:
    """SQLite는 PRAGMA를 켜야 ON DELETE CASCADE 가 동작."""
    if engine.dialect.name == "sqlite":
        cursor = dbapi_connection.cursor()
        cursor.execute("PRAGMA foreign_keys=ON")
        cursor.close()


SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
    class_=Session,
    expire_on_commit=False,
)


def get_db() -> Iterator[Session]:
    """FastAPI dependency: request-scoped DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
