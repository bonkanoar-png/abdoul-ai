"""Finalize CMS storage, audit, media and advanced relations.

Revision ID: 20260801_07
Revises: 20260801_06
Create Date: 2026-08-01
"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "20260801_07"
down_revision: str | None = "20260801_06"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _association(name: str, left: str, right: str) -> None:
    singular = {"media": "media", "technologies": "technology"}
    left_key = singular.get(left, left[:-1])
    right_key = singular.get(right, right[:-1])
    op.create_table(
        name,
        sa.Column(f"{left_key}_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(f"{right_key}_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("sort_order", sa.Integer(), server_default="0", nullable=False),
        sa.ForeignKeyConstraint(
            [f"{left_key}_id"], [f"{left}.id"], ondelete="RESTRICT"
        ),
        sa.ForeignKeyConstraint(
            [f"{right_key}_id"], [f"{right}.id"], ondelete="RESTRICT"
        ),
        sa.PrimaryKeyConstraint(f"{left_key}_id", f"{right_key}_id"),
    )


def upgrade() -> None:
    """Add professional CMS persistence without destructive cascades."""
    op.add_column(
        "documents", sa.Column("original_name", sa.String(255), nullable=True)
    )
    op.add_column(
        "documents", sa.Column("storage_path", sa.String(2048), nullable=True)
    )
    op.add_column(
        "documents",
        sa.Column("uploaded_by", postgresql.UUID(as_uuid=True), nullable=True),
    )
    op.create_foreign_key(
        "fk_documents_uploaded_by",
        "documents",
        "user_admins",
        ["uploaded_by"],
        ["id"],
        ondelete="RESTRICT",
    )
    op.create_table(
        "technologies",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("name", sa.String(255), nullable=False),
        sa.Column("category", sa.String(255), server_default="General", nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_table(
        "media",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("filename", sa.String(255), nullable=False),
        sa.Column("url", sa.String(2048), nullable=False),
        sa.Column("storage_path", sa.String(2048), nullable=False),
        sa.Column("mime_type", sa.String(100), nullable=False),
        sa.Column("size", sa.Integer(), nullable=False),
        sa.Column("alt_text", sa.String(500), server_default="", nullable=False),
        sa.Column("uploaded_by", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column(
            "is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False
        ),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["uploaded_by"], ["user_admins.id"], ondelete="RESTRICT"
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("filename"),
    )
    op.create_table(
        "audit_logs",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("actor_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("actor_email", sa.String(320), nullable=False),
        sa.Column("action", sa.String(32), nullable=False),
        sa.Column("resource", sa.String(100), nullable=False),
        sa.Column("resource_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("old_value", postgresql.JSONB(), nullable=True),
        sa.Column("new_value", postgresql.JSONB(), nullable=True),
        sa.Column("ip_address", postgresql.INET(), nullable=True),
        sa.Column("user_agent", sa.String(512), nullable=True),
        sa.Column("request_id", sa.String(128), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    for column in ("actor_id", "action", "resource", "request_id", "created_at"):
        op.create_index(f"ix_audit_logs_{column}", "audit_logs", [column])
    for name, left, right in (
        ("experience_skills", "experiences", "skills"),
        ("experience_technologies", "experiences", "technologies"),
        ("project_technologies", "projects", "technologies"),
        ("project_media", "projects", "media"),
        ("experience_media", "experiences", "media"),
        ("formation_media", "formations", "media"),
        ("certification_media", "certifications", "media"),
    ):
        _association(name, left, right)


def downgrade() -> None:
    """Remove CMS finalization objects in reverse dependency order."""
    for table in (
        "certification_media",
        "formation_media",
        "experience_media",
        "project_media",
        "project_technologies",
        "experience_technologies",
        "experience_skills",
    ):
        op.drop_table(table)
    op.drop_table("audit_logs")
    op.drop_table("media")
    op.drop_table("technologies")
    op.drop_constraint("fk_documents_uploaded_by", "documents", type_="foreignkey")
    op.drop_column("documents", "uploaded_by")
    op.drop_column("documents", "storage_path")
    op.drop_column("documents", "original_name")
