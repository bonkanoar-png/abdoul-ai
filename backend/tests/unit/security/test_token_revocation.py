"""Redis denylist behavior tests."""

import asyncio
from datetime import UTC, datetime

from app.security.token_revocation import TokenRevocationService


class FakeRedis:
    def __init__(self) -> None:
        self.values: dict[str, str] = {}
        self.ttl = 0

    async def set(self, key: str, value: str, *, ex: int) -> None:
        self.values[key] = value
        self.ttl = ex

    async def exists(self, key: str) -> int:
        return int(key in self.values)


def test_token_is_revoked_with_expiration() -> None:
    redis = FakeRedis()
    service = TokenRevocationService(redis)  # type: ignore[arg-type]
    claims = {"jti": "token-id", "exp": int(datetime.now(UTC).timestamp()) + 60}
    asyncio.run(service.revoke(claims))
    assert asyncio.run(service.is_revoked("token-id"))
    assert 1 <= redis.ttl <= 60
