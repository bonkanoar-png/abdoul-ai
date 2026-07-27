"""SQLAlchemy repository for public skills."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.skill import Skill
from app.domain.repositories.skill import SkillRepository
from app.infrastructure.database.mappers.skill_mapper import SkillMapper
from app.infrastructure.database.models.skill import Skill as SkillModel


class SQLAlchemySkillRepository(SkillRepository):
    """Load public skills through SQLAlchemy 2.x async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_skills(self) -> tuple[Skill, ...]:
        statement = select(SkillModel).order_by(
            SkillModel.sort_order.asc(),
            SkillModel.name.asc(),
        )
        result = await self._session.execute(statement)
        return tuple(SkillMapper.to_domain(model) for model in result.scalars().all())
