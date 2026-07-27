"""Composition dependency for the public formation vertical slice."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.formation_service import FormationService
from app.application.use_cases.get_formations import GetFormationsUseCase
from app.infrastructure.database.repositories.formation_repository import (
    SQLAlchemyFormationRepository,
)


def get_formation_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> FormationService:
    repository = SQLAlchemyFormationRepository(session)
    return FormationService(GetFormationsUseCase(repository))
