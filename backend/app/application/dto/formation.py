"""Application DTO for public formations."""

from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID

from app.domain.entities.formation import Formation


@dataclass(frozen=True, slots=True)
class FormationDTO:
    """Framework-independent formation representation."""

    id: UUID
    profile_id: UUID
    institution: str
    degree: str
    field_of_study: str | None
    description: str
    start_date: date
    end_date: date | None
    is_current: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, formation: Formation) -> "FormationDTO":
        return cls(
            id=formation.id,
            profile_id=formation.profile_id,
            institution=formation.institution,
            degree=formation.degree,
            field_of_study=formation.field_of_study,
            description=formation.description,
            start_date=formation.start_date,
            end_date=formation.end_date,
            is_current=formation.is_current,
            sort_order=formation.sort_order,
            created_at=formation.created_at,
            updated_at=formation.updated_at,
        )
