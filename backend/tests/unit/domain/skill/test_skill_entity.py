"""Tests for the public skill entity."""

from datetime import UTC, datetime
from uuid import uuid4

import pytest

from app.domain.entities.skill import Skill
from app.domain.exceptions.portfolio import InvalidSkill

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


def test_skill_can_be_created() -> None:
    skill = build_skill()

    assert skill.name == "Python"
    assert skill.category == "Backend"


def test_skill_requires_name() -> None:
    with pytest.raises(InvalidSkill):
        build_skill(" ")
