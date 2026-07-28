"""HTTP response schema for persisted conversations."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.api.schemas.message import MessageResponse


class ConversationResponse(BaseModel):
    """Serialized persisted conversation."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    session_id: str
    title: str | None
    created_at: datetime
    updated_at: datetime
    messages: list[MessageResponse]
