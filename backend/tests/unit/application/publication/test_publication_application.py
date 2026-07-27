"""Tests for publication use case, service, and DTO mapping."""

import asyncio
from datetime import UTC, datetime
from uuid import uuid4

from app.application.services.publication_service import PublicationService
from app.application.use_cases.get_publications import GetPublicationsUseCase
from app.domain.entities.publication import Publication

NOW = datetime(2026, 7, 27, tzinfo=UTC)


class RepositoryStub:
    async def get_publications(self) -> tuple[Publication, ...]:
        return (
            Publication(
                uuid4(),
                "Article",
                "article",
                "Summary",
                "Content",
                None,
                "article",
                NOW,
                0,
                NOW,
                NOW,
            ),
        )


def test_publication_application_flow_maps_dto() -> None:
    use_case = GetPublicationsUseCase(RepositoryStub())
    entities = asyncio.run(use_case.execute())
    result = asyncio.run(PublicationService(use_case).get_public_publications())

    assert entities[0].title == "Article"
    assert result[0].slug == "article"
