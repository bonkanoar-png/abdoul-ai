"""Map persisted messages to domain entities."""

from app.domain.entities.message import Message, MessageRole
from app.infrastructure.database.models.message import Message as MessageModel


class MessageMapper:
    """Convert a SQLAlchemy message model."""

    @staticmethod
    def to_domain(model: MessageModel) -> Message:
        return Message(
            id=model.id,
            conversation_id=model.conversation_id,
            role=MessageRole(model.role),
            content=model.content,
            created_at=model.created_at,
        )
