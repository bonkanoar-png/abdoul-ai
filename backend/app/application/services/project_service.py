"""Application service for public project operations."""

from app.application.dto.project import ProjectDTO
from app.application.use_cases.get_projects import GetProjectsUseCase


class ProjectService:
    """Orchestrate project retrieval and DTO transformation."""

    def __init__(self, get_projects: GetProjectsUseCase) -> None:
        self._get_projects = get_projects

    async def get_public_projects(self) -> tuple[ProjectDTO, ...]:
        """Return public projects as application DTOs."""
        projects = await self._get_projects.execute()
        return tuple(ProjectDTO.from_entity(project) for project in projects)
