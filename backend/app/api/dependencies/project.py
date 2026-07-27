"""Composition dependency for the public project vertical slice."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.project_service import ProjectService
from app.application.use_cases.get_projects import GetProjectsUseCase
from app.infrastructure.database.repositories.project_repository import (
    SQLAlchemyProjectRepository,
)


def get_project_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> ProjectService:
    """Compose the project service with its SQLAlchemy adapter."""
    repository = SQLAlchemyProjectRepository(session)
    return ProjectService(GetProjectsUseCase(repository))
