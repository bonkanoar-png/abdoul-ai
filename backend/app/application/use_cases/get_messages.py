"""Use case for obtaining messages from one conversation."""

from uuid import UUID

from app.domain.entities.message import Message
from app.domain.repositories.message import MessageRepository


class GetMessagesUseCase:
    """Retrieve messages through their repository contract."""

    def __init__(self, repository: MessageRepository) -> None:
        self._repository = repository

    async def execute(self, conversation_id: UUID) -> tuple[Message, ...] | None:
        return await self._repository.get_messages(conversation_id)
