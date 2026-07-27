"""Composition dependency for the public technology vertical slice."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.technology_service import TechnologyService
from app.application.use_cases.get_technologies import GetTechnologiesUseCase
from app.infrastructure.database.repositories.technology_repository import (
    SQLAlchemyTechnologyRepository,
)


def get_technology_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> TechnologyService:
    """Compose the technology service with its SQLAlchemy adapter."""
    repository = SQLAlchemyTechnologyRepository(session)
    return TechnologyService(GetTechnologiesUseCase(repository))
