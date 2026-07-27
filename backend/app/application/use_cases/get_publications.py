"""Use case for obtaining public publications."""

from app.domain.entities.publication import Publication
from app.domain.repositories.publication import PublicationRepository


class GetPublicationsUseCase:
    """Retrieve publications through their repository contract."""

    def __init__(self, repository: PublicationRepository) -> None:
        self._repository = repository

    async def execute(self) -> tuple[Publication, ...]:
        return await self._repository.get_publications()
