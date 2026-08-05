"""Safe media-to-content association service."""

from uuid import UUID

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

ASSOCIATIONS = {
    "projects": ("project_media", "project_id"),
    "experiences": ("experience_media", "experience_id"),
    "formations": ("formation_media", "formation_id"),
    "certifications": ("certification_media", "certification_id"),
}


class MediaAssociationService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def attach(
        self, resource: str, content_id: UUID, media_id: UUID, sort_order: int
    ) -> None:
        table, column = ASSOCIATIONS[resource]
        content = await self.session.scalar(
            text(f"SELECT id FROM {resource} WHERE id=:id AND is_active=true"),
            {"id": content_id},
        )
        media = await self.session.scalar(
            text("SELECT id FROM media WHERE id=:id AND is_active=true"),
            {"id": media_id},
        )
        if content is None or media is None:
            raise ValueError("Content or media not found in this portfolio.")
        await self.session.execute(
            text(
                f"INSERT INTO {table} ({column}, media_id, sort_order) VALUES (:content_id,:media_id,:sort_order) ON CONFLICT ({column}, media_id) DO UPDATE SET sort_order=:sort_order"
            ),
            {"content_id": content_id, "media_id": media_id, "sort_order": sort_order},
        )

    async def detach(self, resource: str, content_id: UUID, media_id: UUID) -> bool:
        table, column = ASSOCIATIONS[resource]
        result = await self.session.execute(
            text(
                f"DELETE FROM {table} WHERE {column}=:content_id AND media_id=:media_id"
            ),
            {"content_id": content_id, "media_id": media_id},
        )
        return bool(getattr(result, "rowcount", 0))

    async def list(self, resource: str, content_id: UUID) -> list[dict[str, object]]:
        table, column = ASSOCIATIONS[resource]
        result = await self.session.execute(
            text(
                f"SELECT m.id,m.url,m.alt_text,a.sort_order FROM {table} a JOIN media m ON m.id=a.media_id WHERE a.{column}=:content_id AND m.is_active=true ORDER BY a.sort_order,m.created_at"
            ),
            {"content_id": content_id},
        )
        return [dict(row._mapping) for row in result]
