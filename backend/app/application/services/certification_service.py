"""Application service for public certification operations."""

from app.application.dto.certification import CertificationDTO
from app.application.use_cases.get_certifications import GetCertificationsUseCase


class CertificationService:
    """Orchestrate certification retrieval and DTO transformation."""

    def __init__(self, get_certifications: GetCertificationsUseCase) -> None:
        self._get_certifications = get_certifications

    async def get_public_certifications(self) -> tuple[CertificationDTO, ...]:
        certifications = await self._get_certifications.execute()
        return tuple(CertificationDTO.from_entity(item) for item in certifications)
