"""Public HTTP response schema for skills."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SkillResponse(BaseModel):
    """Serialized public skill returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    category: str
    sort_order: int
    created_at: datetime
    updated_at: datetime
