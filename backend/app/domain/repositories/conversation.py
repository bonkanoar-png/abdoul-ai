"""Repository contract for loading conversations."""

from typing import Protocol

from app.domain.entities.conversation import Conversation


class ConversationRepository(Protocol):
    """Persistence-agnostic conversation read operations."""

    async def get_conversations(self) -> tuple[Conversation, ...]:
        """Return conversations in reverse chronological order."""
        ...
