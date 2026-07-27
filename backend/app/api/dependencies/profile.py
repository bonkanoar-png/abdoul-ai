"""Composition dependency for the public profile vertical slice."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.profile_service import ProfileService
from app.application.use_cases.get_profile import GetProfileUseCase
from app.infrastructure.database.repositories.profile_repository import (
    SQLAlchemyProfileRepository,
)


def get_profile_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> ProfileService:
    """Compose the profile application service with its SQLAlchemy adapter."""
    repository = SQLAlchemyProfileRepository(session)
    return ProfileService(GetProfileUseCase(repository))
