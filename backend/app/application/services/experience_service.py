"""Application service for public experience operations."""

from app.application.dto.experience import ExperienceDTO
from app.application.use_cases.get_experiences import GetExperiencesUseCase


class ExperienceService:
    """Orchestrate experience retrieval and DTO transformation."""

    def __init__(self, get_experiences: GetExperiencesUseCase) -> None:
        self._get_experiences = get_experiences

    async def get_public_experiences(self) -> tuple[ExperienceDTO, ...]:
        """Return public experiences as application DTOs."""
        experiences = await self._get_experiences.execute()
        return tuple(ExperienceDTO.from_entity(experience) for experience in experiences)
