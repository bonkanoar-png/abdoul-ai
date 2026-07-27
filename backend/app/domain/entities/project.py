"""Framework-independent public project entity."""

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID

from app.domain.entities.technology import Technology
from app.domain.exceptions.portfolio import InvalidProject


@dataclass(frozen=True, slots=True)
class Project:
    """A public project and its immutable technology collection."""

    id: UUID
    profile_id: UUID
    slug: str
    title: str
    description: str
    content: str
    github_url: str | None
    demo_url: str | None
    image_url: str | None
    is_featured: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
    technologies: tuple[Technology, ...] = field(default_factory=tuple)

    def __post_init__(self) -> None:
        if not self.slug.strip():
            raise InvalidProject("A project slug is required.")
        if not self.title.strip():
            raise InvalidProject("A project title is required.")
        object.__setattr__(self, "technologies", tuple(self.technologies))
