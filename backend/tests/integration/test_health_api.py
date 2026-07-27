"""HTTP integration tests for health endpoints."""

from app.api.routes import health


def test_liveness_over_asgi(api_client) -> None:
    response = api_client.get("/health/live")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_readiness_over_asgi_when_services_are_available(
    api_client,
    monkeypatch,
) -> None:
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
