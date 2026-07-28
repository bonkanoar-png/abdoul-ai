"""Unit tests for the SQLAlchemy database foundation."""

import asyncio

from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession

from app.core.config import Settings
from app.infrastructure.database import models
from app.infrastructure.database.base import Base
from app.infrastructure.database.engine import engine
from app.infrastructure.database.session import async_session_factory


def test_settings_accepts_async_database_url() -> None:
    settings = Settings(
        database_url="postgresql+asyncpg://user:password@localhost:5432/test_database"
    )

    assert settings.database_url.startswith("postgresql+asyncpg://")


def test_engine_is_created_with_asyncpg_driver() -> None:
    assert isinstance(engine, AsyncEngine)
    assert engine.url.drivername == "postgresql+asyncpg"


def test_declarative_base_contains_portfolio_models() -> None:
    assert set(Base.metadata.tables) == {
        "certifications",
        "documents",
        "experiences",
        "formations",
        "profiles",
        "project_skills",
        "projects",
        "publications",
        "skills",
    }


def test_session_factory_yields_async_session() -> None:
    async def create_session() -> None:
        async with async_session_factory() as session:
            assert isinstance(session, AsyncSession)

    asyncio.run(create_session())
