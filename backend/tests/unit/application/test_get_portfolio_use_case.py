"""Tests for the public portfolio use case."""

import asyncio
from datetime import UTC, datetime
from uuid import uuid4

from app.application.use_cases.get_portfolio import GetPortfolioUseCase
from app.domain.entities.portfolio import Portfolio

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


def build_portfolio() -> Portfolio:
    return Portfolio(
        id=uuid4(),
        name="Abdoul",
        title="Backend Engineer",
        bio="I build useful systems.",
        location="France",
        email="contact@example.com",
        github_url=None,
        linkedin_url=None,
        avatar_url=None,
        created_at=NOW,
        updated_at=NOW,
    )


class FakePortfolioRepository:
    def __init__(self, portfolio: Portfolio | None) -> None:
        self.portfolio = portfolio
        self.call_count = 0

    async def get_portfolio(self) -> Portfolio | None:
        self.call_count += 1
        return self.portfolio


def test_get_portfolio_returns_the_domain_entity() -> None:
    portfolio = build_portfolio()
    repository = FakePortfolioRepository(portfolio)
    use_case = GetPortfolioUseCase(repository)

    result = asyncio.run(use_case.execute())

    assert result is portfolio
    assert repository.call_count == 1


def test_get_portfolio_returns_none_when_portfolio_is_absent() -> None:
    repository = FakePortfolioRepository(None)
    use_case = GetPortfolioUseCase(repository)

    result = asyncio.run(use_case.execute())

    assert result is None
    assert repository.call_count == 1
