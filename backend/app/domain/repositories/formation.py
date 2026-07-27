"""Repository contract for loading public formations."""

from typing import Protocol

from app.domain.entities.formation import Formation


class FormationRepository(Protocol):
    """Persistence-agnostic formation read operations."""

    async def get_formations(self) -> tuple[Formation, ...]:
        """Return public formations in display order."""
        ...
