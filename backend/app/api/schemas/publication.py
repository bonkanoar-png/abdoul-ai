"""Public HTTP response schema for publications."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PublicationResponse(BaseModel):
    """Serialized publication returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    title: str
    slug: str
    summary: str
    content: str
    url: str | None
    publication_type: str
    published_at: datetime
    sort_order: int
    created_at: datetime
    updated_at: datetime
