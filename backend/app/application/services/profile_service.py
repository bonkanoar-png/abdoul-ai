"""Application service for public profile operations."""

from app.application.dto.profile import ProfileDTO
from app.application.use_cases.get_profile import GetProfileUseCase


class ProfileService:
    """Orchestrate profile retrieval and DTO transformation."""

    def __init__(self, get_profile: GetProfileUseCase) -> None:
        self._get_profile = get_profile

    async def get_public_profile(self) -> ProfileDTO | None:
        """Return the public profile as an application DTO."""
        profile = await self._get_profile.execute()
        if profile is None:
            return None
        return ProfileDTO.from_entity(profile)
