"""PostgreSQL and HTTP tests for public certifications."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import UTC, date, datetime
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.api.dependencies.certification import get_certification_service
from app.application.dto.certification import CertificationDTO
from app.domain.entities.certification import Certification
from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Certification as CertificationModel
from app.infrastructure.database.repositories.certification_repository import (
    SQLAlchemyCertificationRepository,
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
    def __init__(self, items: tuple[CertificationDTO, ...]) -> None:
        self.items = items

    async def get_public_certifications(self) -> tuple[CertificationDTO, ...]:
        return self.items


def build_dto() -> CertificationDTO:
    return CertificationDTO(uuid4(), "Cloud", "Provider", None, date(2026, 1, 1), None, 1, NOW, NOW)


def test_repository_maps_and_orders_certifications() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            session.add_all(
                [
                    CertificationModel(
                        name="Second",
                        issuer="Provider",
                        issued_at=date(2025, 1, 1),
                        sort_order=2,
                    ),
                    CertificationModel(
                        name="First",
                        issuer="Provider",
                        issued_at=date(2026, 1, 1),
                        sort_order=1,
                    ),
                ]
            )
            await session.commit()
            session.sync_session.expunge_all()

            result = await SQLAlchemyCertificationRepository(session).get_certifications()

            assert all(isinstance(item, Certification) for item in result)
            assert [item.name for item in result] == ["First", "Second"]

    asyncio.run(scenario())


def test_endpoint_returns_certifications(api_client, override_dependency) -> None:
    override_dependency(get_certification_service, StubService((build_dto(),)))
    response = api_client.get("/api/v1/certifications")

    assert response.status_code == 200
    assert response.json()[0]["name"] == "Cloud"


def test_endpoint_returns_empty_list(api_client, override_dependency) -> None:
    override_dependency(get_certification_service, StubService(()))
    response = api_client.get("/api/v1/certifications")

    assert response.status_code == 200
    assert response.json() == []
