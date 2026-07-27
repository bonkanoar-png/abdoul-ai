"""Map the persisted profile to its domain entity."""

from app.domain.entities.profile import Profile as ProfileEntity
from app.infrastructure.database.models.profile import Profile as ProfileModel


class ProfileMapper:
    """Convert an SQLAlchemy profile model into a domain profile."""

    @staticmethod
    def to_domain(model: ProfileModel) -> ProfileEntity:
        return ProfileEntity(
            id=model.id,
            name=model.name,
            title=model.title,
            bio=model.bio,
            location=model.location,
            email=model.email,
            github_url=model.github_url,
            linkedin_url=model.linkedin_url,
            avatar_url=model.avatar_url,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
