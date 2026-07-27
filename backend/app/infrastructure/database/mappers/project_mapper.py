"""Map persisted projects to domain entities."""

from app.domain.entities.portfolio import Project as ProjectEntity
from app.infrastructure.database.mappers.skill_mapper import SkillMapper
from app.infrastructure.database.models.project import Project as ProjectModel


class ProjectMapper:
    """Convert an SQLAlchemy project model and its loaded skills."""

    @staticmethod
    def to_domain(model: ProjectModel) -> ProjectEntity:
        ordered_skills = sorted(model.skills, key=lambda skill: (skill.sort_order, skill.name))
        return ProjectEntity(
            id=model.id,
            profile_id=model.profile_id,
            slug=model.slug,
            title=model.title,
            summary=model.summary,
            description=model.description,
            repository_url=model.repository_url,
            live_url=model.live_url,
            image_url=model.image_url,
            is_featured=model.is_featured,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
            skills=tuple(SkillMapper.to_domain(skill) for skill in ordered_skills),
        )
