"""Repository contracts required by the domain."""

from app.domain.repositories.experience import ExperienceRepository
from app.domain.repositories.portfolio import PortfolioRepository
from app.domain.repositories.profile import ProfileRepository
from app.domain.repositories.skill import SkillRepository

__all__ = ["ExperienceRepository", "PortfolioRepository", "ProfileRepository", "SkillRepository"]
