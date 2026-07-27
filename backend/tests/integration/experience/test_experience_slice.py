"""PostgreSQL and HTTP tests for public experiences."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, date, datetime
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.api.dependencies.experience import get_experience_service
from app.application.dto.experience import ExperienceDTO
from app.domain.entities.experience import Experience
from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Experience as ExperienceModel
from app.infrastructure.database.models import Profile
from app.infrastructure.database.repositories.experience_repository import (
    SQLAlchemyExperienceRepository,
)

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


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


class StubExperienceService:
    def __init__(self, experiences: tuple[ExperienceDTO, ...]) -> None:
        self.experiences = experiences

    async def get_public_experiences(self) -> tuple[ExperienceDTO, ...]:
        return self.experiences


def build_experience_dto() -> ExperienceDTO:
    return ExperienceDTO(
        id=uuid4(),
        profile_id=uuid4(),
        company="Abdoul AI",
        role="Backend Engineer",
        description="Build reliable products.",
        start_date=date(2024, 1, 1),
        end_date=None,
        is_current=True,
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
    )


def test_experience_repository_maps_and_orders_rows() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            profile = Profile(
                name="Abdoul",
                title="Engineer",
                bio="Build products.",
                location="France",
                email="contact@example.com",
            )
            profile.experiences = [
                ExperienceModel(
                    company="Second",
                    role="Engineer",
                    description="Second.",
                    start_date=date(2023, 1, 1),
                    is_current=False,
                    sort_order=2,
                ),
                ExperienceModel(
                    company="First",
                    role="Engineer",
                    description="First.",
                    start_date=date(2024, 1, 1),
                    is_current=True,
                    sort_order=1,
                ),
            ]
            session.add(profile)
            await session.commit()
            session.sync_session.expunge_all()

            result = await SQLAlchemyExperienceRepository(session).get_experiences()

            assert all(isinstance(item, Experience) for item in result)
            assert [item.company for item in result] == ["First", "Second"]

    asyncio.run(scenario())


def test_experiences_endpoint_returns_public_list(api_client, override_dependency) -> None:
    experience = build_experience_dto()
    override_dependency(get_experience_service, StubExperienceService((experience,)))

    response = api_client.get("/api/v1/experiences")

    assert response.status_code == 200
    assert response.json()[0]["company"] == "Abdoul AI"
    assert response.json()[0]["start_date"] == "2024-01-01"


def test_experiences_endpoint_returns_empty_list(api_client, override_dependency) -> None:
    override_dependency(get_experience_service, StubExperienceService(()))

    response = api_client.get("/api/v1/experiences")

    assert response.status_code == 200
    assert response.json() == []
