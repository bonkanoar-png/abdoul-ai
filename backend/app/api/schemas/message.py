"""HTTP response schema for persisted messages."""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class MessageResponse(BaseModel):
    """Serialized persisted message."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    conversation_id: UUID
    role: Literal["USER", "ASSISTANT", "SYSTEM"]
    content: str
    created_at: datetime
