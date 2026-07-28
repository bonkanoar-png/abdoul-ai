"""Tests for document use case, service, and DTO mapping."""

import asyncio
from datetime import UTC, datetime
from uuid import uuid4

from app.application.services.document_service import DocumentService
from app.application.use_cases.get_documents import GetDocumentsUseCase
from app.domain.entities.document import Document, DocumentType

NOW = datetime(2026, 7, 28, tzinfo=UTC)


class RepositoryStub:
    async def get_documents(self) -> tuple[Document, ...]:
        return (
            Document(
                uuid4(),
                uuid4(),
                "CV",
                "Public CV.",
                DocumentType.CV,
                "cv.pdf",
                "https://example.com/cv.pdf",
                "application/pdf",
                1024,
                True,
                0,
                NOW,
                NOW,
            ),
        )


def test_document_application_flow_maps_dto() -> None:
    use_case = GetDocumentsUseCase(RepositoryStub())
    entities = asyncio.run(use_case.execute())
    result = asyncio.run(DocumentService(use_case).get_public_documents())

    assert entities[0].title == "CV"
    assert result[0].file_name == "cv.pdf"
