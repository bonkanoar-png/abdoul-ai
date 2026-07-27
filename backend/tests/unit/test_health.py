"""Unit tests for health endpoints."""

from app.api.routes import health


def test_liveness_returns_ok(api_client) -> None:
    response = api_client.get("/health/live")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readiness_returns_ok_when_dependencies_are_available(api_client, monkeypatch) -> None:
    async def available() -> bool:
        return True

    monkeypatch.setattr(health, "check_postgres", available)
    monkeypatch.setattr(health, "check_redis", available)

    response = api_client.get("/health/ready")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "services": {"postgres": "ok", "redis": "ok"},
    }


def test_readiness_returns_service_unavailable_when_a_dependency_fails(
    api_client,
    monkeypatch,
) -> None:
    async def postgres_unavailable() -> bool:
        return False

    async def redis_available() -> bool:
        return True

    monkeypatch.setattr(health, "check_postgres", postgres_unavailable)
    monkeypatch.setattr(health, "check_redis", redis_available)

    response = api_client.get("/health/ready")

    assert response.status_code == 503
    assert response.json() == {
        "status": "unavailable",
        "services": {"postgres": "unavailable", "redis": "ok"},
    }
