"""Use case for obtaining public technologies."""

from app.domain.entities.technology import Technology
from app.domain.repositories.technology import TechnologyRepository


class GetTechnologiesUseCase:
    """Retrieve technologies through their repository contract."""

    def __init__(self, repository: TechnologyRepository) -> None:
        self._repository = repository

    async def execute(self) -> tuple[Technology, ...]:
        """Return public technologies in display order."""
        return await self._repository.get_technologies()
