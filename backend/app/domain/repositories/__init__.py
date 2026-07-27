"""Repository contracts required by the domain."""

from app.domain.repositories.portfolio import PortfolioRepository
from app.domain.repositories.profile import ProfileRepository

__all__ = ["PortfolioRepository", "ProfileRepository"]
