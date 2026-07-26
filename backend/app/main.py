"""FastAPI application entry point.

Run locally with:
    uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI

from app.api.routes.health import router as health_router
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
    return application


app = create_application()
