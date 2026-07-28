"""Framework-independent application data transfer objects."""

from app.application.dto.certification import CertificationDTO
from app.application.dto.document import DocumentDTO
from app.application.dto.experience import ExperienceDTO
from app.application.dto.formation import FormationDTO
from app.application.dto.portfolio import PortfolioDTO
from app.application.dto.profile import ProfileDTO
from app.application.dto.project import ProjectDTO
from app.application.dto.publication import PublicationDTO
from app.application.dto.skill import SkillDTO
from app.application.dto.technology import TechnologyDTO

__all__ = [
    "CertificationDTO",
    "DocumentDTO",
    "ExperienceDTO",
    "FormationDTO",
    "PortfolioDTO",
    "ProfileDTO",
    "ProjectDTO",
    "PublicationDTO",
    "SkillDTO",
    "TechnologyDTO",
]
