"""SQLAlchemy repository used by protected Admin CMS services."""

from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.infrastructure.database.models import (
    Certification,
    Document,
    Experience,
    Formation,
    Profile,
    Project,
    Publication,
    Skill,
)

Model = type[
    Experience | Formation | Skill | Project | Publication | Certification | Document
]
MODELS: dict[str, Model] = {
    "experiences": Experience,
    "formations": Formation,
    "skills": Skill,
    "projects": Project,
    "publications": Publication,
    "certifications": Certification,
    "documents": Document,
}


class AdminContentRepository:
    """Persist admin content; services remain responsible for field mapping."""

    def __init__(self, session: AsyncSession, resource: str) -> None:
        self.session = session
        self.model = MODELS[resource]

    async def list(self) -> list[Any]:
        result = await self.session.scalars(
            select(self.model)
            .where(self.model.is_active.is_(True))
            .order_by(self.model.created_at.desc())
        )
        return list(result.all())

    async def get(self, item_id: UUID) -> Any | None:
        return await self.session.scalar(
            select(self.model).where(self.model.id == item_id)
        )

    async def profile_id(self) -> UUID:
        profile_id = await self.session.scalar(
            select(Profile.id).order_by(Profile.created_at).limit(1)
        )
        if profile_id is None:
            raise ValueError("A profile must exist before creating associated content.")
        return profile_id

    async def add(self, values: dict[str, Any]) -> Any:
        item = self.model(**values)
        self.session.add(item)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def save(self, item: Any, values: dict[str, Any]) -> Any:
        for key, value in values.items():
            setattr(item, key, value)
        await self.session.commit()
        await self.session.refresh(item)
        return item

    async def archive(self, item: Any, actor_id: UUID) -> None:
        item.is_active = False
        item.updated_by = actor_id
        await self.session.commit()
