"""Redis-backed JWT denylist."""

from datetime import UTC, datetime
from typing import Any

from redis.asyncio import Redis

from app.core.config import get_settings


class TokenRevocationService:
    def __init__(self, redis: Redis | None = None) -> None:
        settings = get_settings()
        self.redis = redis or Redis(
            host=settings.redis_host, port=settings.redis_port, decode_responses=True
        )

    async def revoke(self, claims: dict[str, Any]) -> None:
        ttl = max(1, int(claims["exp"]) - int(datetime.now(UTC).timestamp()))
        await self.redis.set(f"jwt:blacklist:{claims['jti']}", "1", ex=ttl)

    async def is_revoked(self, jti: str) -> bool:
        return bool(await self.redis.exists(f"jwt:blacklist:{jti}"))
