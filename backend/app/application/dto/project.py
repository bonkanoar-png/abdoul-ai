"""Application DTO for public projects."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.application.dto.technology import TechnologyDTO
from app.domain.entities.project import Project


@dataclass(frozen=True, slots=True)
class ProjectDTO:
    """Framework-independent project representation."""

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
    technologies: tuple[TechnologyDTO, ...]

    @classmethod
    def from_entity(cls, project: Project) -> "ProjectDTO":
        return cls(
            id=project.id,
            profile_id=project.profile_id,
            slug=project.slug,
            title=project.title,
            description=project.description,
            content=project.content,
            github_url=project.github_url,
            demo_url=project.demo_url,
            image_url=project.image_url,
            is_featured=project.is_featured,
            sort_order=project.sort_order,
            created_at=project.created_at,
            updated_at=project.updated_at,
            technologies=tuple(
                TechnologyDTO.from_entity(technology) for technology in project.technologies
            ),
        )
