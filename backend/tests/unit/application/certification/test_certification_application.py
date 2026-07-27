"""Tests for certification use case, service, and DTO mapping."""

import asyncio
from datetime import UTC, date, datetime
from uuid import uuid4

from app.application.services.certification_service import CertificationService
from app.application.use_cases.get_certifications import GetCertificationsUseCase
from app.domain.entities.certification import Certification

NOW = datetime(2026, 7, 27, tzinfo=UTC)


class RepositoryStub:
    async def get_certifications(self) -> tuple[Certification, ...]:
        return (
            Certification(uuid4(), "Cloud", "Provider", None, date(2026, 1, 1), None, 0, NOW, NOW),
        )


def test_certification_application_flow_maps_dto() -> None:
    use_case = GetCertificationsUseCase(RepositoryStub())
    entities = asyncio.run(use_case.execute())
    result = asyncio.run(CertificationService(use_case).get_public_certifications())

    assert entities[0].name == "Cloud"
    assert result[0].issuer == "Provider"
