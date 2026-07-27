"""Framework-independent professional experience entity."""

from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID

from app.domain.exceptions.portfolio import InvalidExperiencePeriod


@dataclass(frozen=True, slots=True)
class Experience:
    """A professional experience with a coherent period."""

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

    def __post_init__(self) -> None:
        if self.start_date is None:
            raise InvalidExperiencePeriod("A start date is required.")
        if self.end_date is not None and self.end_date < self.start_date:
            raise InvalidExperiencePeriod("The end date cannot be before the start date.")
        if self.is_current and self.end_date is not None:
            raise InvalidExperiencePeriod("A current experience cannot have an end date.")
