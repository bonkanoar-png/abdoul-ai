"""Tests for the professional experience entity."""

from datetime import UTC, date, datetime
from uuid import uuid4

import pytest

from app.domain.entities.experience import Experience
from app.domain.exceptions.portfolio import InvalidExperiencePeriod

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


def build_experience(
    *,
    start_date: date = date(2024, 1, 1),
    end_date: date | None = None,
    is_current: bool = True,
) -> Experience:
    return Experience(
        id=uuid4(),
        profile_id=uuid4(),
        company="Abdoul AI",
        role="Backend Engineer",
        description="Build reliable products.",
        start_date=start_date,
        end_date=end_date,
        is_current=is_current,
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
    )


def test_experience_can_be_created_with_valid_period() -> None:
    experience = build_experience(end_date=date(2025, 1, 1), is_current=False)

    assert experience.start_date == date(2024, 1, 1)
    assert experience.end_date == date(2025, 1, 1)


def test_experience_requires_start_date() -> None:
    with pytest.raises(InvalidExperiencePeriod, match="start date"):
        build_experience(start_date=None)  # type: ignore[arg-type]


def test_experience_rejects_end_before_start() -> None:
    with pytest.raises(InvalidExperiencePeriod, match="before"):
        build_experience(end_date=date(2023, 12, 31), is_current=False)


def test_current_experience_rejects_end_date() -> None:
    with pytest.raises(InvalidExperiencePeriod, match="current"):
        build_experience(end_date=date(2025, 1, 1), is_current=True)
