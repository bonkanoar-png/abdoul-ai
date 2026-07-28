"""Composition dependency for the public portfolio vertical slice."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.portfolio_service import PortfolioService
from app.application.use_cases.get_portfolio import GetPortfolioUseCase
from app.infrastructure.database.repositories.portfolio_repository import (
    SQLAlchemyPortfolioRepository,
)


def get_portfolio_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> PortfolioService:
    """Compose the portfolio service with its SQLAlchemy adapter."""
    repository = SQLAlchemyPortfolioRepository(session)
    return PortfolioService(GetPortfolioUseCase(repository))
