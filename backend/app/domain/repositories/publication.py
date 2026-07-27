"""Repository contract for loading public publications."""

from typing import Protocol

from app.domain.entities.publication import Publication


class PublicationRepository(Protocol):
    """Persistence-agnostic publication read operations."""

    async def get_publications(self) -> tuple[Publication, ...]:
        """Return public publications in display order."""
        ...
