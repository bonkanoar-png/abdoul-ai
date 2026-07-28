"""Shared test fixtures for the backend test suite."""

import asyncio
from collections.abc import AsyncIterator, Callable, Iterator
from datetime import UTC, date, datetime
from uuid import uuid4

import httpx
import pytest
from fastapi import FastAPI

from app.infrastructure.database.models import Experience, Profile, Project, Skill
from app.main import app as application


class ASGITestClient:
    """Small synchronous facade over HTTPX's asynchronous ASGI transport."""

    def __init__(self, app: FastAPI) -> None:
        self.app = app

    def request(
        self,
        method: str,
        path: str,
        *,
        headers: dict[str, str] | None = None,
    ) -> httpx.Response:
        async def request() -> httpx.Response:
            transport = httpx.ASGITransport(app=self.app)
            async with httpx.AsyncClient(
                transport=transport,
                base_url="http://testserver",
            ) as client:
                return await client.request(method, path, headers=headers)

        return asyncio.run(request())

    def get(self, path: str) -> httpx.Response:
        return self.request("GET", path)

    def options(self, path: str, *, headers: dict[str, str]) -> httpx.Response:
        return self.request("OPTIONS", path, headers=headers)


class ScalarResultStub:
    """Minimal SQLAlchemy scalar-result test double."""

    def __init__(self, value: object) -> None:
        self.value = value

    def scalar_one_or_none(self) -> object:
        return self.value

    def scalars(self) -> "ScalarResultStub":
        return self

    def all(self) -> list[object]:
        return list(self.value) if isinstance(self.value, list) else []


class AsyncSessionStub:
    """Async session test double returning sequential execute results."""

    def __init__(
        self,
        results: list[ScalarResultStub] | None = None,
        error: Exception | None = None,
    ) -> None:
        self.results = iter(results or [])
        self.error = error

    async def execute(self, _statement: object) -> ScalarResultStub:
        if self.error is not None:
            raise self.error
        return next(self.results)


@pytest.fixture
def app() -> FastAPI:
    """Return the application under test."""
    return application


@pytest.fixture
def api_client(app: FastAPI) -> ASGITestClient:
    """Return an in-process HTTP client that never opens a network socket."""
    return ASGITestClient(app)


@pytest.fixture(autouse=True)
def replace_legacy_test_client(
    request: pytest.FixtureRequest,
    monkeypatch: pytest.MonkeyPatch,
    api_client: ASGITestClient,
) -> None:
    """Keep legacy module-level TestClient tests stable with HTTPX 0.28."""
    if hasattr(request.module, "client"):
        monkeypatch.setattr(request.module, "client", api_client)


@pytest.fixture
def portfolio_entities() -> tuple[Profile, Experience, Project, Skill]:
    """Build a complete detached portfolio with deterministic dates."""
    now = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)
    profile_id = uuid4()
    skill = Skill(
        id=uuid4(),
        name="Python",
        category="Backend",
        sort_order=1,
        created_at=now,
        updated_at=now,
    )
    experience = Experience(
        id=uuid4(),
        profile_id=profile_id,
        company="Abdoul AI",
        role="AI Engineer",
        description="Conception de produits utiles.",
        start_date=date(2024, 1, 1),
        end_date=None,
        is_current=True,
        sort_order=1,
        created_at=now,
        updated_at=now,
    )
    project = Project(
        id=uuid4(),
        profile_id=profile_id,
        slug="abdoul-ai",
        title="Abdoul AI",
        summary="Une expérience numérique claire.",
        description="Une plateforme centrée sur des usages simples.",
        repository_url="https://example.com/repository",
        live_url="https://example.com",
        image_url=None,
        is_featured=True,
        sort_order=1,
        created_at=now,
        updated_at=now,
    )
    project.skills = [skill]
    profile = Profile(
        id=profile_id,
        name="Abdoul",
        title="AI Engineer",
        bio="Je conçois des expériences intelligentes et accessibles.",
        location="France",
        email="contact@example.com",
        github_url=None,
        linkedin_url=None,
        avatar_url=None,
        created_at=now,
        updated_at=now,
    )
    profile.experiences = [experience]
    profile.projects = [project]
    return profile, experience, project, skill


@pytest.fixture
def session_stub_factory() -> Callable[
    [list[object] | None, Exception | None],
    AsyncSessionStub,
]:
    """Build async session stubs without importing the conftest module."""

    def build(
        values: list[object] | None = None,
        error: Exception | None = None,
    ) -> AsyncSessionStub:
        results = [ScalarResultStub(value) for value in values or []]
        return AsyncSessionStub(results=results, error=error)

    return build


@pytest.fixture
def override_dependency(
    app: FastAPI,
) -> Iterator[Callable[[Callable[..., object], object], None]]:
    """Provide a helper that overrides and then restores FastAPI dependencies."""

    def apply(dependency: Callable[..., object], value: object) -> None:
        async def dependency_override() -> AsyncIterator[object]:
            yield value

        app.dependency_overrides[dependency] = dependency_override

    yield apply
    app.dependency_overrides.clear()
