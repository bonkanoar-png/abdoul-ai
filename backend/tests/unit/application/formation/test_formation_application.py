"""Tests for formation use case, service, and DTO mapping."""

import asyncio
from datetime import UTC, date, datetime
from uuid import uuid4

from app.application.services.formation_service import FormationService
from app.application.use_cases.get_formations import GetFormationsUseCase
from app.domain.entities.formation import Formation

NOW = datetime(2026, 7, 27, tzinfo=UTC)


class RepositoryStub:
    async def get_formations(self) -> tuple[Formation, ...]:
        return (
            Formation(
                uuid4(),
                uuid4(),
                "University",
                "Master",
                "Computer Science",
                "Advanced studies.",
                date(2024, 9, 1),
                date(2026, 6, 30),
                False,
                0,
                NOW,
                NOW,
            ),
        )


def test_formation_application_flow_maps_dto() -> None:
    use_case = GetFormationsUseCase(RepositoryStub())
    entities = asyncio.run(use_case.execute())
    result = asyncio.run(FormationService(use_case).get_public_formations())

    assert entities[0].institution == "University"
    assert result[0].field_of_study == "Computer Science"
