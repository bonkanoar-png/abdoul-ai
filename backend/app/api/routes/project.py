"""HTTP endpoint for public projects."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.project import get_project_service
from app.api.schemas.project import ProjectResponse
from app.application.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["projects"])


@router.get("", response_model=list[ProjectResponse])
async def get_projects(
    service: Annotated[ProjectService, Depends(get_project_service)],
) -> list[ProjectResponse]:
    """Return public projects in display order."""
    projects = await service.get_public_projects()
    return [ProjectResponse.model_validate(project) for project in projects]
