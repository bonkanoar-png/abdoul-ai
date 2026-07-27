"""Tests for the technology domain entity."""

from datetime import UTC, datetime
from uuid import uuid4

import pytest

from app.domain.entities.technology import Technology
from app.domain.exceptions.portfolio import InvalidTechnology

NOW = datetime(2026, 7, 27, tzinfo=UTC)


def test_technology_accepts_valid_data() -> None:
    technology = Technology(uuid4(), "FastAPI", "Backend", None, 1, NOW, NOW)

    assert technology.name == "FastAPI"
    assert technology.icon_url is None


def test_technology_requires_name() -> None:
    with pytest.raises(InvalidTechnology):
        Technology(uuid4(), " ", "Backend", None, 1, NOW, NOW)
