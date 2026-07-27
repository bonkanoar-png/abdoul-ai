"""Public HTTP response schema for projects."""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.api.schemas.technology import TechnologyResponse


class ProjectResponse(BaseModel):
    """Serialized project and its technologies returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    profile_id: UUID
    slug: str
    title: str
    description: str
    content: str
    github_url: str | None
    demo_url: str | None
    image_url: str | None
    is_featured: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
    technologies: list[TechnologyResponse]
