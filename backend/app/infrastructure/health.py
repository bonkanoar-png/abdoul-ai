"""Minimal availability checks for infrastructure dependencies."""

import asyncio

import asyncpg
from redis.asyncio import Redis
from redis.exceptions import RedisError

from app.core.config import get_settings


async def check_postgres() -> bool:
    """Return whether PostgreSQL accepts a minimal connection and query."""
    settings = get_settings()
    connection: asyncpg.Connection | None = None

    try:
        connection = await asyncpg.connect(
            host=settings.postgres_host,
            port=settings.postgres_port,
            user=settings.postgres_user,
            password=settings.postgres_password.get_secret_value(),
            database=settings.postgres_db,
            timeout=settings.healthcheck_timeout_seconds,
        )
        await connection.execute("SELECT 1")
        return True
    except (OSError, asyncio.TimeoutError, asyncpg.PostgresError):
        return False
    finally:
        if connection is not None:
            await connection.close()


async def check_redis() -> bool:
    """Return whether Redis responds to a PING command."""
    settings = get_settings()
    client = Redis(
        host=settings.redis_host,
        port=settings.redis_port,
        socket_connect_timeout=settings.healthcheck_timeout_seconds,
        socket_timeout=settings.healthcheck_timeout_seconds,
    )

    try:
        return bool(await client.ping())
    except (OSError, asyncio.TimeoutError, RedisError):
        return False
    finally:
        await client.aclose()
