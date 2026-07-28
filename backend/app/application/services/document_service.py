"""Application service for public document operations."""

from app.application.dto.document import DocumentDTO
from app.application.use_cases.get_documents import GetDocumentsUseCase


class DocumentService:
    """Orchestrate document retrieval and DTO transformation."""

    def __init__(self, get_documents: GetDocumentsUseCase) -> None:
        self._get_documents = get_documents

    async def get_public_documents(self) -> tuple[DocumentDTO, ...]:
        documents = await self._get_documents.execute()
        return tuple(DocumentDTO.from_entity(item) for item in documents)
