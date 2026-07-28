"""Regression tests for the Clean Architecture dependency boundaries."""

import ast
from pathlib import Path

BACKEND_APP = Path(__file__).parents[2] / "app"


def imported_modules(path: Path) -> set[str]:
    """Return absolute modules imported by a Python source file."""
    tree = ast.parse(path.read_text(encoding="utf-8"))
    modules: set[str] = set()
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            modules.update(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module is not None:
            modules.add(node.module)
    return modules


def test_portfolio_route_does_not_import_sqlalchemy_or_infrastructure() -> None:
    modules = imported_modules(BACKEND_APP / "api" / "routes" / "portfolio.py")

    assert not any(module == "sqlalchemy" or module.startswith("sqlalchemy.") for module in modules)
    assert not any(module.startswith("app.infrastructure") for module in modules)


def test_application_does_not_import_infrastructure() -> None:
    modules = {
        module
        for path in (BACKEND_APP / "application").rglob("*.py")
        for module in imported_modules(path)
    }

    assert not any(module.startswith("app.infrastructure") for module in modules)
