"""HTTP integration tests for the portfolio endpoint."""

from sqlalchemy.exc import SQLAlchemyError

from app.api.dependencies.portfolio import get_portfolio_service
from app.application.services.portfolio_service import PortfolioService
from app.application.use_cases.get_portfolio import GetPortfolioUseCase
from app.domain.entities.portfolio import Portfolio
from app.infrastructure.database.mappers.portfolio_mapper import PortfolioMapper


class FakePortfolioRepository:
    """Return a configured portfolio without crossing the HTTP boundary."""

    def __init__(
        self,
        portfolio: Portfolio | None = None,
        error: Exception | None = None,
    ) -> None:
        self.portfolio = portfolio
        self.error = error

    async def get_portfolio(self) -> Portfolio | None:
        if self.error is not None:
            raise self.error
        return self.portfolio


def portfolio_service(
    portfolio: Portfolio | None = None,
    error: Exception | None = None,
) -> PortfolioService:
    return PortfolioService(GetPortfolioUseCase(FakePortfolioRepository(portfolio, error)))


def test_portfolio_response_over_asgi(
    api_client,
    override_dependency,
    portfolio_entities,
) -> None:
    profile, experience, project, skill = portfolio_entities
    portfolio = PortfolioMapper.to_domain(profile, [skill])
    override_dependency(get_portfolio_service, portfolio_service(portfolio))

    response = api_client.get("/api/v1/portfolio")

    assert response.status_code == 200
    payload = response.json()
    assert payload["profile"]["id"] == str(profile.id)
    assert payload["experiences"][0]["start_date"] == experience.start_date.isoformat()
    assert payload["projects"][0]["id"] == str(project.id)
    assert payload["projects"][0]["skills"][0]["id"] == str(skill.id)


def test_portfolio_404_over_asgi(
    api_client,
    override_dependency,
) -> None:
    override_dependency(get_portfolio_service, portfolio_service())

    response = api_client.get("/api/v1/portfolio")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "RESOURCE_NOT_FOUND",
            "message": "Portfolio not found.",
            "details": None,
        }
    }


def test_portfolio_500_hides_database_details(
    api_client,
    override_dependency,
) -> None:
    override_dependency(
        get_portfolio_service,
        portfolio_service(error=SQLAlchemyError("private database detail")),
    )

    response = api_client.get("/api/v1/portfolio")

    assert response.status_code == 500
    assert response.json() == {
        "error": {
            "code": "HTTP_ERROR",
            "message": "Unable to load portfolio.",
            "details": None,
        }
    }
    assert "private database detail" not in response.text
