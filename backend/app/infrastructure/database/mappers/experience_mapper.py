"""Map persisted experiences to domain entities."""

from app.domain.entities.portfolio import Experience as ExperienceEntity
from app.infrastructure.database.models.experience import Experience as ExperienceModel


class ExperienceMapper:
    """Convert an SQLAlchemy experience model into a domain experience."""

    @staticmethod
    def to_domain(model: ExperienceModel) -> ExperienceEntity:
        return ExperienceEntity(
            id=model.id,
            profile_id=model.profile_id,
            company=model.company,
            role=model.role,
            description=model.description,
            start_date=model.start_date,
            end_date=model.end_date,
            is_current=model.is_current,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
