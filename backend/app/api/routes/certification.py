"""HTTP endpoint for public certifications."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.dependencies.certification import get_certification_service
from app.api.schemas.certification import CertificationResponse
from app.application.services.certification_service import CertificationService

router = APIRouter(prefix="/certifications", tags=["certifications"])


@router.get("", response_model=list[CertificationResponse])
async def get_certifications(
    service: Annotated[CertificationService, Depends(get_certification_service)],
) -> list[CertificationResponse]:
    certifications = await service.get_public_certifications()
    return [CertificationResponse.model_validate(item) for item in certifications]
