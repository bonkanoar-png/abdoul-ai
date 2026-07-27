"""Repository contracts required by the domain."""

from app.domain.repositories.certification import CertificationRepository
from app.domain.repositories.experience import ExperienceRepository
from app.domain.repositories.formation import FormationRepository
from app.domain.repositories.portfolio import PortfolioRepository
from app.domain.repositories.profile import ProfileRepository
from app.domain.repositories.project import ProjectRepository
from app.domain.repositories.publication import PublicationRepository
from app.domain.repositories.skill import SkillRepository
from app.domain.repositories.technology import TechnologyRepository

__all__ = [
    "ExperienceRepository",
    "FormationRepository",
    "CertificationRepository",
    "PortfolioRepository",
    "ProfileRepository",
    "ProjectRepository",
    "PublicationRepository",
    "SkillRepository",
    "TechnologyRepository",
]
