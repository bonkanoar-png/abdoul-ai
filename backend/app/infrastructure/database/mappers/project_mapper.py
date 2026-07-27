"""Map persisted projects to project domain representations."""

from app.domain.entities.portfolio import Project as PortfolioProject
from app.domain.entities.project import Project
from app.infrastructure.database.mappers.skill_mapper import SkillMapper
from app.infrastructure.database.mappers.technology_mapper import TechnologyMapper
from app.infrastructure.database.models.project import Project as ProjectModel


class ProjectMapper:
    """Convert an SQLAlchemy project model and its loaded skills."""

    @staticmethod
    def to_domain(model: ProjectModel) -> Project:
        """Map a project and explicitly loaded skills as technologies."""
        ordered_technologies = sorted(
            model.skills, key=lambda skill: (skill.sort_order, skill.name)
        )
        return Project(
            id=model.id,
            profile_id=model.profile_id,
            slug=model.slug,
            title=model.title,
            description=model.summary,
            content=model.description,
            github_url=model.repository_url,
            demo_url=model.live_url,
            image_url=model.image_url,
            is_featured=model.is_featured,
            sort_order=model.sort_order,
            created_at=model.created_at,
            updated_at=model.updated_at,
            technologies=tuple(
                TechnologyMapper.to_domain(technology) for technology in ordered_technologies
            ),
        )

    @staticmethod
    def to_portfolio_domain(model: ProjectModel) -> PortfolioProject:
        """Preserve the Foundation portfolio projection contract."""
        ordered_skills = sorted(model.skills, key=lambda skill: (skill.sort_order, skill.name))
        return PortfolioProject(
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
