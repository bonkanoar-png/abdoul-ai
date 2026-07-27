"""HTTP endpoint for public technologies."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.technology import get_technology_service
from app.api.schemas.technology import TechnologyResponse
from app.application.services.technology_service import TechnologyService

router = APIRouter(prefix="/technologies", tags=["technologies"])


@router.get("", response_model=list[TechnologyResponse])
async def get_technologies(
    service: Annotated[TechnologyService, Depends(get_technology_service)],
) -> list[TechnologyResponse]:
    """Return public technologies in display order."""
    technologies = await service.get_public_technologies()
    return [TechnologyResponse.model_validate(item) for item in technologies]
