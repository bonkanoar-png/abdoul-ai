"""Framework-independent entities for the public portfolio."""

from dataclasses import dataclass, field
from datetime import date, datetime
from uuid import UUID

from app.domain.exceptions.portfolio import (
    InvalidExperiencePeriod,
    InvalidPortfolio,
    InvalidProject,
    InvalidSkill,
)


@dataclass(frozen=True, slots=True)
class Skill:
    """A capability displayed in the public portfolio."""

    id: UUID
    name: str
    category: str
    sort_order: int
    created_at: datetime
    updated_at: datetime

    def __post_init__(self) -> None:
        if not self.name.strip():
            raise InvalidSkill("A skill name is required.")


@dataclass(frozen=True, slots=True)
class Experience:
    """A professional experience with a coherent period."""

    id: UUID
    profile_id: UUID
    company: str
    role: str
    description: str
    start_date: date
    end_date: date | None
    is_current: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    def __post_init__(self) -> None:
        if self.end_date is not None and self.end_date < self.start_date:
            raise InvalidExperiencePeriod("The end date cannot be before the start date.")
        if self.is_current and self.end_date is not None:
            raise InvalidExperiencePeriod("A current experience cannot have an end date.")


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
