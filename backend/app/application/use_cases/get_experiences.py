"""Use case for obtaining public experiences."""

from app.domain.entities.experience import Experience
from app.domain.repositories.experience import ExperienceRepository


class GetExperiencesUseCase:
    """Retrieve public experiences through their repository contract."""

    def __init__(self, repository: ExperienceRepository) -> None:
        self._repository = repository

    async def execute(self) -> tuple[Experience, ...]:
        """Return public experiences in display order."""
        return await self._repository.get_experiences()
