"""Application service for public skill operations."""

from app.application.dto.skill import SkillDTO
from app.application.use_cases.get_skills import GetSkillsUseCase


class SkillService:
    """Orchestrate skill retrieval and DTO transformation."""

    def __init__(self, get_skills: GetSkillsUseCase) -> None:
        self._get_skills = get_skills

    async def get_public_skills(self) -> tuple[SkillDTO, ...]:
        """Return public skills as application DTOs."""
        skills = await self._get_skills.execute()
        return tuple(SkillDTO.from_entity(skill) for skill in skills)
