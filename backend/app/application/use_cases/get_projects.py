"""Use case for obtaining public projects."""

from app.domain.entities.project import Project
from app.domain.repositories.project import ProjectRepository


class GetProjectsUseCase:
    """Retrieve public projects through their repository contract."""

    def __init__(self, repository: ProjectRepository) -> None:
        self._repository = repository

    async def execute(self) -> tuple[Project, ...]:
        """Return public projects with their technologies."""
        return await self._repository.get_projects()
