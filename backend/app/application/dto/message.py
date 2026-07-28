"""Application DTO for persisted messages."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.entities.message import Message, MessageRole


@dataclass(frozen=True, slots=True)
class MessageDTO:
    """Framework-independent message representation."""

    id: UUID
    conversation_id: UUID
    role: MessageRole
    content: str
    created_at: datetime

    @classmethod
    def from_entity(cls, message: Message) -> "MessageDTO":
        return cls(
            id=message.id,
            conversation_id=message.conversation_id,
            role=message.role,
            content=message.content,
            created_at=message.created_at,
        )
