"""Application DTO for the public profile."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.entities.profile import Profile


@dataclass(frozen=True, slots=True)
class ProfileDTO:
    """Framework-independent representation returned by profile services."""

    id: UUID
    name: str
    title: str
    bio: str
    location: str
    email: str
    github_url: str | None
    linkedin_url: str | None
    avatar_url: str | None
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, profile: Profile) -> "ProfileDTO":
        return cls(
            id=profile.id,
            name=profile.name,
            title=profile.title,
            bio=profile.bio,
            location=profile.location,
            email=profile.email,
            github_url=profile.github_url,
            linkedin_url=profile.linkedin_url,
            avatar_url=profile.avatar_url,
            created_at=profile.created_at,
            updated_at=profile.updated_at,
        )
