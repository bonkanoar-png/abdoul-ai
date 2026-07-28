"""Repository contract for loading public documents."""

from typing import Protocol

from app.domain.entities.document import Document


class DocumentRepository(Protocol):
    """Persistence-agnostic document read operations."""

    async def get_documents(self) -> tuple[Document, ...]:
        """Return public documents in display order."""
        ...
