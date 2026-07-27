"""Tests for the portfolio application service."""

import asyncio
from datetime import UTC, date, datetime
from uuid import uuid4

from app.application.services.portfolio_service import PortfolioService
from app.application.use_cases.get_portfolio import GetPortfolioUseCase
from app.domain.entities.portfolio import Experience, Portfolio, Project, Skill

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


def build_portfolio() -> Portfolio:
    portfolio_id = uuid4()
    skill = Skill(
        id=uuid4(),
        name="Python",
        category="Backend",
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
    )
    experience = Experience(
        id=uuid4(),
        profile_id=portfolio_id,
        company="Abdoul AI",
        role="Backend Engineer",
        description="Build reliable products.",
        start_date=date(2024, 1, 1),
        end_date=None,
        is_current=True,
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
    )
    project = Project(
        id=uuid4(),
        profile_id=portfolio_id,
        slug="abdoul-ai",
        title="Abdoul AI",
        summary="A clear product foundation.",
        description="A portfolio built with explicit boundaries.",
        repository_url=None,
        live_url=None,
        image_url=None,
        is_featured=True,
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
        skills=(skill,),
    )
    return Portfolio(
        id=portfolio_id,
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
        experiences=(experience,),
        projects=(project,),
        skills=(skill,),
    )


class FakePortfolioRepository:
    def __init__(self, portfolio: Portfolio | None) -> None:
        self.portfolio = portfolio
        self.call_count = 0

    async def get_portfolio(self) -> Portfolio | None:
        self.call_count += 1
        return self.portfolio


def test_service_transforms_the_domain_entity_into_a_dto() -> None:
    portfolio = build_portfolio()
    repository = FakePortfolioRepository(portfolio)
    service = PortfolioService(GetPortfolioUseCase(repository))

    result = asyncio.run(service.get_public_portfolio())

    assert result is not None
    assert result.id == portfolio.id
    assert result.name == portfolio.name
    assert result.experiences[0].company == "Abdoul AI"
    assert result.projects[0].skills[0].name == "Python"
    assert result.skills[0].category == "Backend"
    assert repository.call_count == 1


def test_service_propagates_an_absent_portfolio() -> None:
    repository = FakePortfolioRepository(None)
    service = PortfolioService(GetPortfolioUseCase(repository))

    result = asyncio.run(service.get_public_portfolio())

    assert result is None
    assert repository.call_count == 1
