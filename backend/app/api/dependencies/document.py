"""Composition dependency for the public document vertical slice."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.document_service import DocumentService
from app.application.use_cases.get_documents import GetDocumentsUseCase
from app.infrastructure.database.repositories.document_repository import (
    SQLAlchemyDocumentRepository,
)


def get_document_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> DocumentService:
    repository = SQLAlchemyDocumentRepository(session)
    return DocumentService(GetDocumentsUseCase(repository))
