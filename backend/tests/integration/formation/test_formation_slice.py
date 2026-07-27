"""PostgreSQL and HTTP tests for public formations."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, date, datetime
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.api.dependencies.formation import get_formation_service
from app.application.dto.formation import FormationDTO
from app.domain.entities.formation import Formation
from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Formation as FormationModel
from app.infrastructure.database.models import Profile
from app.infrastructure.database.repositories.formation_repository import (
    SQLAlchemyFormationRepository,
)

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


@asynccontextmanager
async def isolated_postgres_session() -> AsyncIterator[AsyncSession]:
    database_url = os.getenv("TEST_DATABASE_URL")
    if not database_url:
        pytest.skip("TEST_DATABASE_URL is required for PostgreSQL integration tests.")
    schema = f"test_{uuid4().hex}"
    engine = create_async_engine(
        database_url, execution_options={"schema_translate_map": {None: schema}}
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


class StubService:
    def __init__(self, items: tuple[FormationDTO, ...]) -> None:
        self.items = items

    async def get_public_formations(self) -> tuple[FormationDTO, ...]:
        return self.items


def build_dto() -> FormationDTO:
    return FormationDTO(
        uuid4(),
        uuid4(),
        "University",
        "Master",
        "Computer Science",
        "Advanced studies.",
        date(2024, 9, 1),
        date(2026, 6, 30),
        False,
        1,
        NOW,
        NOW,
    )


def test_repository_maps_and_orders_formations() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            profile = Profile(
                name="Abdoul",
                title="Engineer",
                bio="Build products.",
                location="France",
                email="contact@example.com",
            )
            session.add(profile)
            await session.flush()
            session.add_all(
                [
                    FormationModel(
                        profile_id=profile.id,
                        institution="Second",
                        degree="Degree",
                        description="Studies.",
                        start_date=date(2020, 1, 1),
                        sort_order=2,
                    ),
                    FormationModel(
                        profile_id=profile.id,
                        institution="First",
                        degree="Degree",
                        description="Studies.",
                        start_date=date(2022, 1, 1),
                        sort_order=1,
                    ),
                ]
            )
            await session.commit()
            session.sync_session.expunge_all()

            result = await SQLAlchemyFormationRepository(session).get_formations()

            assert all(isinstance(item, Formation) for item in result)
            assert [item.institution for item in result] == ["First", "Second"]

    asyncio.run(scenario())


def test_endpoint_returns_formations(api_client, override_dependency) -> None:
    override_dependency(get_formation_service, StubService((build_dto(),)))
    response = api_client.get("/api/v1/formations")

    assert response.status_code == 200
    assert response.json()[0]["institution"] == "University"


def test_endpoint_returns_empty_list(api_client, override_dependency) -> None:
    override_dependency(get_formation_service, StubService(()))
    response = api_client.get("/api/v1/formations")

    assert response.status_code == 200
    assert response.json() == []
