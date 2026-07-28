"""Map persisted conversations to domain entities."""

from app.domain.entities.conversation import Conversation
from app.infrastructure.database.mappers.message_mapper import MessageMapper
from app.infrastructure.database.models.conversation import Conversation as ConversationModel


class ConversationMapper:
    """Convert a SQLAlchemy conversation and its loaded messages."""

    @staticmethod
    def to_domain(model: ConversationModel) -> Conversation:
        ordered_messages = sorted(model.messages, key=lambda message: message.created_at)
        return Conversation(
            id=model.id,
            session_id=model.session_id,
            title=model.title,
            created_at=model.created_at,
            updated_at=model.updated_at,
            messages=tuple(MessageMapper.to_domain(item) for item in ordered_messages),
        )
