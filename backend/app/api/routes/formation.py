"""HTTP endpoint for public formations."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.formation import get_formation_service
from app.api.schemas.formation import FormationResponse
from app.application.services.formation_service import FormationService

router = APIRouter(prefix="/formations", tags=["formations"])


@router.get("", response_model=list[FormationResponse])
async def get_formations(
    service: Annotated[FormationService, Depends(get_formation_service)],
) -> list[FormationResponse]:
    formations = await service.get_public_formations()
    return [FormationResponse.model_validate(item) for item in formations]
