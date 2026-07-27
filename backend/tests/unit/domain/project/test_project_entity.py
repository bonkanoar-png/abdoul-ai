"""Tests for the project domain entity."""

from datetime import UTC, datetime
from uuid import uuid4

import pytest

from app.domain.entities.project import Project
from app.domain.entities.technology import Technology
from app.domain.exceptions.portfolio import InvalidProject

NOW = datetime(2026, 7, 27, tzinfo=UTC)


def build_project(
    *,
    slug: str = "abdoul-ai",
    title: str = "Abdoul AI",
    technologies: tuple[Technology, ...] | None = None,
) -> Project:
    technology = Technology(uuid4(), "Python", "Backend", None, 1, NOW, NOW)
    return Project(
        id=uuid4(),
        profile_id=uuid4(),
        slug=slug,
        title=title,
        description="Public summary.",
        content="Detailed project content.",
        github_url="https://github.com/example/project",
        demo_url="https://example.com",
        image_url=None,
        is_featured=True,
        sort_order=1,
        created_at=NOW,
        updated_at=NOW,
        technologies=(technology,) if technologies is None else technologies,
    )


def test_project_accepts_valid_data_and_immutable_technologies() -> None:
    project = build_project()

    assert project.slug == "abdoul-ai"
    assert isinstance(project.technologies, tuple)
    assert project.technologies[0].name == "Python"


@pytest.mark.parametrize("slug", ["", " "])
def test_project_requires_slug(slug: str) -> None:
    with pytest.raises(InvalidProject):
        build_project(slug=slug)


@pytest.mark.parametrize("title", ["", " "])
def test_project_requires_title(title: str) -> None:
    with pytest.raises(InvalidProject):
        build_project(title=title)
