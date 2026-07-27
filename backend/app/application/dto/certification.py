"""Application DTO for public certifications."""

from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID

from app.domain.entities.certification import Certification


@dataclass(frozen=True, slots=True)
class CertificationDTO:
    """Framework-independent certification representation."""

    id: UUID
    name: str
    issuer: str
    credential_url: str | None
    issued_at: date
    expiration_date: date | None
    sort_order: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, certification: Certification) -> "CertificationDTO":
        return cls(
            id=certification.id,
            name=certification.name,
            issuer=certification.issuer,
            credential_url=certification.credential_url,
            issued_at=certification.issued_at,
            expiration_date=certification.expiration_date,
            sort_order=certification.sort_order,
            created_at=certification.created_at,
            updated_at=certification.updated_at,
        )
