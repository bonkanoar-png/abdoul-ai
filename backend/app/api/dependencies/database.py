"""Future FastAPI dependency for database sessions."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.session import async_session_factory


async def get_db_session() -> AsyncGenerator[AsyncSession]:
    """Yield an AsyncSession and close it after the request lifecycle."""
    async with async_session_factory() as session:
        yield session
