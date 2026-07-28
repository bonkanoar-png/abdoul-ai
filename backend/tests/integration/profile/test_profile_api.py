"""HTTP integration tests for the public profile endpoint."""

from datetime import UTC, datetime
from uuid import uuid4

from app.api.dependencies.profile import get_profile_service
from app.application.dto.profile import ProfileDTO

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


class StubProfileService:
    def __init__(self, profile: ProfileDTO | None) -> None:
        self.profile = profile

    async def get_public_profile(self) -> ProfileDTO | None:
        return self.profile


def build_profile_dto() -> ProfileDTO:
    return ProfileDTO(
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


def test_get_profile_returns_public_profile(api_client, override_dependency) -> None:
    profile = build_profile_dto()
    override_dependency(get_profile_service, StubProfileService(profile))

    response = api_client.get("/api/v1/profile")

    assert response.status_code == 200
    assert response.json() == {
        "id": str(profile.id),
        "name": "Abdoul",
        "title": "Backend Engineer",
        "bio": "I build reliable products.",
        "location": "France",
        "email": "contact@example.com",
        "github_url": None,
        "linkedin_url": None,
        "avatar_url": None,
        "created_at": NOW.isoformat().replace("+00:00", "Z"),
        "updated_at": NOW.isoformat().replace("+00:00", "Z"),
    }


def test_get_profile_returns_404_when_absent(api_client, override_dependency) -> None:
    override_dependency(get_profile_service, StubProfileService(None))

    response = api_client.get("/api/v1/profile")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "RESOURCE_NOT_FOUND",
            "message": "Profile not found.",
            "details": None,
        }
    }
