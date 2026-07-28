"""Application service for message read operations."""

from uuid import UUID

from app.application.dto.message import MessageDTO
from app.application.use_cases.get_messages import GetMessagesUseCase


class MessageService:
    """Orchestrate message retrieval and DTO transformation."""

    def __init__(self, get_messages: GetMessagesUseCase) -> None:
        self._get_messages = get_messages

    async def get_messages(self, conversation_id: UUID) -> tuple[MessageDTO, ...] | None:
        messages = await self._get_messages.execute(conversation_id)
        if messages is None:
            return None
        return tuple(MessageDTO.from_entity(item) for item in messages)
