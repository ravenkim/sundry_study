"""Create tables for all imported models.

Alembic을 도입하기 전, 부팅 시 누락 테이블을 만들기 위한 단순 스크립트.
새 모델을 추가하면 본 모듈에서 import 해서 `Base.metadata` 가 알도록 한다.
"""

from __future__ import annotations

from app.db.base import Base, engine

# 모델을 임포트해야 Base.metadata 가 인식한다.
from app.models import chat as _chat  # noqa: F401
from app.models import user as _user  # noqa: F401


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
