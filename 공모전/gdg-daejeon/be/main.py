"""FastAPI entry point for BAR 준 backend.

Run locally:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db.init_db import init_db
from app.routers import auth as auth_router
from app.routers import chat as chat_router
from app.routers import chat_rooms as chat_rooms_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 부팅 시 누락 테이블 자동 생성 (해커톤 단계, Alembic 미사용)
    init_db()
    yield


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="BAR 준 — Backend",
        description="1인가구를 위한 AI 바텐더 동반자 앱",
        version="0.2.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["meta"])
    def health() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(auth_router.router)
    app.include_router(chat_rooms_router.router)
    app.include_router(chat_router.router)

    return app


app = create_app()
