"""Repository contract for loading public technologies."""

from typing import Protocol

from app.domain.entities.technology import Technology


class TechnologyRepository(Protocol):
    """Persistence-agnostic technology read operations."""

    async def get_technologies(self) -> tuple[Technology, ...]:
        """Return public technologies in display order."""
        ...
