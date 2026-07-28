"""Use case for obtaining public documents."""

from app.domain.entities.document import Document
from app.domain.repositories.document import DocumentRepository


class GetDocumentsUseCase:
    """Retrieve public documents through their repository contract."""

    def __init__(self, repository: DocumentRepository) -> None:
        self._repository = repository

    async def execute(self) -> tuple[Document, ...]:
        return await self._repository.get_documents()
