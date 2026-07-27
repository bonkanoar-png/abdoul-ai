"""Tests for experience use case and service."""

import asyncio
from datetime import UTC, date, datetime
from uuid import uuid4

from app.application.services.experience_service import ExperienceService
from app.application.use_cases.get_experiences import GetExperiencesUseCase
from app.domain.entities.experience import Experience

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


def build_experience(sort_order: int = 1) -> Experience:
    return Experience(
        id=uuid4(),
        profile_id=uuid4(),
        company="Abdoul AI",
        role="Backend Engineer",
        description="Build reliable products.",
        start_date=date(2024, 1, 1),
        end_date=None,
        is_current=True,
        sort_order=sort_order,
        created_at=NOW,
        updated_at=NOW,
    )


class FakeExperienceRepository:
    def __init__(self, experiences: tuple[Experience, ...]) -> None:
        self.experiences = experiences
        self.call_count = 0

    async def get_experiences(self) -> tuple[Experience, ...]:
        self.call_count += 1
        return self.experiences


def test_get_experiences_returns_domain_entities() -> None:
    experiences = (build_experience(),)
    repository = FakeExperienceRepository(experiences)

    result = asyncio.run(GetExperiencesUseCase(repository).execute())

    assert result is experiences
    assert repository.call_count == 1


def test_experience_service_transforms_entities_to_dtos() -> None:
    repository = FakeExperienceRepository((build_experience(),))
    service = ExperienceService(GetExperiencesUseCase(repository))

    result = asyncio.run(service.get_public_experiences())

    assert len(result) == 1
    assert result[0].company == "Abdoul AI"
    assert result[0].start_date == date(2024, 1, 1)


def test_experience_service_returns_empty_tuple() -> None:
    service = ExperienceService(GetExperiencesUseCase(FakeExperienceRepository(())))

    assert asyncio.run(service.get_public_experiences()) == ()
