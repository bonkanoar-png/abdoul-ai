"""Tests for the certification domain entity."""

from datetime import UTC, date, datetime
from uuid import uuid4

import pytest

from app.domain.entities.certification import Certification
from app.domain.exceptions.portfolio import InvalidCertification

NOW = datetime(2026, 7, 27, tzinfo=UTC)


def build_certification(
    *,
    name: str = "Cloud Engineer",
    issuer: str = "Provider",
    expiration_date: date | None = date(2027, 1, 1),
) -> Certification:
    return Certification(
        uuid4(),
        name,
        issuer,
        "https://example.com/credential",
        date(2026, 1, 1),
        expiration_date,
        0,
        NOW,
        NOW,
    )


def test_certification_accepts_coherent_dates() -> None:
    assert build_certification().issuer == "Provider"


def test_certification_requires_name() -> None:
    with pytest.raises(InvalidCertification):
        build_certification(name=" ")


def test_certification_requires_issuer() -> None:
    with pytest.raises(InvalidCertification):
        build_certification(issuer="")


def test_certification_rejects_expiration_before_issue() -> None:
    with pytest.raises(InvalidCertification):
        build_certification(expiration_date=date(2025, 12, 31))
