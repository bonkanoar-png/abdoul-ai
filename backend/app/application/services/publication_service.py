"""Application service for public publication operations."""

from app.application.dto.publication import PublicationDTO
from app.application.use_cases.get_publications import GetPublicationsUseCase


class PublicationService:
    """Orchestrate publication retrieval and DTO transformation."""

    def __init__(self, get_publications: GetPublicationsUseCase) -> None:
        self._get_publications = get_publications

    async def get_public_publications(self) -> tuple[PublicationDTO, ...]:
        publications = await self._get_publications.execute()
        return tuple(PublicationDTO.from_entity(item) for item in publications)
