"""Use case for obtaining public skills."""

from app.domain.entities.skill import Skill
from app.domain.repositories.skill import SkillRepository


class GetSkillsUseCase:
    """Retrieve public skills through their repository contract."""

    def __init__(self, repository: SkillRepository) -> None:
        self._repository = repository

    async def execute(self) -> tuple[Skill, ...]:
        """Return public skills in display order."""
        return await self._repository.get_skills()
