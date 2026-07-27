"""SQLAlchemy repository for the public portfolio."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.entities.portfolio import Portfolio
from app.domain.repositories.portfolio import PortfolioRepository
from app.infrastructure.database.mappers.portfolio_mapper import PortfolioMapper
from app.infrastructure.database.models import Profile, Project, Skill


class SQLAlchemyPortfolioRepository(PortfolioRepository):
    """Load the public portfolio through SQLAlchemy 2.x async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_portfolio(self) -> Portfolio | None:
        profile_statement = (
            select(Profile)
            .options(
                selectinload(Profile.experiences),
                selectinload(Profile.projects).selectinload(Project.skills),
            )
            .order_by(Profile.created_at.asc())
            .limit(1)
        )
        profile_result = await self._session.execute(profile_statement)
        profile = profile_result.scalar_one_or_none()
        if profile is None:
            return None

        skills_statement = select(Skill).order_by(Skill.sort_order.asc(), Skill.name.asc())
        skills_result = await self._session.execute(skills_statement)
        skills = list(skills_result.scalars().all())
        return PortfolioMapper.to_domain(profile, skills)
