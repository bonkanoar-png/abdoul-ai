"""Tests for the formation domain entity."""

from datetime import UTC, date, datetime
from uuid import uuid4

import pytest

from app.domain.entities.formation import Formation
from app.domain.exceptions.portfolio import InvalidFormation

NOW = datetime(2026, 7, 27, tzinfo=UTC)


def build_formation(
    *,
    institution: str = "University",
    degree: str = "Master",
    end_date: date | None = date(2026, 6, 30),
    is_current: bool = False,
    sort_order: int = 0,
) -> Formation:
    return Formation(
        uuid4(),
        uuid4(),
        institution,
        degree,
        "Computer Science",
        "Advanced studies.",
        date(2024, 9, 1),
        end_date,
        is_current,
        sort_order,
        NOW,
        NOW,
    )


def test_formation_accepts_valid_data() -> None:
    assert build_formation().degree == "Master"


def test_formation_requires_institution() -> None:
    with pytest.raises(InvalidFormation):
        build_formation(institution=" ")


def test_formation_requires_degree() -> None:
    with pytest.raises(InvalidFormation):
        build_formation(degree="")


def test_formation_rejects_end_before_start() -> None:
    with pytest.raises(InvalidFormation):
        build_formation(end_date=date(2024, 8, 31))


def test_current_formation_cannot_have_end_date() -> None:
    with pytest.raises(InvalidFormation):
        build_formation(is_current=True)
