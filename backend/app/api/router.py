"""Central routing composition for the Abdoul AI API."""

from fastapi import APIRouter

from app.api.routes.certification import router as certification_router
from app.api.routes.conversation import router as conversation_router
from app.api.routes.document import router as document_router
from app.api.routes.experience import router as experience_router
from app.api.routes.formation import router as formation_router
from app.api.routes.health import router as health_router
from app.api.routes.portfolio import router as portfolio_router
from app.api.routes.profile import router as profile_router
from app.api.routes.project import router as project_router
from app.api.routes.publication import router as publication_router
from app.api.routes.skill import router as skill_router
from app.api.routes.technology import router as technology_router
from app.api.schemas.common import ErrorResponse


def build_api_router(api_prefix: str) -> APIRouter:
    """Compose health and versioned business routers without side effects."""
    root_router = APIRouter()
    versioned_router = APIRouter(
        prefix=api_prefix,
        responses={
            404: {"model": ErrorResponse, "description": "Resource not found."},
            422: {"model": ErrorResponse, "description": "Request validation failed."},
        },
    )

    root_router.include_router(health_router)
    for router in (
        portfolio_router,
        profile_router,
        experience_router,
        formation_router,
        skill_router,
        project_router,
        technology_router,
        publication_router,
        certification_router,
        document_router,
        conversation_router,
    ):
        versioned_router.include_router(router)

    root_router.include_router(versioned_router)
    return root_router
