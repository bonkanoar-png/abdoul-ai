"""Application service for public portfolio operations."""

from app.application.dto.portfolio import PortfolioDTO
from app.application.use_cases.get_portfolio import GetPortfolioUseCase


class PortfolioService:
    """Orchestrate portfolio retrieval and application DTO transformation."""

    def __init__(self, get_portfolio: GetPortfolioUseCase) -> None:
        self._get_portfolio = get_portfolio

    async def get_public_portfolio(self) -> PortfolioDTO | None:
        """Return the public portfolio as an application DTO."""
        portfolio = await self._get_portfolio.execute()
        if portfolio is None:
            return None
        return PortfolioDTO.from_entity(portfolio)
