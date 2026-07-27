"""Composition dependency for the public certification vertical slice."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.certification_service import CertificationService
from app.application.use_cases.get_certifications import GetCertificationsUseCase
from app.infrastructure.database.repositories.certification_repository import (
    SQLAlchemyCertificationRepository,
)


def get_certification_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> CertificationService:
    repository = SQLAlchemyCertificationRepository(session)
    return CertificationService(GetCertificationsUseCase(repository))
