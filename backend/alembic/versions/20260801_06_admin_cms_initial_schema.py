"""Add the initial Admin CMS authentication and audit schema.

Revision ID: 20260801_06
Revises: 20260727_05
Create Date: 2026-08-01
"""

from collections.abc import Sequence

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

from alembic import op

revision: str = "20260801_06"
down_revision: str | None = "20260727_05"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

CONTENT_TABLES = (
    "profiles",
    "experiences",
    "formations",
    "skills",
    "projects",
    "publications",
    "certifications",
    "documents",
)


def upgrade() -> None:
    """Create admin identities and add soft-delete/audit fields to CMS content."""
    role = postgresql.ENUM("ADMIN", "EDITOR", name="admin_role", create_type=False)
    role.create(op.get_bind(), checkfirst=True)
    op.create_table(
        "user_admins",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("email", sa.String(320), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", role, nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_user_admins_email", "user_admins", ["email"])
    for table in CONTENT_TABLES:
        op.add_column(
            table,
            sa.Column(
                "is_active",
                sa.Boolean(),
                server_default=sa.text("true"),
                nullable=False,
            ),
        )
        op.add_column(
            table, sa.Column("created_by", postgresql.UUID(as_uuid=True), nullable=True)
        )
        op.add_column(
            table, sa.Column("updated_by", postgresql.UUID(as_uuid=True), nullable=True)
        )
        op.create_index(f"ix_{table}_is_active", table, ["is_active"])


def downgrade() -> None:
    """Remove Admin CMS fields and identities."""
    for table in reversed(CONTENT_TABLES):
        op.drop_index(f"ix_{table}_is_active", table_name=table)
        op.drop_column(table, "updated_by")
        op.drop_column(table, "created_by")
        op.drop_column(table, "is_active")
    op.drop_index("ix_user_admins_email", table_name="user_admins")
    op.drop_table("user_admins")
    postgresql.ENUM(name="admin_role").drop(op.get_bind(), checkfirst=True)
