"""Map persisted skill rows to technology domain entities."""

from app.domain.entities.technology import Technology
from app.infrastructure.database.models.skill import Skill as SkillModel


class TechnologyMapper:
    """Adapt the existing Foundation skill storage to technology semantics."""

    @staticmethod
    def to_domain(model: SkillModel) -> Technology:
        return Technology(
            id=model.id,
            name=model.name,
            category=model.category,
            icon_url=None,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
