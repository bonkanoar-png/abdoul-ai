"""Use case for obtaining the public portfolio."""

from app.domain.entities.portfolio import Portfolio
from app.domain.repositories.portfolio import PortfolioRepository


class GetPortfolioUseCase:
    """Retrieve the public portfolio through its domain repository contract."""

    def __init__(self, repository: PortfolioRepository) -> None:
        self._repository = repository

    async def execute(self) -> Portfolio | None:
        """Return the configured portfolio, if one exists."""
        return await self._repository.get_portfolio()
