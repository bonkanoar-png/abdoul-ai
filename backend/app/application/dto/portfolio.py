"""Application DTOs for the public portfolio."""

from dataclasses import dataclass
from datetime import date, datetime
from uuid import UUID

from app.domain.entities.portfolio import Experience, Portfolio, Project, Skill


@dataclass(frozen=True, slots=True)
class SkillDTO:
    """Application representation of a portfolio skill."""

    id: UUID
    name: str
    category: str
    sort_order: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, skill: Skill) -> "SkillDTO":
        return cls(
            id=skill.id,
            name=skill.name,
            category=skill.category,
            sort_order=skill.sort_order,
            created_at=skill.created_at,
            updated_at=skill.updated_at,
        )


@dataclass(frozen=True, slots=True)
class ExperienceDTO:
    """Application representation of a professional experience."""

    id: UUID
    profile_id: UUID
    company: str
    role: str
    description: str
    start_date: date
    end_date: date | None
    is_current: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime

    @classmethod
    def from_entity(cls, experience: Experience) -> "ExperienceDTO":
        return cls(
            id=experience.id,
            profile_id=experience.profile_id,
            company=experience.company,
            role=experience.role,
            description=experience.description,
            start_date=experience.start_date,
            end_date=experience.end_date,
            is_current=experience.is_current,
            sort_order=experience.sort_order,
            created_at=experience.created_at,
            updated_at=experience.updated_at,
        )


@dataclass(frozen=True, slots=True)
class ProjectDTO:
    """Application representation of a project and its skills."""

    id: UUID
    profile_id: UUID
    slug: str
    title: str
    summary: str
    description: str
    repository_url: str | None
    live_url: str | None
    image_url: str | None
    is_featured: bool
    sort_order: int
    created_at: datetime
    updated_at: datetime
    skills: tuple[SkillDTO, ...]

    @classmethod
    def from_entity(cls, project: Project) -> "ProjectDTO":
        return cls(
            id=project.id,
            profile_id=project.profile_id,
            slug=project.slug,
            title=project.title,
            summary=project.summary,
            description=project.description,
            repository_url=project.repository_url,
            live_url=project.live_url,
            image_url=project.image_url,
            is_featured=project.is_featured,
            sort_order=project.sort_order,
            created_at=project.created_at,
            updated_at=project.updated_at,
            skills=tuple(SkillDTO.from_entity(skill) for skill in project.skills),
        )


@dataclass(frozen=True, slots=True)
class PortfolioDTO:
    """Application representation returned by portfolio services."""

    id: UUID
    name: str
    title: str
    bio: str
    location: str
    email: str
    github_url: str | None
    linkedin_url: str | None
    avatar_url: str | None
    created_at: datetime
    updated_at: datetime
    experiences: tuple[ExperienceDTO, ...]
    projects: tuple[ProjectDTO, ...]
    skills: tuple[SkillDTO, ...]

    @classmethod
    def from_entity(cls, portfolio: Portfolio) -> "PortfolioDTO":
        return cls(
            id=portfolio.id,
            name=portfolio.name,
            title=portfolio.title,
            bio=portfolio.bio,
            location=portfolio.location,
            email=portfolio.email,
            github_url=portfolio.github_url,
            linkedin_url=portfolio.linkedin_url,
            avatar_url=portfolio.avatar_url,
            created_at=portfolio.created_at,
            updated_at=portfolio.updated_at,
            experiences=tuple(
                ExperienceDTO.from_entity(experience) for experience in portfolio.experiences
            ),
            projects=tuple(ProjectDTO.from_entity(project) for project in portfolio.projects),
            skills=tuple(SkillDTO.from_entity(skill) for skill in portfolio.skills),
        )
