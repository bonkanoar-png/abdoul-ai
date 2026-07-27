"""Unit tests for the read-only portfolio API."""

import asyncio
from datetime import UTC, date, datetime
from typing import cast
from uuid import UUID, uuid4

import pytest
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.routes.portfolio import get_portfolio
from app.infrastructure.database.models import Experience, Profile, Project, Skill
from app.main import app


class ScalarResult:
    """Minimal scalar result used by the async session test double."""

    def __init__(self, value: object) -> None:
        self.value = value

    def scalar_one_or_none(self) -> object:
        return self.value

    def scalars(self) -> "ScalarResult":
        return self

    def all(self) -> list[object]:
        return list(self.value) if isinstance(self.value, list) else []


class SessionStub:
    """Return predetermined results for sequential execute calls."""

    def __init__(
        self, results: list[ScalarResult] | None = None, error: Exception | None = None
    ) -> None:
        self.results = iter(results or [])
        self.error = error
        self.execute_count = 0

    async def execute(self, _statement: object) -> ScalarResult:
        self.execute_count += 1
        if self.error is not None:
            raise self.error
        return next(self.results)


def build_portfolio() -> tuple[Profile, Experience, Project, Skill]:
    """Build detached ORM entities with deterministic serializable values."""
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
        repository_url=None,
        live_url=None,
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


def test_portfolio_serializes_uuid_dates_and_loaded_relations() -> None:
    profile, experience, project, skill = build_portfolio()
    session = SessionStub([ScalarResult(profile), ScalarResult([skill])])
    response = asyncio.run(get_portfolio(cast(AsyncSession, session)))

    payload = response.model_dump(mode="json")
    assert UUID(payload["profile"]["id"]) == profile.id
    assert payload["experiences"][0]["start_date"] == experience.start_date.isoformat()
    assert payload["profile"]["created_at"] == profile.created_at.isoformat().replace("+00:00", "Z")
    assert payload["projects"][0]["id"] == str(project.id)
    assert payload["projects"][0]["skills"][0]["id"] == str(skill.id)
    assert payload["skills"][0]["name"] == "Python"
    assert session.execute_count == 2


def test_portfolio_returns_404_when_profile_is_absent() -> None:
    session = SessionStub([ScalarResult(None)])

    with pytest.raises(HTTPException) as raised:
        asyncio.run(get_portfolio(cast(AsyncSession, session)))

    assert raised.value.status_code == 404
    assert raised.value.detail == "Portfolio not found."
    assert session.execute_count == 1


def test_portfolio_returns_generic_500_for_database_errors() -> None:
    session = SessionStub(error=SQLAlchemyError("private database detail"))

    with pytest.raises(HTTPException) as raised:
        asyncio.run(get_portfolio(cast(AsyncSession, session)))

    assert raised.value.status_code == 500
    assert raised.value.detail == "Unable to load portfolio."
    assert "private database detail" not in str(raised.value.detail)


def test_portfolio_route_is_registered() -> None:
    assert "get" in app.openapi()["paths"]["/api/v1/portfolio"]
