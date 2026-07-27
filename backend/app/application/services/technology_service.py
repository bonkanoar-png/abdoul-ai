"""Application service for public technology operations."""

from app.application.dto.technology import TechnologyDTO
from app.application.use_cases.get_technologies import GetTechnologiesUseCase


class TechnologyService:
    """Orchestrate technology retrieval and DTO transformation."""

    def __init__(self, get_technologies: GetTechnologiesUseCase) -> None:
        self._get_technologies = get_technologies

    async def get_public_technologies(self) -> tuple[TechnologyDTO, ...]:
        """Return public technologies as application DTOs."""
        technologies = await self._get_technologies.execute()
        return tuple(TechnologyDTO.from_entity(item) for item in technologies)
