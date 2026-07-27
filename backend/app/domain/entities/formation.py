"""Framework-independent formation entity."""

from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID

from app.domain.exceptions.portfolio import InvalidFormation


@dataclass(frozen=True, slots=True)
class Formation:
    """Educational formation with a coherent attendance period."""

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

    def __post_init__(self) -> None:
        if not self.institution.strip():
            raise InvalidFormation("A formation institution is required.")
        if not self.degree.strip():
            raise InvalidFormation("A formation degree is required.")
        if self.end_date is not None and self.end_date < self.start_date:
            raise InvalidFormation("Formation end date cannot precede its start date.")
        if self.is_current and self.end_date is not None:
            raise InvalidFormation("A current formation cannot have an end date.")
        if self.sort_order < 0:
            raise InvalidFormation("Formation sort order cannot be negative.")
