"""Framework-independent conversation message entity."""

from dataclasses import dataclass
from datetime import datetime
from enum import StrEnum
from uuid import UUID

from app.domain.exceptions.portfolio import InvalidMessage


class MessageRole(StrEnum):
    """Roles supported by persisted conversation messages."""

    USER = "USER"
    ASSISTANT = "ASSISTANT"
    SYSTEM = "SYSTEM"


@dataclass(frozen=True, slots=True)
class Message:
    """A persisted message without generation behavior."""

    id: UUID
    conversation_id: UUID
    role: MessageRole
    content: str
    created_at: datetime

    def __post_init__(self) -> None:
        if not isinstance(self.role, MessageRole):
            raise InvalidMessage("A supported message role is required.")
        if not self.content.strip():
            raise InvalidMessage("Message content is required.")
