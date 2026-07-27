"""Repository contract for loading public skills."""

from typing import Protocol

from app.domain.entities.skill import Skill


class SkillRepository(Protocol):
    """Persistence-agnostic operation required by skill use cases."""

    async def get_skills(self) -> tuple[Skill, ...]:
        """Return public skills in display order."""
        ...
