"""Composition dependency for the public skill vertical slice."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.skill_service import SkillService
from app.application.use_cases.get_skills import GetSkillsUseCase
from app.infrastructure.database.repositories.skill_repository import SQLAlchemySkillRepository


def get_skill_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> SkillService:
    """Compose the skill service with its SQLAlchemy adapter."""
    repository = SQLAlchemySkillRepository(session)
    return SkillService(GetSkillsUseCase(repository))
