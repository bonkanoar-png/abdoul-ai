"""Public HTTP response schema for certifications."""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CertificationResponse(BaseModel):
    """Serialized certification returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    issuer: str
    credential_url: str | None
    issued_at: date
    expiration_date: date | None
    sort_order: int
    created_at: datetime
    updated_at: datetime
