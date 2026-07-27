"""Tests for the portfolio repository contract."""

import inspect
from typing import get_type_hints

from app.domain.entities.portfolio import Portfolio
from app.domain.repositories.portfolio import PortfolioRepository


def test_portfolio_repository_exposes_an_async_get_operation() -> None:
    operation = PortfolioRepository.get_portfolio

    assert inspect.iscoroutinefunction(operation)


def test_portfolio_repository_get_operation_has_domain_return_type() -> None:
    hints = get_type_hints(PortfolioRepository.get_portfolio)

    assert hints["return"] == Portfolio | None
