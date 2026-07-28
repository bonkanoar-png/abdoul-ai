"""Composition dependencies for conversation persistence reads."""

from typing import Annotated

from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db_session
from app.application.services.conversation_service import ConversationService
from app.application.services.message_service import MessageService
from app.application.use_cases.get_conversations import GetConversationsUseCase
from app.application.use_cases.get_messages import GetMessagesUseCase
from app.infrastructure.database.repositories.conversation_repository import (
    SQLAlchemyConversationRepository,
)
from app.infrastructure.database.repositories.message_repository import (
    SQLAlchemyMessageRepository,
)


def get_conversation_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> ConversationService:
    repository = SQLAlchemyConversationRepository(session)
    return ConversationService(GetConversationsUseCase(repository))


def get_message_service(
    session: Annotated[AsyncSession, Depends(get_db_session)],
) -> MessageService:
    repository = SQLAlchemyMessageRepository(session)
    return MessageService(GetMessagesUseCase(repository))
