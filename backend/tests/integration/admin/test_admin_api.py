"""Security boundary tests for the Admin API."""

from fastapi import status


def test_admin_collection_requires_bearer_token(api_client: object) -> None:
    response = api_client.get("/api/v1/admin/experiences")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json()["error"]["code"] == "HTTP_ERROR"


def test_login_requires_a_valid_payload(api_client: object) -> None:
    response = api_client.request("POST", "/api/v1/auth/login")
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_CONTENT
