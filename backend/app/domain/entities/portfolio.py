"""Framework-independent entities for the public portfolio."""

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID

from app.domain.entities.experience import Experience
from app.domain.entities.skill import Skill
from app.domain.exceptions.portfolio import InvalidPortfolio, InvalidProject


@dataclass(frozen=True, slots=True)
class Project:
    """A public project and the skills used to build it."""

    id: UUID
    profile_id: UUID
    slug: str
    title: str
    summary: str
    description: str
    repository_url: str | None
    live_url: str | None
    image_url: str | None
    is_featured: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
    skills: tuple[Skill, ...] = field(default_factory=tuple)

    def __post_init__(self) -> None:
        if not self.slug.strip():
            raise InvalidProject("A project slug is required.")
        if not self.title.strip():
            raise InvalidProject("A project title is required.")


@dataclass(frozen=True, slots=True)
class Portfolio:
    """The aggregate exposed as the public Abdoul AI portfolio."""

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
    experiences: tuple[Experience, ...] = field(default_factory=tuple)
    projects: tuple[Project, ...] = field(default_factory=tuple)
    skills: tuple[Skill, ...] = field(default_factory=tuple)

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
            raise InvalidPortfolio(f"Required portfolio fields cannot be blank: {fields}.")
