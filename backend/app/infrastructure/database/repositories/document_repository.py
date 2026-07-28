"""SQLAlchemy repository for public documents."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.document import Document
from app.domain.repositories.document import DocumentRepository
from app.infrastructure.database.mappers.document_mapper import DocumentMapper
from app.infrastructure.database.models.document import Document as DocumentModel


class SQLAlchemyDocumentRepository(DocumentRepository):
    """Load public documents through SQLAlchemy 2.x async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_documents(self) -> tuple[Document, ...]:
        statement = (
            select(DocumentModel)
            .where(DocumentModel.is_public.is_(True))
            .order_by(DocumentModel.sort_order.asc(), DocumentModel.created_at.desc())
        )
        result = await self._session.execute(statement)
        return tuple(DocumentMapper.to_domain(model) for model in result.scalars().all())
