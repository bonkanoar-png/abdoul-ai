"""Framework-independent publication entity."""

from dataclasses import dataclass
from datetime import datetime
from urllib.parse import urlparse
from uuid import UUID

from app.domain.exceptions.portfolio import InvalidPublication


@dataclass(frozen=True, slots=True)
class Publication:
    """Public content item with validated identity and optional URL."""

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

    def __post_init__(self) -> None:
        if not self.title.strip():
            raise InvalidPublication("A publication title is required.")
        if not self.slug.strip():
            raise InvalidPublication("A publication slug is required.")
        if self.url is not None:
            parsed_url = urlparse(self.url)
            if parsed_url.scheme not in {"http", "https"} or not parsed_url.netloc:
                raise InvalidPublication("A publication URL must be an absolute HTTP(S) URL.")
        if self.sort_order < 0:
            raise InvalidPublication("Publication sort order cannot be negative.")
