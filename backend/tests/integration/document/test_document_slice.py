"""PostgreSQL and HTTP tests for public documents."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, datetime
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.api.dependencies.document import get_document_service
from app.application.dto.document import DocumentDTO
from app.domain.entities.document import Document, DocumentType
from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Document as DocumentModel
from app.infrastructure.database.models import Profile
from app.infrastructure.database.repositories.document_repository import (
    SQLAlchemyDocumentRepository,
)

NOW = datetime(2026, 7, 28, 10, 30, tzinfo=UTC)


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
    def __init__(self, items: tuple[DocumentDTO, ...]) -> None:
        self.items = items

    async def get_public_documents(self) -> tuple[DocumentDTO, ...]:
        return self.items


def build_dto() -> DocumentDTO:
    return DocumentDTO(
        uuid4(),
        uuid4(),
        "CV Data Scientist",
        "Public CV.",
        DocumentType.CV,
        "cv.pdf",
        "https://example.com/cv.pdf",
        "application/pdf",
        1024,
        True,
        1,
        NOW,
        NOW,
    )


def test_repository_maps_orders_and_filters_documents() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            profile = Profile(
                name="Abdoul",
                title="Engineer",
                bio="Build products.",
                location="France",
                email="contact@example.com",
            )
            session.add(profile)
            await session.flush()
            session.add_all(
                [
                    DocumentModel(
                        profile_id=profile.id,
                        title="Second",
                        description="Second document.",
                        document_type="REPORT",
                        file_name="second.pdf",
                        file_url="https://example.com/second.pdf",
                        mime_type="application/pdf",
                        file_size=2048,
                        is_public=True,
                        sort_order=2,
                    ),
                    DocumentModel(
                        profile_id=profile.id,
                        title="First",
                        description="First document.",
                        document_type="CV",
                        file_name="first.pdf",
                        file_url="https://example.com/first.pdf",
                        mime_type="application/pdf",
                        file_size=1024,
                        is_public=True,
                        sort_order=1,
                    ),
                    DocumentModel(
                        profile_id=profile.id,
                        title="Private",
                        description="Private document.",
                        document_type="OTHER",
                        file_name="private.pdf",
                        file_url="https://example.com/private.pdf",
                        mime_type="application/pdf",
                        file_size=512,
                        is_public=False,
                        sort_order=0,
                    ),
                ]
            )
            await session.commit()
            session.sync_session.expunge_all()

            result = await SQLAlchemyDocumentRepository(session).get_documents()

            assert all(isinstance(item, Document) for item in result)
            assert [item.title for item in result] == ["First", "Second"]
            assert result[0].document_type is DocumentType.CV

    asyncio.run(scenario())


def test_endpoint_returns_documents(api_client, override_dependency) -> None:
    override_dependency(get_document_service, StubService((build_dto(),)))
    response = api_client.get("/api/v1/documents")

    assert response.status_code == 200
    assert response.json()[0]["document_type"] == "CV"
    assert response.json()[0]["file_url"] == "https://example.com/cv.pdf"


def test_endpoint_returns_empty_list(api_client, override_dependency) -> None:
    override_dependency(get_document_service, StubService(()))
    response = api_client.get("/api/v1/documents")

    assert response.status_code == 200
    assert response.json() == []
