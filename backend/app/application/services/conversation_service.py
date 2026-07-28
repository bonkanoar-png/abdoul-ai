"""Application service for conversation read operations."""

from app.application.dto.conversation import ConversationDTO
from app.application.use_cases.get_conversations import GetConversationsUseCase


class ConversationService:
    """Orchestrate conversation retrieval and DTO transformation."""

    def __init__(self, get_conversations: GetConversationsUseCase) -> None:
        self._get_conversations = get_conversations

    async def get_conversations(self) -> tuple[ConversationDTO, ...]:
        conversations = await self._get_conversations.execute()
        return tuple(ConversationDTO.from_entity(item) for item in conversations)
