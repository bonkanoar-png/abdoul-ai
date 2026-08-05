"""Bounded schemas for Admin CMS content."""

from datetime import date
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class AdminContentInput(BaseModel):
    """Common normalized payload accepted by collection resources."""

    model_config = ConfigDict(
        extra="forbid", str_strip_whitespace=True, from_attributes=True
    )

    title: str = Field(min_length=1, max_length=255)
    subtitle: str = Field(default="", max_length=255)
    description: str = Field(default="", max_length=20_000)
    slug: str | None = Field(default=None, max_length=255, pattern=r"^[a-z0-9-]+$")
    start_date: date | None = None
    end_date: date | None = None
    url: str | None = Field(default=None, max_length=2048)
    category: str = Field(default="General", max_length=255)
    is_current: bool = False
    is_active: bool = True
    sort_order: int = Field(default=0, ge=0, le=100_000)


class AdminContent(AdminContentInput):
    """Normalized content returned to the admin client."""

    id: UUID


class ProfileInput(BaseModel):
    """Editable public profile fields."""

    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=255)
    title: str = Field(min_length=1, max_length=255)
    bio: str = Field(min_length=1, max_length=20_000)
    location: str = Field(min_length=1, max_length=255)
    email: EmailStr
    github_url: str | None = Field(default=None, max_length=2048)
    linkedin_url: str | None = Field(default=None, max_length=2048)
    avatar_url: str | None = Field(default=None, max_length=2048)
    is_active: bool = True
