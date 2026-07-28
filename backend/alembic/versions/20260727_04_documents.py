"""Add documents.

Revision ID: 20260727_04
Revises: 20260727_03
Create Date: 2026-07-27
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "20260727_04"
down_revision: str | None = "20260727_03"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    """Create the documents table."""
    op.create_table(
        "documents",
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("profile_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("document_type", sa.String(length=50), nullable=False),
        sa.Column("file_name", sa.String(length=255), nullable=False),
        sa.Column("file_url", sa.String(length=2048), nullable=False),
        sa.Column("mime_type", sa.String(length=255), nullable=False),
        sa.Column("file_size", sa.Integer(), nullable=False),
        sa.Column("is_public", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("sort_order", sa.Integer(), server_default=sa.text("0"), nullable=False),
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
        sa.CheckConstraint(
            "document_type IN ('CV', 'PORTFOLIO', 'REPORT', 'CERTIFICATE', 'OTHER')",
            name="ck_documents_supported_type",
        ),
        sa.CheckConstraint("file_size > 0", name="ck_documents_positive_file_size"),
        sa.CheckConstraint("sort_order >= 0", name="ck_documents_non_negative_sort_order"),
        sa.ForeignKeyConstraint(["profile_id"], ["profiles.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    """Remove the documents table."""
    op.drop_table("documents")
