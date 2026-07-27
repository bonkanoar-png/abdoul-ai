"""SQLAlchemy repository for public experiences."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.experience import Experience
from app.domain.repositories.experience import ExperienceRepository
from app.infrastructure.database.mappers.experience_mapper import ExperienceMapper
from app.infrastructure.database.models.experience import Experience as ExperienceModel


class SQLAlchemyExperienceRepository(ExperienceRepository):
    """Load public experiences through SQLAlchemy 2.x async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_experiences(self) -> tuple[Experience, ...]:
        statement = select(ExperienceModel).order_by(
            ExperienceModel.sort_order.asc(),
            ExperienceModel.start_date.desc(),
        )
        result = await self._session.execute(statement)
        return tuple(ExperienceMapper.to_domain(model) for model in result.scalars().all())
