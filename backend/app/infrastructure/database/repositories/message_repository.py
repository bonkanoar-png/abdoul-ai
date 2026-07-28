"""SQLAlchemy repository for persisted conversation messages."""

from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.message import Message
from app.domain.repositories.message import MessageRepository
from app.infrastructure.database.mappers.message_mapper import MessageMapper
from app.infrastructure.database.models.conversation import Conversation as ConversationModel
from app.infrastructure.database.models.message import Message as MessageModel


class SQLAlchemyMessageRepository(MessageRepository):
    """Load messages through SQLAlchemy 2.x async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_messages(self, conversation_id: UUID) -> tuple[Message, ...] | None:
        conversation_result = await self._session.execute(
            select(ConversationModel.id).where(ConversationModel.id == conversation_id)
        )
        if conversation_result.scalar_one_or_none() is None:
            return None

        statement = (
            select(MessageModel)
            .where(MessageModel.conversation_id == conversation_id)
            .order_by(MessageModel.created_at.asc())
        )
        result = await self._session.execute(statement)
        return tuple(MessageMapper.to_domain(model) for model in result.scalars().all())
