"""Repository contract for loading public projects."""

from typing import Protocol

from app.domain.entities.project import Project


class ProjectRepository(Protocol):
    """Persistence-agnostic project read operations."""

    async def get_projects(self) -> tuple[Project, ...]:
        """Return projects with their technologies in display order."""
        ...
