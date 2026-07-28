"""HTTP integration tests for the portfolio endpoint."""

from sqlalchemy.exc import SQLAlchemyError

from app.api.dependencies.database import get_db_session


def test_portfolio_response_over_asgi(
    api_client,
    override_dependency,
    portfolio_entities,
    session_stub_factory,
) -> None:
    profile, experience, project, skill = portfolio_entities
    session = session_stub_factory([profile, [skill]])
    override_dependency(get_db_session, session)

    response = api_client.get("/api/v1/portfolio")

    assert response.status_code == 200
    payload = response.json()
    assert payload["profile"]["id"] == str(profile.id)
    assert payload["experiences"][0]["start_date"] == experience.start_date.isoformat()
    assert payload["projects"][0]["id"] == str(project.id)
    assert payload["projects"][0]["skills"][0]["id"] == str(skill.id)


def test_portfolio_404_over_asgi(
    api_client,
    override_dependency,
    session_stub_factory,
) -> None:
    override_dependency(get_db_session, session_stub_factory([None]))

    response = api_client.get("/api/v1/portfolio")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "RESOURCE_NOT_FOUND",
            "message": "Portfolio not found.",
            "details": None,
        }
    }


def test_portfolio_500_hides_database_details(
    api_client,
    override_dependency,
    session_stub_factory,
) -> None:
    session = session_stub_factory(error=SQLAlchemyError("private database detail"))
    override_dependency(get_db_session, session)

    response = api_client.get("/api/v1/portfolio")

    assert response.status_code == 500
    assert response.json() == {
        "error": {
            "code": "HTTP_ERROR",
            "message": "Unable to load portfolio.",
            "details": None,
        }
    }
    assert "private database detail" not in response.text
