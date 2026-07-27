"""FastAPI application entry point.

Run locally with:
    uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI

from app.api.routes.experience import router as experience_router
from app.api.routes.health import router as health_router
from app.api.routes.portfolio import router as portfolio_router
from app.api.routes.profile import router as profile_router
from app.api.routes.skill import router as skill_router
from app.core.config import get_settings


def create_application() -> FastAPI:
    """Build the application shell; routers are added by subsequent lots."""
    settings = get_settings()
    application = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="Abdoul AI API.",
        debug=settings.debug,
    )
    application.include_router(health_router)
    application.include_router(portfolio_router, prefix=settings.api_v1_prefix)
    application.include_router(profile_router, prefix=settings.api_v1_prefix)
    application.include_router(experience_router, prefix=settings.api_v1_prefix)
    application.include_router(skill_router, prefix=settings.api_v1_prefix)
    return application


app = create_application()
