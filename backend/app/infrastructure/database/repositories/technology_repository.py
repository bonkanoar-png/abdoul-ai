"""SQLAlchemy repository for public technologies."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.technology import Technology
from app.domain.repositories.technology import TechnologyRepository
from app.infrastructure.database.mappers.technology_mapper import TechnologyMapper
from app.infrastructure.database.models.skill import Skill as SkillModel


class SQLAlchemyTechnologyRepository(TechnologyRepository):
    """Read technology data from existing Foundation skill storage."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_technologies(self) -> tuple[Technology, ...]:
        statement = select(SkillModel).order_by(SkillModel.sort_order.asc(), SkillModel.name.asc())
        result = await self._session.execute(statement)
        return tuple(TechnologyMapper.to_domain(model) for model in result.scalars().all())
