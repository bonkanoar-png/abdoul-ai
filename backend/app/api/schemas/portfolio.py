"""Public response schemas for the portfolio API."""

from datetime import date, datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PortfolioSchema(BaseModel):
    """Base schema configured to read explicitly selected ORM attributes."""

    model_config = ConfigDict(from_attributes=True)


class SkillSchema(PortfolioSchema):
    """A technical or domain skill."""

    id: UUID
    name: str
    category: str
    sort_order: int
    created_at: datetime
    updated_at: datetime


class ExperienceSchema(PortfolioSchema):
    """A professional experience."""

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


class ProjectSchema(PortfolioSchema):
    """A portfolio project and its associated skills."""

    id: UUID
    profile_id: UUID
    slug: str
    title: str
    summary: str
    description: str
    repository_url: str | None
    live_url: str | None
    image_url: str | None
    is_featured: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
    skills: list[SkillSchema]


class ProfileSchema(PortfolioSchema):
    """The public portfolio owner profile."""

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


class PortfolioResponse(BaseModel):
    """Complete portfolio payload returned to the frontend."""

    profile: ProfileSchema
    experiences: list[ExperienceSchema]
    projects: list[ProjectSchema]
    skills: list[SkillSchema]
