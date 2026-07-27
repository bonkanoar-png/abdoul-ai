"""Tests for the public profile use case and service."""

import asyncio
from datetime import UTC, datetime
from uuid import uuid4

from app.application.services.profile_service import ProfileService
from app.application.use_cases.get_profile import GetProfileUseCase
from app.domain.entities.profile import Profile

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


def build_profile() -> Profile:
    return Profile(
        id=uuid4(),
        name="Abdoul",
        title="Backend Engineer",
        bio="I build reliable products.",
        location="France",
        email="contact@example.com",
        github_url=None,
        linkedin_url=None,
        avatar_url=None,
        created_at=NOW,
        updated_at=NOW,
    )


class FakeProfileRepository:
    def __init__(self, profile: Profile | None) -> None:
        self.profile = profile
        self.call_count = 0

    async def get_profile(self) -> Profile | None:
        self.call_count += 1
        return self.profile


def test_get_profile_use_case_returns_domain_profile() -> None:
    profile = build_profile()
    repository = FakeProfileRepository(profile)

    result = asyncio.run(GetProfileUseCase(repository).execute())

    assert result is profile
    assert repository.call_count == 1


def test_get_profile_use_case_returns_none_when_absent() -> None:
    repository = FakeProfileRepository(None)

    result = asyncio.run(GetProfileUseCase(repository).execute())

    assert result is None
    assert repository.call_count == 1


def test_profile_service_transforms_entity_to_dto() -> None:
    profile = build_profile()
    repository = FakeProfileRepository(profile)
    service = ProfileService(GetProfileUseCase(repository))

    result = asyncio.run(service.get_public_profile())

    assert result is not None
    assert result.id == profile.id
    assert result.name == "Abdoul"
    assert result.created_at == NOW


def test_profile_service_propagates_absence() -> None:
    repository = FakeProfileRepository(None)
    service = ProfileService(GetProfileUseCase(repository))

    assert asyncio.run(service.get_public_profile()) is None
