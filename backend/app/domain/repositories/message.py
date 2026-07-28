"""Repository contract for loading conversation messages."""

from typing import Protocol
from uuid import UUID

from app.domain.entities.message import Message


class MessageRepository(Protocol):
    """Persistence-agnostic message read operations."""

    async def get_messages(self, conversation_id: UUID) -> tuple[Message, ...] | None:
        """Return ordered messages, or None when the conversation does not exist."""
        ...
