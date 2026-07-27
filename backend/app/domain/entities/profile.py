"""Framework-independent public profile entity."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.exceptions.profile import InvalidProfile


@dataclass(frozen=True, slots=True)
class Profile:
    """The public identity at the root of a portfolio."""

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

    def __post_init__(self) -> None:
        required_fields = {
            "name": self.name,
            "title": self.title,
            "bio": self.bio,
            "location": self.location,
            "email": self.email,
        }
        missing_fields = [name for name, value in required_fields.items() if not value.strip()]
        if missing_fields:
            fields = ", ".join(missing_fields)
            raise InvalidProfile(f"Required profile fields cannot be blank: {fields}.")
