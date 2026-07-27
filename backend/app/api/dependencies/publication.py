"""Composition dependency for the public publication vertical slice."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.publication_service import PublicationService
from app.application.use_cases.get_publications import GetPublicationsUseCase
from app.infrastructure.database.repositories.publication_repository import (
    SQLAlchemyPublicationRepository,
)


def get_publication_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> PublicationService:
    repository = SQLAlchemyPublicationRepository(session)
    return PublicationService(GetPublicationsUseCase(repository))
