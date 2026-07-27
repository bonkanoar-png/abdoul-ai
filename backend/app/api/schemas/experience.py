"""Public HTTP response schema for experiences."""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ExperienceResponse(BaseModel):
    """Serialized professional experience returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    profile_id: UUID
    company: str
    role: str
    description: str
    start_date: date
    end_date: date | None
    is_current: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
