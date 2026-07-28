"""Unit tests for the read-only portfolio API."""

import asyncio
from typing import cast

import pytest
from fastapi import HTTPException

from app.api.routes.portfolio import get_portfolio
from app.application.dto.portfolio import PortfolioDTO
from app.application.services.portfolio_service import PortfolioService
from app.main import app
from tests.unit.application.test_portfolio_service import build_portfolio


class PortfolioServiceStub:
    """Return a predetermined application result from the API boundary."""

    def __init__(
        self,
        portfolio: PortfolioDTO | None = None,
        error: Exception | None = None,
    ) -> None:
        self.portfolio = portfolio
        self.error = error
        self.call_count = 0

    async def get_public_portfolio(self) -> PortfolioDTO | None:
        self.call_count += 1
        if self.error is not None:
            raise self.error
        return self.portfolio


def test_portfolio_serializes_uuid_dates_and_loaded_relations() -> None:
    portfolio = build_portfolio()
    service = PortfolioServiceStub(PortfolioDTO.from_entity(portfolio))

    response = asyncio.run(get_portfolio(cast(PortfolioService, service)))

    payload = response.model_dump(mode="json")
    assert payload["profile"]["id"] == str(portfolio.id)
    assert payload["experiences"][0]["start_date"] == "2024-01-01"
    assert payload["profile"]["created_at"] == "2026-07-27T10:30:00Z"
    assert payload["projects"][0]["id"] == str(portfolio.projects[0].id)
    assert payload["projects"][0]["skills"][0]["id"] == str(portfolio.skills[0].id)
    assert payload["skills"][0]["name"] == "Python"
    assert service.call_count == 1


def test_portfolio_returns_404_when_profile_is_absent() -> None:
    service = PortfolioServiceStub()

    with pytest.raises(HTTPException) as raised:
        asyncio.run(get_portfolio(cast(PortfolioService, service)))

    assert raised.value.status_code == 404
    assert raised.value.detail == "Portfolio not found."
    assert service.call_count == 1


def test_portfolio_returns_generic_500_for_database_errors() -> None:
    service = PortfolioServiceStub(error=RuntimeError("private database detail"))

    with pytest.raises(HTTPException) as raised:
        asyncio.run(get_portfolio(cast(PortfolioService, service)))

    assert raised.value.status_code == 500
    assert raised.value.detail == "Unable to load portfolio."
    assert "private database detail" not in str(raised.value.detail)


def test_portfolio_route_is_registered() -> None:
    assert "get" in app.openapi()["paths"]["/api/v1/portfolio"]
