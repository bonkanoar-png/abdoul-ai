"""Tests for technology use case, service, and DTO mapping."""

import asyncio
from datetime import UTC, datetime
from uuid import uuid4

from app.application.services.technology_service import TechnologyService
from app.application.use_cases.get_technologies import GetTechnologiesUseCase
from app.domain.entities.technology import Technology

NOW = datetime(2026, 7, 27, tzinfo=UTC)


class TechnologyRepositoryStub:
    def __init__(self, technologies: tuple[Technology, ...]) -> None:
        self.technologies = technologies

    async def get_technologies(self) -> tuple[Technology, ...]:
        return self.technologies


def test_technology_application_flow_maps_dto() -> None:
    technology = Technology(uuid4(), "Docker", "Platform", None, 1, NOW, NOW)
    use_case = GetTechnologiesUseCase(TechnologyRepositoryStub((technology,)))

    entities = asyncio.run(use_case.execute())
    result = asyncio.run(TechnologyService(use_case).get_public_technologies())

    assert entities == (technology,)
    assert result[0].name == "Docker"
    assert result[0].icon_url is None
