"""Read-only portfolio API endpoint."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies.portfolio import get_portfolio_service
from app.api.schemas.portfolio import PortfolioResponse, ProfileSchema
from app.application.services.portfolio_service import PortfolioService

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.get("", response_model=PortfolioResponse)
async def get_portfolio(
    service: Annotated[PortfolioService, Depends(get_portfolio_service)],
) -> PortfolioResponse:
    """Return the first configured profile and its ordered portfolio data."""
    try:
        portfolio = await service.get_public_portfolio()
    except Exception as error:
        logger.exception("Unable to load portfolio data.", exc_info=error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load portfolio.",
        ) from error

    if portfolio is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found.",
        )

    return PortfolioResponse(
        profile=ProfileSchema.model_validate(portfolio),
        experiences=list(portfolio.experiences),
        projects=list(portfolio.projects),
        skills=list(portfolio.skills),
    )
