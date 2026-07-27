"""Tests for project use case, service, and DTO mapping."""

import asyncio
from datetime import UTC, datetime
from uuid import uuid4

from app.application.services.project_service import ProjectService
from app.application.use_cases.get_projects import GetProjectsUseCase
from app.domain.entities.project import Project
from app.domain.entities.technology import Technology

NOW = datetime(2026, 7, 27, tzinfo=UTC)


class ProjectRepositoryStub:
    def __init__(self, projects: tuple[Project, ...]) -> None:
        self.projects = projects

    async def get_projects(self) -> tuple[Project, ...]:
        return self.projects


def build_project() -> Project:
    technology = Technology(uuid4(), "PostgreSQL", "Database", None, 1, NOW, NOW)
    return Project(
        uuid4(),
        uuid4(),
        "platform",
        "Platform",
        "Summary",
        "Content",
        None,
        None,
        None,
        True,
        1,
        NOW,
        NOW,
        (technology,),
    )


def test_project_use_case_returns_domain_entities() -> None:
    project = build_project()
    result = asyncio.run(GetProjectsUseCase(ProjectRepositoryStub((project,))).execute())

    assert result == (project,)


def test_project_service_maps_nested_technology_dto() -> None:
    project = build_project()
    service = ProjectService(GetProjectsUseCase(ProjectRepositoryStub((project,))))

    result = asyncio.run(service.get_public_projects())

    assert result[0].title == "Platform"
    assert result[0].technologies[0].name == "PostgreSQL"
