"""Read-only portfolio API endpoint."""

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.dependencies.database import get_db_session
from app.api.schemas.portfolio import PortfolioResponse
from app.infrastructure.database.models import Profile, Project, Skill

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/portfolio", tags=["portfolio"])


@router.get("", response_model=PortfolioResponse)
async def get_portfolio(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> PortfolioResponse:
    """Return the first configured profile and its ordered portfolio data."""
    profile_statement = (
        select(Profile)
        .options(
            selectinload(Profile.experiences),
            selectinload(Profile.projects).selectinload(Project.skills),
        )
        .order_by(Profile.created_at.asc())
        .limit(1)
    )
    skills_statement = select(Skill).order_by(Skill.sort_order.asc(), Skill.name.asc())

    try:
        profile_result = await session.execute(profile_statement)
        profile = profile_result.scalar_one_or_none()

        if profile is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Portfolio not found.",
            )

        skills_result = await session.execute(skills_statement)
        skills = list(skills_result.scalars().all())
    except HTTPException:
        raise
    except SQLAlchemyError as error:
        logger.exception("Unable to load portfolio data.", exc_info=error)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to load portfolio.",
        ) from error

    return PortfolioResponse(
        profile=profile,
        experiences=list(profile.experiences),
        projects=list(profile.projects),
        skills=skills,
    )
