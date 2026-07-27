"""Use case for obtaining public certifications."""

from app.domain.entities.certification import Certification
from app.domain.repositories.certification import CertificationRepository


class GetCertificationsUseCase:
    """Retrieve certifications through their repository contract."""

    def __init__(self, repository: CertificationRepository) -> None:
        self._repository = repository

    async def execute(self) -> tuple[Certification, ...]:
        return await self._repository.get_certifications()
