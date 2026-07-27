"""PostgreSQL integration tests for the deterministic profile seed."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from uuid import uuid4

import pytest
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.infrastructure.database.base import Base
from app.infrastructure.database.models.profile import Profile
from app.infrastructure.database.repositories.profile_repository import (
    SQLAlchemyProfileRepository,
)
from scripts.seed import PROFILE_ID, seed_profile


@asynccontextmanager
async def isolated_postgres_session() -> AsyncIterator[AsyncSession]:
    database_url = os.getenv("TEST_DATABASE_URL")
    if not database_url:
        pytest.skip("TEST_DATABASE_URL is required for PostgreSQL integration tests.")

    schema = f"test_{uuid4().hex}"
    engine = create_async_engine(
        database_url,
        execution_options={"schema_translate_map": {None: schema}},
    )

    try:
        async with engine.begin() as connection:
            await connection.execute(CreateSchema(schema))
            await connection.run_sync(Base.metadata.create_all)

        session_factory = async_sessionmaker(engine, expire_on_commit=False)
        async with session_factory() as session:
            yield session
    finally:
        async with engine.begin() as connection:
            await connection.execute(DropSchema(schema, cascade=True))
        await engine.dispose()


def test_seed_creates_profile_in_empty_database() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            created = await seed_profile(session)
            profile = await session.get(Profile, PROFILE_ID)

            assert created is True
            assert profile is not None
            assert profile.name == "Abdoul"
            assert profile.title == "AI & Backend Engineer"

    asyncio.run(scenario())


def test_seed_is_idempotent() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            first_result = await seed_profile(session)
            second_result = await seed_profile(session)
            profile_count = await session.scalar(select(func.count()).select_from(Profile))

            assert first_result is True
            assert second_result is False
            assert profile_count == 1

    asyncio.run(scenario())


def test_seeded_profile_is_available_through_repository() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            await seed_profile(session)
            repository = SQLAlchemyProfileRepository(session)

            profile = await repository.get_profile()

            assert profile is not None
            assert profile.id == PROFILE_ID
            assert profile.email == "contact@abdoul-ai.dev"

    asyncio.run(scenario())
