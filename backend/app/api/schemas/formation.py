"""Public HTTP response schema for formations."""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FormationResponse(BaseModel):
    """Serialized formation returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    profile_id: UUID
    institution: str
    degree: str
    field_of_study: str | None
    description: str
    start_date: date
    end_date: date | None
    is_current: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
