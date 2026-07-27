"""Application DTO for public publications."""

from dataclasses import dataclass
from datetime import datetime
from uuid import UUID

from app.domain.entities.publication import Publication


@dataclass(frozen=True, slots=True)
class PublicationDTO:
    """Framework-independent publication representation."""

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

    @classmethod
    def from_entity(cls, publication: Publication) -> "PublicationDTO":
        return cls(
            id=publication.id,
            title=publication.title,
            slug=publication.slug,
            summary=publication.summary,
            content=publication.content,
            url=publication.url,
            publication_type=publication.publication_type,
            published_at=publication.published_at,
            sort_order=publication.sort_order,
            created_at=publication.created_at,
            updated_at=publication.updated_at,
        )
