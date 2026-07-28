"""Unit tests for the initial portfolio SQLAlchemy models."""

from app.infrastructure.database.base import Base
from app.infrastructure.database.models import Experience, Profile, Project, ProjectSkill, Skill


def test_models_are_registered_in_metadata() -> None:
    assert set(Base.metadata.tables) == {
        "certifications",
        "conversations",
        "documents",
        "experiences",
        "formations",
        "messages",
        "profiles",
        "project_skills",
        "projects",
        "publications",
        "skills",
    }


def test_unique_constraints_are_declared_for_project_slug_and_skill_name() -> None:
    assert Project.__table__.c.slug.unique is True
    assert Skill.__table__.c.name.unique is True


def test_project_skill_uses_a_composite_primary_key_and_foreign_keys() -> None:
    assert tuple(ProjectSkill.__table__.primary_key.columns.keys()) == ("project_id", "skill_id")
    assert {foreign_key.target_fullname for foreign_key in ProjectSkill.__table__.foreign_keys} == {
        "projects.id",
        "skills.id",
    }


def test_model_relationships_are_configured() -> None:
    assert Profile.experiences.property.mapper.class_ is Experience
    assert Profile.projects.property.mapper.class_ is Project
    assert Experience.profile.property.mapper.class_ is Profile
    assert Project.skills.property.mapper.class_ is Skill
    assert Skill.projects.property.mapper.class_ is Project
