"""Map persisted skills to domain entities."""

from app.domain.entities.portfolio import Skill as SkillEntity
from app.infrastructure.database.models.skill import Skill as SkillModel


class SkillMapper:
    """Convert an SQLAlchemy skill model into a domain skill."""

    @staticmethod
    def to_domain(model: SkillModel) -> SkillEntity:
        return SkillEntity(
            id=model.id,
            name=model.name,
            category=model.category,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
        )
