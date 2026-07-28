"""SQLAlchemy repository for persisted conversations."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.entities.conversation import Conversation
from app.domain.repositories.conversation import ConversationRepository
from app.infrastructure.database.mappers.conversation_mapper import ConversationMapper
from app.infrastructure.database.models.conversation import Conversation as ConversationModel


class SQLAlchemyConversationRepository(ConversationRepository):
    """Load conversations and messages through SQLAlchemy async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_conversations(self) -> tuple[Conversation, ...]:
        statement = (
            select(ConversationModel)
            .options(selectinload(ConversationModel.messages))
            .order_by(ConversationModel.created_at.desc())
        )
        result = await self._session.execute(statement)
        return tuple(ConversationMapper.to_domain(model) for model in result.scalars().all())
