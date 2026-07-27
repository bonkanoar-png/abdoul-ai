"""Tests for skill use case and service."""

import asyncio
from datetime import UTC, datetime
from uuid import uuid4

from app.application.services.skill_service import SkillService
from app.application.use_cases.get_skills import GetSkillsUseCase
from app.domain.entities.skill import Skill

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


def build_skill(name: str = "Python") -> Skill:
    return Skill(
        id=uuid4(),
        name=name,
        category="Backend",
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
    )


class FakeSkillRepository:
    def __init__(self, skills: tuple[Skill, ...]) -> None:
        self.skills = skills
        self.call_count = 0

    async def get_skills(self) -> tuple[Skill, ...]:
        self.call_count += 1
        return self.skills


def test_get_skills_returns_domain_entities() -> None:
    skills = (build_skill(),)
    repository = FakeSkillRepository(skills)

    result = asyncio.run(GetSkillsUseCase(repository).execute())

    assert result is skills
    assert repository.call_count == 1


def test_skill_service_transforms_entities_to_dtos() -> None:
    repository = FakeSkillRepository((build_skill(),))
    service = SkillService(GetSkillsUseCase(repository))

    result = asyncio.run(service.get_public_skills())

    assert len(result) == 1
    assert result[0].name == "Python"
    assert result[0].category == "Backend"


def test_skill_service_returns_empty_tuple() -> None:
    service = SkillService(GetSkillsUseCase(FakeSkillRepository(())))

    assert asyncio.run(service.get_public_skills()) == ()
