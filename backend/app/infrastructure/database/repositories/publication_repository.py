"""SQLAlchemy repository for public publications."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.publication import Publication
from app.domain.repositories.publication import PublicationRepository
from app.infrastructure.database.mappers.publication_mapper import PublicationMapper
from app.infrastructure.database.models.publication import Publication as PublicationModel


class SQLAlchemyPublicationRepository(PublicationRepository):
    """Load publications through SQLAlchemy 2.x async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_publications(self) -> tuple[Publication, ...]:
        statement = select(PublicationModel).order_by(
            PublicationModel.sort_order.asc(),
            PublicationModel.published_at.desc(),
        )
        result = await self._session.execute(statement)
        return tuple(PublicationMapper.to_domain(model) for model in result.scalars().all())
