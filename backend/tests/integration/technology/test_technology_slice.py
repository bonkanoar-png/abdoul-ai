"""PostgreSQL and HTTP tests for public technologies."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.api.dependencies.technology import get_technology_service
from app.application.dto.technology import TechnologyDTO
from app.domain.entities.technology import Technology
from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Skill as SkillModel
from app.infrastructure.database.repositories.technology_repository import (
    SQLAlchemyTechnologyRepository,
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


class StubTechnologyService:
    def __init__(self, technologies: tuple[TechnologyDTO, ...]) -> None:
        self.technologies = technologies

    async def get_public_technologies(self) -> tuple[TechnologyDTO, ...]:
        return self.technologies


def build_technology_dto() -> TechnologyDTO:
    return TechnologyDTO(uuid4(), "FastAPI", "Backend", None, 1, NOW, NOW)


def test_technology_repository_maps_and_orders_rows() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            session.add_all(
                [
                    SkillModel(name="Python", category="Backend", sort_order=2),
                    SkillModel(name="FastAPI", category="Backend", sort_order=1),
                ]
            )
            await session.commit()
            session.sync_session.expunge_all()

            result = await SQLAlchemyTechnologyRepository(session).get_technologies()

            assert all(isinstance(item, Technology) for item in result)
            assert [item.name for item in result] == ["FastAPI", "Python"]
            assert all(item.icon_url is None for item in result)

    asyncio.run(scenario())


def test_technologies_endpoint_returns_public_list(api_client, override_dependency) -> None:
    override_dependency(
        get_technology_service,
        StubTechnologyService((build_technology_dto(),)),
    )

    response = api_client.get("/api/v1/technologies")

    assert response.status_code == 200
    assert response.json()[0]["name"] == "FastAPI"
    assert response.json()[0]["icon_url"] is None


def test_technologies_endpoint_returns_empty_list(api_client, override_dependency) -> None:
    override_dependency(get_technology_service, StubTechnologyService(()))

    response = api_client.get("/api/v1/technologies")

    assert response.status_code == 200
    assert response.json() == []
