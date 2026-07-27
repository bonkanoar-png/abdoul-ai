"""Use case for obtaining the public profile."""

from app.domain.entities.profile import Profile
from app.domain.repositories.profile import ProfileRepository


class GetProfileUseCase:
    """Retrieve the public profile through its domain repository contract."""

    def __init__(self, repository: ProfileRepository) -> None:
        self._repository = repository

    async def execute(self) -> Profile | None:
        """Return the configured public profile, if one exists."""
        return await self._repository.get_profile()
