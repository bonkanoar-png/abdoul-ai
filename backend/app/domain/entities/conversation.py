"""Framework-independent conversation entity."""

from dataclasses import dataclass, field
from datetime import datetime
from uuid import UUID

from app.domain.entities.message import Message
from app.domain.exceptions.portfolio import InvalidConversation


@dataclass(frozen=True, slots=True)
class Conversation:
    """A persisted conversation and its immutable messages."""

    id: UUID
    session_id: str
    title: str | None
    created_at: datetime
    updated_at: datetime
    messages: tuple[Message, ...] = field(default_factory=tuple)

    def __post_init__(self) -> None:
        if not self.session_id.strip():
            raise InvalidConversation("A conversation session ID is required.")
        if self.title is not None and not self.title.strip():
            raise InvalidConversation("A conversation title cannot be blank.")
        object.__setattr__(self, "messages", tuple(self.messages))
