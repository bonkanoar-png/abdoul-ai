"""Application DTO for public skills."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.entities.skill import Skill


@dataclass(frozen=True, slots=True)
class SkillDTO:
    """Framework-independent representation returned by skill services."""

    id: UUID
    name: str
    category: str
    sort_order: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, skill: Skill) -> "SkillDTO":
        return cls(
            id=skill.id,
            name=skill.name,
            category=skill.category,
            sort_order=skill.sort_order,
            created_at=skill.created_at,
            updated_at=skill.updated_at,
        )
