"""Unit tests for public portfolio response schemas."""

from datetime import UTC, date, datetime
from uuid import UUID, uuid4

from app.api.schemas.portfolio import (
    ExperienceSchema,
    PortfolioResponse,
    ProfileSchema,
    ProjectSchema,
    SkillSchema,
)


def test_portfolio_schema_serializes_uuid_dates_and_nested_skills() -> None:
    now = datetime(2026, 7, 27, 10, 30, tzinfo=UTC)
    profile_id = uuid4()
    skill_id = uuid4()
    project_id = uuid4()

    payload = PortfolioResponse(
        profile=ProfileSchema(
            id=profile_id,
            name="Abdoul",
            title="AI Engineer",
            bio="Portfolio",
            location="France",
            email="contact@example.com",
            github_url=None,
            linkedin_url=None,
            avatar_url=None,
            created_at=now,
            updated_at=now,
        ),
        experiences=[
            ExperienceSchema(
                id=uuid4(),
                profile_id=profile_id,
                company="Abdoul AI",
                role="AI Engineer",
                description="Conception.",
                start_date=date(2024, 1, 1),
                end_date=None,
                is_current=True,
                sort_order=1,
                created_at=now,
                updated_at=now,
            )
        ],
        projects=[
            ProjectSchema(
                id=project_id,
                profile_id=profile_id,
                slug="abdoul-ai",
                title="Abdoul AI",
                summary="Portfolio",
                description="Portfolio intelligent.",
                repository_url=None,
                live_url=None,
                image_url=None,
                is_featured=True,
                sort_order=1,
                created_at=now,
                updated_at=now,
                skills=[
                    SkillSchema(
                        id=skill_id,
                        name="Python",
                        category="Backend",
                        sort_order=1,
                        created_at=now,
                        updated_at=now,
                    )
                ],
            )
        ],
        skills=[
            SkillSchema(
                id=skill_id,
                name="Python",
                category="Backend",
                sort_order=1,
                created_at=now,
                updated_at=now,
            )
        ],
    )

    serialized = payload.model_dump(mode="json")
    assert UUID(serialized["profile"]["id"]) == profile_id
    assert serialized["experiences"][0]["start_date"] == "2024-01-01"
    assert serialized["projects"][0]["id"] == str(project_id)
    assert serialized["projects"][0]["skills"][0]["id"] == str(skill_id)
    assert serialized["profile"]["created_at"].endswith("Z")
