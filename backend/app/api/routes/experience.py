"""HTTP endpoint for public experiences."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.experience import get_experience_service
from app.api.schemas.experience import ExperienceResponse
from app.application.services.experience_service import ExperienceService

router = APIRouter(prefix="/experiences", tags=["experiences"])


@router.get("", response_model=list[ExperienceResponse])
async def get_experiences(
    service: Annotated[ExperienceService, Depends(get_experience_service)],
) -> list[ExperienceResponse]:
    """Return public experiences in display order."""
    experiences = await service.get_public_experiences()
    return [ExperienceResponse.model_validate(experience) for experience in experiences]
