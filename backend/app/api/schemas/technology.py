"""Public HTTP response schema for technologies."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class TechnologyResponse(BaseModel):
    """Serialized technology returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    category: str
    icon_url: str | None
    sort_order: int
    created_at: datetime
    updated_at: datetime
