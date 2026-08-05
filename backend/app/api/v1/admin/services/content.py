"""Business mapping between normalized Admin payloads and portfolio models."""

from datetime import UTC, datetime
from typing import Any
from uuid import UUID

from app.api.v1.admin.repositories.content import AdminContentRepository
from app.api.v1.admin.schemas.content import AdminContent, AdminContentInput


class AdminContentService:
    """Provide consistent CRUD behavior over heterogeneous portfolio tables."""

    def __init__(self, repository: AdminContentRepository, resource: str) -> None:
        self.repository = repository
        self.resource = resource

    def _to_response(self, item: Any) -> AdminContent:
        title = str(
            getattr(item, "title", None)
            or getattr(item, "name", None)
            or getattr(item, "company", None)
            or getattr(item, "institution", "")
        )
        subtitle = (
            getattr(item, "role", None)
            or getattr(item, "degree", None)
            or getattr(item, "issuer", None)
            or ""
        )
        description = (
            getattr(item, "description", None) or getattr(item, "summary", None) or ""
        )
        start_date = getattr(item, "start_date", None) or getattr(
            item, "issued_at", None
        )
        published_at = getattr(item, "published_at", None)
        if start_date is None and published_at is not None:
            start_date = published_at.date()
        category = str(
            getattr(item, "category", None)
            or getattr(item, "publication_type", None)
            or getattr(item, "document_type", "General")
        )
        return AdminContent(
            id=item.id,
            title=title,
            subtitle=subtitle,
            description=description,
            slug=getattr(item, "slug", None),
            start_date=start_date,
            end_date=getattr(item, "end_date", None)
            or getattr(item, "expiration_date", None),
            url=getattr(item, "url", None)
            or getattr(item, "live_url", None)
            or getattr(item, "credential_url", None),
            category=category,
            is_current=getattr(item, "is_current", False),
            is_active=item.is_active,
            sort_order=getattr(item, "sort_order", 0),
        )

    async def list(self) -> list[AdminContent]:
        return [self._to_response(item) for item in await self.repository.list()]

    async def get(self, item_id: UUID) -> AdminContent | None:
        item = await self.repository.get(item_id)
        return None if item is None else self._to_response(item)

    async def create(self, payload: AdminContentInput, actor_id: UUID) -> AdminContent:
        values = await self._values(payload, actor_id, creating=True)
        return self._to_response(await self.repository.add(values))

    async def update(
        self, item_id: UUID, payload: AdminContentInput, actor_id: UUID
    ) -> AdminContent | None:
        item = await self.repository.get(item_id)
        if item is None:
            return None
        values = await self._values(payload, actor_id, creating=False)
        return self._to_response(await self.repository.save(item, values))

    async def archive(self, item_id: UUID, actor_id: UUID) -> bool:
        item = await self.repository.get(item_id)
        if item is None:
            return False
        await self.repository.archive(item, actor_id)
        return True

    async def _values(
        self, data: AdminContentInput, actor_id: UUID, *, creating: bool
    ) -> dict[str, Any]:
        common: dict[str, Any] = {
            "is_active": data.is_active,
            "sort_order": data.sort_order,
            "updated_by": actor_id,
        }
        if creating:
            common["created_by"] = actor_id
        if self.resource == "experiences":
            values = {
                "company": data.title,
                "role": data.subtitle or data.category,
                "description": data.description,
                "start_date": data.start_date or datetime.now(UTC).date(),
                "end_date": data.end_date,
                "is_current": data.is_current,
            }
        elif self.resource == "formations":
            values = {
                "institution": data.title,
                "degree": data.subtitle or data.category,
                "field_of_study": data.category,
                "description": data.description,
                "start_date": data.start_date or datetime.now(UTC).date(),
                "end_date": data.end_date,
                "is_current": data.is_current,
            }
        elif self.resource == "skills":
            values = {"name": data.title, "category": data.category}
        elif self.resource == "projects":
            values = {
                "title": data.title,
                "slug": data.slug or f"project-{datetime.now(UTC).timestamp():.0f}",
                "summary": data.description[:500],
                "description": data.description,
                "live_url": data.url,
                "repository_url": None,
                "image_url": None,
                "is_featured": False,
            }
        elif self.resource == "publications":
            values = {
                "title": data.title,
                "slug": data.slug or f"publication-{datetime.now(UTC).timestamp():.0f}",
                "summary": data.description[:500],
                "content": data.description,
                "url": data.url,
                "publication_type": data.category,
                "published_at": datetime.combine(
                    data.start_date or datetime.now(UTC).date(),
                    datetime.min.time(),
                    tzinfo=UTC,
                ),
            }
        elif self.resource == "certifications":
            values = {
                "name": data.title,
                "issuer": data.subtitle or data.category,
                "credential_url": data.url,
                "issued_at": data.start_date or datetime.now(UTC).date(),
                "expiration_date": data.end_date,
            }
        else:
            values = {
                "title": data.title,
                "description": data.description,
                "document_type": data.category.upper()
                if data.category.upper()
                in {"CV", "PORTFOLIO", "REPORT", "CERTIFICATE", "OTHER"}
                else "OTHER",
                "file_name": data.subtitle or "metadata-only",
                "file_url": data.url or "about:blank",
                "mime_type": "application/octet-stream",
                "file_size": 1,
                "is_public": data.is_active,
            }
        if creating and self.resource in {
            "experiences",
            "formations",
            "projects",
            "documents",
        }:
            values["profile_id"] = await self.repository.profile_id()
        return values | common
