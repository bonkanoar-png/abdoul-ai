"""Repository contract for loading the public profile."""

from typing import Protocol

from app.domain.entities.profile import Profile


class ProfileRepository(Protocol):
    """Persistence-agnostic operation required by profile use cases."""

    async def get_profile(self) -> Profile | None:
        """Return the configured public profile, if one exists."""
        ...
