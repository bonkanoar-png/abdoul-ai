"""Integration tests for industrialized API infrastructure."""

from app.api.dependencies.conversation import get_message_service

EXPECTED_VERSIONED_PATHS = {
    "/api/v1/portfolio",
    "/api/v1/profile",
    "/api/v1/experiences",
    "/api/v1/formations",
    "/api/v1/skills",
    "/api/v1/projects",
    "/api/v1/technologies",
    "/api/v1/publications",
    "/api/v1/certifications",
    "/api/v1/documents",
    "/api/v1/conversations",
    "/api/v1/conversations/{conversation_id}/messages",
}


def test_unknown_route_uses_stable_error_envelope(api_client) -> None:
    response = api_client.get("/api/v1/unknown")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "RESOURCE_NOT_FOUND",
            "message": "Not Found",
            "details": None,
        }
    }


def test_invalid_uuid_uses_validation_error_envelope(api_client, override_dependency) -> None:
    override_dependency(get_message_service, object())
    response = api_client.get("/api/v1/conversations/not-a-uuid/messages")

    assert response.status_code == 422
    payload = response.json()
    assert payload["error"]["code"] == "VALIDATION_ERROR"
    assert payload["error"]["message"] == "Request validation failed."
    assert payload["error"]["details"][0]["location"] == ["path", "conversation_id"]


def test_openapi_exposes_all_existing_endpoints(api_client) -> None:
    response = api_client.get("/openapi.json")

    assert response.status_code == 200
    paths = set(response.json()["paths"])
    assert paths >= EXPECTED_VERSIONED_PATHS
    assert paths >= {"/health", "/health/live", "/health/ready"}


def test_interactive_documentation_is_available(api_client) -> None:
    docs = api_client.get("/docs")
    redoc = api_client.get("/redoc")

    assert docs.status_code == 200
    assert "text/html" in docs.headers["content-type"]
    assert redoc.status_code == 200
    assert "text/html" in redoc.headers["content-type"]


def test_security_headers_are_attached_to_responses(api_client) -> None:
    response = api_client.get("/health/live")

    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["referrer-policy"] == "strict-origin-when-cross-origin"
    assert response.headers["permissions-policy"] == "camera=(), microphone=(), geolocation=()"


def test_cors_allows_configured_frontend_origin(api_client) -> None:
    response = api_client.options(
        "/api/v1/profile",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
