"""Public HTTP response schema for the profile endpoint."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ProfileResponse(BaseModel):
    """Serialized public profile returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    name: str
    title: str
    bio: str
    location: str
    email: str
    github_url: str | None
    linkedin_url: str | None
    avatar_url: str | None
    created_at: datetime
    updated_at: datetime
