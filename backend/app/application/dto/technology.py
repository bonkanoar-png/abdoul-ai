"""Application DTO for public technologies."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.entities.technology import Technology


@dataclass(frozen=True, slots=True)
class TechnologyDTO:
    """Framework-independent technology representation."""

    id: UUID
    name: str
    category: str
    icon_url: str | None
    sort_order: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, technology: Technology) -> "TechnologyDTO":
        return cls(
            id=technology.id,
            name=technology.name,
            category=technology.category,
            icon_url=technology.icon_url,
            sort_order=technology.sort_order,
            created_at=technology.created_at,
            updated_at=technology.updated_at,
        )
