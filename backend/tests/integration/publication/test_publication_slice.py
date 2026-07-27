"""PostgreSQL and HTTP tests for public publications."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.api.dependencies.publication import get_publication_service
from app.application.dto.publication import PublicationDTO
from app.domain.entities.publication import Publication
from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Publication as PublicationModel
from app.infrastructure.database.repositories.publication_repository import (
    SQLAlchemyPublicationRepository,
)

NOW = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)


@asynccontextmanager
async def isolated_postgres_session() -> AsyncIterator[AsyncSession]:
    database_url = os.getenv("TEST_DATABASE_URL")
    if not database_url:
        pytest.skip("TEST_DATABASE_URL is required for PostgreSQL integration tests.")
    schema = f"test_{uuid4().hex}"
    engine = create_async_engine(
        database_url, execution_options={"schema_translate_map": {None: schema}}
    )
    try:
        async with engine.begin() as connection:
            await connection.execute(CreateSchema(schema))
            await connection.run_sync(Base.metadata.create_all)
        session_factory = async_sessionmaker(engine, expire_on_commit=False)
        async with session_factory() as session:
            yield session
    finally:
        async with engine.begin() as connection:
            await connection.execute(DropSchema(schema, cascade=True))
        await engine.dispose()


class StubService:
    def __init__(self, items: tuple[PublicationDTO, ...]) -> None:
        self.items = items

    async def get_public_publications(self) -> tuple[PublicationDTO, ...]:
        return self.items


def build_dto() -> PublicationDTO:
    return PublicationDTO(
        uuid4(), "Article", "article", "Summary", "Content", None, "article", NOW, 1, NOW, NOW
    )


def test_repository_maps_and_orders_publications() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            session.add_all(
                [
                    PublicationModel(
                        title="Second",
                        slug="second",
                        summary="Summary",
                        content="Content",
                        publication_type="article",
                        published_at=NOW,
                        sort_order=2,
                    ),
                    PublicationModel(
                        title="First",
                        slug="first",
                        summary="Summary",
                        content="Content",
                        publication_type="article",
                        published_at=NOW,
                        sort_order=1,
                    ),
                ]
            )
            await session.commit()
            session.sync_session.expunge_all()

            result = await SQLAlchemyPublicationRepository(session).get_publications()

            assert all(isinstance(item, Publication) for item in result)
            assert [item.title for item in result] == ["First", "Second"]

    asyncio.run(scenario())


def test_endpoint_returns_publications(api_client, override_dependency) -> None:
    override_dependency(get_publication_service, StubService((build_dto(),)))
    response = api_client.get("/api/v1/publications")

    assert response.status_code == 200
    assert response.json()[0]["title"] == "Article"


def test_endpoint_returns_empty_list(api_client, override_dependency) -> None:
    override_dependency(get_publication_service, StubService(()))
    response = api_client.get("/api/v1/publications")

    assert response.status_code == 200
    assert response.json() == []
