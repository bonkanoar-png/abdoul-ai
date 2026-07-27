"""Framework-independent certification entity."""

from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID

from app.domain.exceptions.portfolio import InvalidCertification


@dataclass(frozen=True, slots=True)
class Certification:
    """Professional certification with a coherent validity period."""

    id: UUID
    name: str
    issuer: str
    credential_url: str | None
    issued_at: date
    expiration_date: date | None
    sort_order: int
    created_at: datetime
    updated_at: datetime

    def __post_init__(self) -> None:
        if not self.name.strip():
            raise InvalidCertification("A certification name is required.")
        if not self.issuer.strip():
            raise InvalidCertification("A certification issuer is required.")
        if self.expiration_date is not None and self.expiration_date < self.issued_at:
            raise InvalidCertification("Certification expiration cannot precede its issue date.")
        if self.sort_order < 0:
            raise InvalidCertification("Certification sort order cannot be negative.")
