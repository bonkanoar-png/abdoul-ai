"""Public HTTP response schema for documents."""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    """Serialized public document returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    profile_id: UUID
    title: str
    description: str
    document_type: Literal["CV", "PORTFOLIO", "REPORT", "CERTIFICATE", "OTHER"]
    file_name: str
    file_url: str
    mime_type: str
    file_size: int
    is_public: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
