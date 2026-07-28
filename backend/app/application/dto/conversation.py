"""Application DTO for persisted conversations."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.application.dto.message import MessageDTO
from app.domain.entities.conversation import Conversation


@dataclass(frozen=True, slots=True)
class ConversationDTO:
    """Framework-independent conversation representation."""

    id: UUID
    session_id: str
    title: str | None
    created_at: datetime
    updated_at: datetime
    messages: tuple[MessageDTO, ...]

    @classmethod
    def from_entity(cls, conversation: Conversation) -> "ConversationDTO":
        return cls(
            id=conversation.id,
            session_id=conversation.session_id,
            title=conversation.title,
            created_at=conversation.created_at,
            updated_at=conversation.updated_at,
            messages=tuple(MessageDTO.from_entity(item) for item in conversation.messages),
        )
