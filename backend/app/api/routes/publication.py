"""HTTP endpoint for public publications."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.publication import get_publication_service
from app.api.schemas.publication import PublicationResponse
from app.application.services.publication_service import PublicationService

router = APIRouter(prefix="/publications", tags=["publications"])


@router.get("", response_model=list[PublicationResponse])
async def get_publications(
    service: Annotated[PublicationService, Depends(get_publication_service)],
) -> list[PublicationResponse]:
    publications = await service.get_public_publications()
    return [PublicationResponse.model_validate(item) for item in publications]
