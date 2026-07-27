"""HTTP endpoint for the public profile vertical slice."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.dependencies.profile import get_profile_service
from app.api.schemas.profile import ProfileResponse
from app.application.services.profile_service import ProfileService

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=ProfileResponse)
async def get_profile(
    service: Annotated[ProfileService, Depends(get_profile_service)],
) -> ProfileResponse:
    """Return the configured public profile."""
    profile = await service.get_public_profile()
    if profile is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found.",
        )
    return ProfileResponse.model_validate(profile)
