"""SQLAlchemy repository for public formations."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.formation import Formation
from app.domain.repositories.formation import FormationRepository
from app.infrastructure.database.mappers.formation_mapper import FormationMapper
from app.infrastructure.database.models.formation import Formation as FormationModel


class SQLAlchemyFormationRepository(FormationRepository):
    """Load formations through SQLAlchemy 2.x async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_formations(self) -> tuple[Formation, ...]:
        statement = select(FormationModel).order_by(
            FormationModel.sort_order.asc(),
            FormationModel.start_date.desc(),
        )
        result = await self._session.execute(statement)
        return tuple(FormationMapper.to_domain(model) for model in result.scalars().all())
