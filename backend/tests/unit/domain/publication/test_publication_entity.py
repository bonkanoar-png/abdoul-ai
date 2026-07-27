"""Tests for the publication domain entity."""

from datetime import UTC, datetime
from uuid import uuid4

import pytest

from app.domain.entities.publication import Publication
from app.domain.exceptions.portfolio import InvalidPublication

NOW = datetime(2026, 7, 27, tzinfo=UTC)


def build_publication(
    *, title: str = "Article", slug: str = "article", url: str | None = None, sort_order: int = 0
) -> Publication:
    return Publication(
        uuid4(),
        title,
        slug,
        "Summary",
        "Content",
        url,
        "article",
        NOW,
        sort_order,
        NOW,
        NOW,
    )


def test_publication_accepts_valid_data() -> None:
    assert build_publication(url="https://example.com/article").title == "Article"


def test_publication_requires_title() -> None:
    with pytest.raises(InvalidPublication):
        build_publication(title=" ")


def test_publication_requires_slug() -> None:
    with pytest.raises(InvalidPublication):
        build_publication(slug="")


def test_publication_rejects_invalid_url() -> None:
    with pytest.raises(InvalidPublication):
        build_publication(url="javascript:alert(1)")


def test_publication_rejects_negative_sort_order() -> None:
    with pytest.raises(InvalidPublication):
        build_publication(sort_order=-1)
