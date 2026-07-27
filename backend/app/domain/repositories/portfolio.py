"""Repository contract for loading the public portfolio."""

from typing import Protocol

from app.domain.entities.portfolio import Portfolio


class PortfolioRepository(Protocol):
    """Persistence-agnostic operations required by portfolio use cases."""

    async def get_portfolio(self) -> Portfolio | None:
        """Return the configured public portfolio, if one exists."""
        ...
