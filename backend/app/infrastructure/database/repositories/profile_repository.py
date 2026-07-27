"""SQLAlchemy repository for the public profile."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.domain.entities.profile import Profile
from app.domain.repositories.profile import ProfileRepository
from app.infrastructure.database.mappers.profile_mapper import ProfileMapper
from app.infrastructure.database.models.profile import Profile as ProfileModel


class SQLAlchemyProfileRepository(ProfileRepository):
    """Load the public profile through SQLAlchemy 2.x async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_profile(self) -> Profile | None:
        statement = select(ProfileModel).order_by(ProfileModel.created_at.asc()).limit(1)
        result = await self._session.execute(statement)
        profile = result.scalar_one_or_none()
        if profile is None:
            return None
        return ProfileMapper.to_domain(profile)
