"""Framework-independent public skill entity."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.exceptions.portfolio import InvalidSkill


@dataclass(frozen=True, slots=True)
class Skill:
    """A capability displayed in the public portfolio."""

    id: UUID
    name: str
    category: str
    sort_order: int
    created_at: datetime
    updated_at: datetime

    def __post_init__(self) -> None:
        if not self.name.strip():
            raise InvalidSkill("A skill name is required.")
