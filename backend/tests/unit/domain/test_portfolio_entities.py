"""Tests for framework-independent portfolio entities."""

from dataclasses import FrozenInstanceError
from datetime import UTC, date, datetime
from uuid import UUID, uuid4

import pytest

from app.domain.entities.portfolio import Experience, Portfolio, Project, Skill
from app.domain.exceptions.portfolio import (
    InvalidExperiencePeriod,
    InvalidPortfolio,
    InvalidProject,
    InvalidSkill,
)

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


def build_skill(*, name: str = "Python") -> Skill:
    return Skill(
        id=uuid4(),
        name=name,
        category="Backend",
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
    )


def build_experience(
    *,
    end_date: date | None = None,
    is_current: bool = True,
) -> Experience:
    return Experience(
        id=uuid4(),
        profile_id=uuid4(),
        company="Abdoul AI",
        role="Backend Engineer",
        description="Build reliable products.",
        start_date=date(2024, 1, 1),
        end_date=end_date,
        is_current=is_current,
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
    )


def build_project(*, slug: str = "abdoul-ai", title: str = "Abdoul AI") -> Project:
    return Project(
        id=uuid4(),
        profile_id=uuid4(),
        slug=slug,
        title=title,
        summary="A clear product foundation.",
        description="A portfolio built with explicit boundaries.",
        repository_url=None,
        live_url=None,
        image_url=None,
        is_featured=True,
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
        skills=(build_skill(),),
    )


def build_portfolio(*, name: str = "Abdoul") -> Portfolio:
    portfolio_id = uuid4()
    experience = build_experience()
    project = build_project()
    skill = build_skill()
    return Portfolio(
        id=portfolio_id,
        name=name,
        title="Backend Engineer",
        bio="I build useful and reliable systems.",
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


def test_portfolio_can_be_created_with_required_public_data() -> None:
    portfolio = build_portfolio()

    assert isinstance(portfolio.id, UUID)
    assert portfolio.name == "Abdoul"
    assert len(portfolio.experiences) == 1
    assert len(portfolio.projects) == 1
    assert len(portfolio.skills) == 1


def test_portfolio_rejects_blank_required_data() -> None:
    with pytest.raises(InvalidPortfolio, match="name"):
        build_portfolio(name=" ")


def test_portfolio_is_immutable() -> None:
    portfolio = build_portfolio()

    with pytest.raises(FrozenInstanceError):
        portfolio.name = "Changed"  # type: ignore[misc]


def test_experience_accepts_valid_periods() -> None:
    current = build_experience()
    completed = build_experience(end_date=date(2025, 1, 1), is_current=False)

    assert current.end_date is None
    assert completed.end_date == date(2025, 1, 1)


def test_experience_rejects_end_date_before_start_date() -> None:
    with pytest.raises(InvalidExperiencePeriod, match="before"):
        build_experience(end_date=date(2023, 12, 31), is_current=False)


def test_current_experience_rejects_end_date() -> None:
    with pytest.raises(InvalidExperiencePeriod, match="current"):
        build_experience(end_date=date(2025, 1, 1), is_current=True)


@pytest.mark.parametrize(("slug", "title"), [("", "Abdoul AI"), ("abdoul-ai", " ")])
def test_project_rejects_blank_slug_or_title(slug: str, title: str) -> None:
    with pytest.raises(InvalidProject):
        build_project(slug=slug, title=title)


def test_skill_rejects_blank_name() -> None:
    with pytest.raises(InvalidSkill):
        build_skill(name=" ")
