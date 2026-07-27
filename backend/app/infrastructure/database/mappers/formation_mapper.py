"""Map persisted formations to domain entities."""

from app.domain.entities.formation import Formation
from app.infrastructure.database.models.formation import Formation as FormationModel


class FormationMapper:
    """Convert a SQLAlchemy formation model."""

    @staticmethod
    def to_domain(model: FormationModel) -> Formation:
        return Formation(
            id=model.id,
            profile_id=model.profile_id,
            institution=model.institution,
            degree=model.degree,
            field_of_study=model.field_of_study,
            description=model.description,
            start_date=model.start_date,
            end_date=model.end_date,
            is_current=model.is_current,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
