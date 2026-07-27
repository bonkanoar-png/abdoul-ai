"""Repository contract for loading public experiences."""

from typing import Protocol

from app.domain.entities.experience import Experience


class ExperienceRepository(Protocol):
    """Persistence-agnostic operation required by experience use cases."""

    async def get_experiences(self) -> tuple[Experience, ...]:
        """Return public experiences in display order."""
        ...
