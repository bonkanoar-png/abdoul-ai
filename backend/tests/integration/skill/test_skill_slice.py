"""PostgreSQL and HTTP tests for public skills."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.api.dependencies.skill import get_skill_service
from app.application.dto.skill import SkillDTO
from app.domain.entities.skill import Skill
from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Skill as SkillModel
from app.infrastructure.database.repositories.skill_repository import SQLAlchemySkillRepository

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


class StubSkillService:
    def __init__(self, skills: tuple[SkillDTO, ...]) -> None:
        self.skills = skills

    async def get_public_skills(self) -> tuple[SkillDTO, ...]:
        return self.skills


def build_skill_dto() -> SkillDTO:
    return SkillDTO(
        id=uuid4(),
        name="Python",
        category="Backend",
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
    )


def test_skill_repository_maps_and_orders_rows() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            session.add_all(
                [
                    SkillModel(name="PostgreSQL", category="Database", sort_order=2),
                    SkillModel(name="Python", category="Backend", sort_order=1),
                ]
            )
            await session.commit()
            session.sync_session.expunge_all()

            result = await SQLAlchemySkillRepository(session).get_skills()

            assert all(isinstance(item, Skill) for item in result)
            assert [item.name for item in result] == ["Python", "PostgreSQL"]

    asyncio.run(scenario())


def test_skills_endpoint_returns_public_list(api_client, override_dependency) -> None:
    skill = build_skill_dto()
    override_dependency(get_skill_service, StubSkillService((skill,)))

    response = api_client.get("/api/v1/skills")

    assert response.status_code == 200
    assert response.json()[0]["name"] == "Python"
    assert response.json()[0]["category"] == "Backend"


def test_skills_endpoint_returns_empty_list(api_client, override_dependency) -> None:
    override_dependency(get_skill_service, StubSkillService(()))

    response = api_client.get("/api/v1/skills")

    assert response.status_code == 200
    assert response.json() == []
