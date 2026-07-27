"""Composition dependency for the public experience vertical slice."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.experience_service import ExperienceService
from app.application.use_cases.get_experiences import GetExperiencesUseCase
from app.infrastructure.database.repositories.experience_repository import (
    SQLAlchemyExperienceRepository,
)


def get_experience_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> ExperienceService:
    """Compose the experience service with its SQLAlchemy adapter."""
    repository = SQLAlchemyExperienceRepository(session)
    return ExperienceService(GetExperiencesUseCase(repository))
