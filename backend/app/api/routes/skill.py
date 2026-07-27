"""HTTP endpoint for public skills."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.skill import get_skill_service
from app.api.schemas.skill import SkillResponse
from app.application.services.skill_service import SkillService

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("", response_model=list[SkillResponse])
async def get_skills(
    service: Annotated[SkillService, Depends(get_skill_service)],
) -> list[SkillResponse]:
    """Return public skills in display order."""
    skills = await service.get_public_skills()
    return [SkillResponse.model_validate(skill) for skill in skills]
