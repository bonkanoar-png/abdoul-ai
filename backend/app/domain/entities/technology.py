"""Framework-independent technology entity."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.exceptions.portfolio import InvalidTechnology


@dataclass(frozen=True, slots=True)
class Technology:
    """A concrete technology used to build public projects."""

    id: UUID
    name: str
    category: str
    icon_url: str | None
    sort_order: int
    created_at: datetime
    updated_at: datetime

    def __post_init__(self) -> None:
        if not self.name.strip():
            raise InvalidTechnology("A technology name is required.")
