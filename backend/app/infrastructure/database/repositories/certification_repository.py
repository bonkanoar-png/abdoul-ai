"""SQLAlchemy repository for public certifications."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.certification import Certification
from app.domain.repositories.certification import CertificationRepository
from app.infrastructure.database.mappers.certification_mapper import CertificationMapper
from app.infrastructure.database.models.certification import Certification as CertificationModel


class SQLAlchemyCertificationRepository(CertificationRepository):
    """Load certifications through SQLAlchemy 2.x async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_certifications(self) -> tuple[Certification, ...]:
        statement = select(CertificationModel).order_by(
            CertificationModel.sort_order.asc(),
            CertificationModel.issued_at.desc(),
        )
        result = await self._session.execute(statement)
        return tuple(CertificationMapper.to_domain(model) for model in result.scalars().all())
