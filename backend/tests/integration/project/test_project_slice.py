"""PostgreSQL and HTTP tests for public projects."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.api.dependencies.project import get_project_service
from app.application.dto.project import ProjectDTO
from app.application.dto.technology import TechnologyDTO
from app.domain.entities.project import Project
from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Profile
from app.infrastructure.database.models import Project as ProjectModel
from app.infrastructure.database.models import Skill as SkillModel
from app.infrastructure.database.repositories.project_repository import (
    SQLAlchemyProjectRepository,
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


class StubProjectService:
    def __init__(self, projects: tuple[ProjectDTO, ...]) -> None:
        self.projects = projects

    async def get_public_projects(self) -> tuple[ProjectDTO, ...]:
        return self.projects


def build_project_dto() -> ProjectDTO:
    technology = TechnologyDTO(uuid4(), "Python", "Backend", None, 1, NOW, NOW)
    return ProjectDTO(
        uuid4(),
        uuid4(),
        "abdoul-ai",
        "Abdoul AI",
        "Portfolio platform.",
        "Detailed content.",
        "https://github.com/example/abdoul-ai",
        "https://example.com",
        None,
        True,
        1,
        NOW,
        NOW,
        (technology,),
    )


def test_project_repository_loads_technologies_and_orders_projects() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            profile = Profile(
                name="Abdoul",
                title="Engineer",
                bio="Build products.",
                location="France",
                email="contact@example.com",
            )
            python = SkillModel(name="Python", category="Backend", sort_order=2)
            fastapi = SkillModel(name="FastAPI", category="Backend", sort_order=1)
            second = ProjectModel(
                slug="second",
                title="Second",
                summary="Second summary.",
                description="Second content.",
                sort_order=2,
            )
            first = ProjectModel(
                slug="first",
                title="First",
                summary="First summary.",
                description="First content.",
                sort_order=1,
            )
            first.skills = [python, fastapi]
            profile.projects = [second, first]
            session.add(profile)
            await session.commit()
            session.sync_session.expunge_all()

            result = await SQLAlchemyProjectRepository(session).get_projects()

            assert all(isinstance(item, Project) for item in result)
            assert [item.title for item in result] == ["First", "Second"]
            assert [item.name for item in result[0].technologies] == ["FastAPI", "Python"]

    asyncio.run(scenario())


def test_projects_endpoint_returns_nested_technologies(api_client, override_dependency) -> None:
    override_dependency(get_project_service, StubProjectService((build_project_dto(),)))

    response = api_client.get("/api/v1/projects")

    assert response.status_code == 200
    assert response.json()[0]["title"] == "Abdoul AI"
    assert response.json()[0]["technologies"][0]["name"] == "Python"


def test_projects_endpoint_returns_empty_list(api_client, override_dependency) -> None:
    override_dependency(get_project_service, StubProjectService(()))

    response = api_client.get("/api/v1/projects")

    assert response.status_code == 200
    assert response.json() == []
