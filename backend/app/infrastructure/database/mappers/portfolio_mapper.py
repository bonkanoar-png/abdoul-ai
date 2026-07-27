"""Map the persisted portfolio aggregate to the domain."""

from collections.abc import Sequence

from app.domain.entities.portfolio import Portfolio
from app.infrastructure.database.mappers.experience_mapper import ExperienceMapper
from app.infrastructure.database.mappers.project_mapper import ProjectMapper
from app.infrastructure.database.mappers.skill_mapper import SkillMapper
from app.infrastructure.database.models.profile import Profile
from app.infrastructure.database.models.skill import Skill


class PortfolioMapper:
    """Convert a profile and its explicitly loaded relations into a portfolio."""

    @staticmethod
    def to_domain(profile: Profile, skills: Sequence[Skill]) -> Portfolio:
        return Portfolio(
            id=profile.id,
            name=profile.name,
            title=profile.title,
            bio=profile.bio,
            location=profile.location,
            email=profile.email,
            github_url=profile.github_url,
            linkedin_url=profile.linkedin_url,
            avatar_url=profile.avatar_url,
            created_at=profile.created_at,
            updated_at=profile.updated_at,
            experiences=tuple(
                ExperienceMapper.to_domain(experience) for experience in profile.experiences
            ),
            projects=tuple(ProjectMapper.to_domain(project) for project in profile.projects),
            skills=tuple(SkillMapper.to_domain(skill) for skill in skills),
        )
