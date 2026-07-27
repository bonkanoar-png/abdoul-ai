"""Repository contract for loading public certifications."""

from typing import Protocol

from app.domain.entities.certification import Certification


class CertificationRepository(Protocol):
    """Persistence-agnostic certification read operations."""

    async def get_certifications(self) -> tuple[Certification, ...]:
        """Return public certifications in display order."""
        ...
