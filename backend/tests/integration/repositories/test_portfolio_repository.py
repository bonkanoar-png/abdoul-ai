"""PostgreSQL integration tests for the portfolio repository."""

import asyncio
import os
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from datetime import date
from uuid import uuid4

import pytest
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.schema import CreateSchema, DropSchema

from app.domain.entities.portfolio import Portfolio
from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Experience, Profile, Project, Skill
from app.infrastructure.database.repositories.portfolio_repository import (
    SQLAlchemyPortfolioRepository,
)


@asynccontextmanager
async def isolated_postgres_session() -> AsyncIterator[AsyncSession]:
    database_url = os.getenv("TEST_DATABASE_URL")
    if not database_url:
        pytest.skip("TEST_DATABASE_URL is required for PostgreSQL integration tests.")

    schema = f"test_{uuid4().hex}"
    engine = create_async_engine(
        database_url,
        execution_options={"schema_translate_map": {None: schema}},
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


async def persist_portfolio(session: AsyncSession) -> None:
    profile = Profile(
        name="Abdoul",
        title="Backend Engineer",
        bio="I build reliable products.",
        location="France",
        email="contact@example.com",
    )
    experience = Experience(
        company="Abdoul AI",
        role="Backend Engineer",
        description="Build reliable products.",
        start_date=date(2024, 1, 1),
        end_date=None,
        is_current=True,
        sort_order=1,
    )
    first_skill = Skill(name="Python", category="Backend", sort_order=1)
    second_skill = Skill(name="PostgreSQL", category="Database", sort_order=2)
    project = Project(
        slug="abdoul-ai",
        title="Abdoul AI",
        summary="A clear product foundation.",
        description="A portfolio built with explicit boundaries.",
        is_featured=True,
        sort_order=1,
        skills=[second_skill, first_skill],
    )
    profile.experiences = [experience]
    profile.projects = [project]
    session.add(profile)
    await session.commit()
    session.sync_session.expunge_all()


def test_repository_returns_none_when_portfolio_is_absent() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            repository = SQLAlchemyPortfolioRepository(session)

            assert await repository.get_portfolio() is None

    asyncio.run(scenario())


def test_repository_returns_a_domain_portfolio() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            await persist_portfolio(session)
            repository = SQLAlchemyPortfolioRepository(session)

            portfolio = await repository.get_portfolio()

            assert isinstance(portfolio, Portfolio)
            assert portfolio.name == "Abdoul"
            assert portfolio.email == "contact@example.com"

    asyncio.run(scenario())


def test_repository_loads_and_maps_all_relations() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            await persist_portfolio(session)
            repository = SQLAlchemyPortfolioRepository(session)

            portfolio = await repository.get_portfolio()

            assert portfolio is not None
            assert portfolio.experiences[0].company == "Abdoul AI"
            assert portfolio.projects[0].slug == "abdoul-ai"
            assert [skill.name for skill in portfolio.projects[0].skills] == [
                "Python",
                "PostgreSQL",
            ]

    asyncio.run(scenario())


def test_repository_maps_global_skills_in_display_order() -> None:
    async def scenario() -> None:
        async with isolated_postgres_session() as session:
            await persist_portfolio(session)
            repository = SQLAlchemyPortfolioRepository(session)

            portfolio = await repository.get_portfolio()

            assert portfolio is not None
            assert [skill.name for skill in portfolio.skills] == ["Python", "PostgreSQL"]
            assert portfolio.skills[0].category == "Backend"

    asyncio.run(scenario())
