"""PostgreSQL integration tests for the profile repository."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.domain.entities.profile import Profile
from app.infrastructure.database.base import Base
from app.infrastructure.database.models.profile import Profile as ProfileModel
from app.infrastructure.database.repositories.profile_repository import (
    SQLAlchemyProfileRepository,
)


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


def test_profile_repository_returns_none_when_absent() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            repository = SQLAlchemyProfileRepository(session)

            assert await repository.get_profile() is None

    asyncio.run(scenario())


def test_profile_repository_maps_orm_to_domain() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            model = ProfileModel(
                name="Abdoul",
                title="Backend Engineer",
                bio="I build reliable products.",
                location="France",
                email="contact@example.com",
                github_url="https://github.com/example",
            )
            session.add(model)
            await session.commit()
            session.sync_session.expunge_all()
            repository = SQLAlchemyProfileRepository(session)

            profile = await repository.get_profile()

            assert isinstance(profile, Profile)
            assert profile.name == "Abdoul"
            assert profile.github_url == "https://github.com/example"
            assert profile.created_at is not None

    asyncio.run(scenario())
