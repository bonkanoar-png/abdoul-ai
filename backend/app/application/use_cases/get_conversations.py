"""Use case for obtaining persisted conversations."""

from app.domain.entities.conversation import Conversation
from app.domain.repositories.conversation import ConversationRepository


class GetConversationsUseCase:
    """Retrieve conversations through their repository contract."""

    def __init__(self, repository: ConversationRepository) -> None:
        self._repository = repository

    async def execute(self) -> tuple[Conversation, ...]:
        return await self._repository.get_conversations()
