"""Application DTO for public experiences."""

from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID

from app.domain.entities.experience import Experience


@dataclass(frozen=True, slots=True)
class ExperienceDTO:
    """Framework-independent representation returned by experience services."""

    id: UUID
    profile_id: UUID
    company: str
    role: str
    description: str
    start_date: date
    end_date: date | None
    is_current: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, experience: Experience) -> "ExperienceDTO":
        return cls(
            id=experience.id,
            profile_id=experience.profile_id,
            company=experience.company,
            role=experience.role,
            description=experience.description,
            start_date=experience.start_date,
            end_date=experience.end_date,
            is_current=experience.is_current,
            sort_order=experience.sort_order,
            created_at=experience.created_at,
            updated_at=experience.updated_at,
        )
