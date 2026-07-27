"""SQLAlchemy repository for public projects."""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.domain.entities.project import Project
from app.domain.repositories.project import ProjectRepository
from app.infrastructure.database.mappers.project_mapper import ProjectMapper
from app.infrastructure.database.models.project import Project as ProjectModel


class SQLAlchemyProjectRepository(ProjectRepository):
    """Load projects and technologies through SQLAlchemy async APIs."""

    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_projects(self) -> tuple[Project, ...]:
        statement = (
            select(ProjectModel)
            .options(selectinload(ProjectModel.skills))
            .order_by(ProjectModel.sort_order.asc(), ProjectModel.created_at.desc())
        )
        result = await self._session.execute(statement)
        return tuple(ProjectMapper.to_domain(model) for model in result.scalars().all())
