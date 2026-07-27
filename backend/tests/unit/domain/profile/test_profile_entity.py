"""Tests for the public profile domain entity."""

from dataclasses import FrozenInstanceError
from datetime import UTC, datetime
from uuid import UUID, uuid4

import pytest

from app.domain.entities.profile import Profile
from app.domain.exceptions.profile import InvalidProfile

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


def build_profile(**overrides: str) -> Profile:
    values = {
        "name": "Abdoul",
        "title": "Backend Engineer",
        "bio": "I build reliable products.",
        "location": "France",
        "email": "contact@example.com",
    }
    values.update(overrides)
    return Profile(
        id=uuid4(),
        name=values["name"],
        title=values["title"],
        bio=values["bio"],
        location=values["location"],
        email=values["email"],
        github_url="https://github.com/example",
        linkedin_url=None,
        avatar_url=None,
        created_at=NOW,
        updated_at=NOW,
    )


def test_profile_can_be_created_with_public_identity() -> None:
    profile = build_profile()

    assert isinstance(profile.id, UUID)
    assert profile.name == "Abdoul"
    assert profile.email == "contact@example.com"


@pytest.mark.parametrize("field", ["name", "title", "bio", "location", "email"])
def test_profile_rejects_blank_required_fields(field: str) -> None:
    with pytest.raises(InvalidProfile, match=field):
        build_profile(**{field: " "})


def test_profile_is_immutable() -> None:
    profile = build_profile()

    with pytest.raises(FrozenInstanceError):
        profile.name = "Changed"  # type: ignore[misc]
