"""FastAPI application entry point.

Run locally with:
    uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI

from app.core.config import get_settings


def create_application() -> FastAPI:
    """Build the application shell; routers are added by subsequent lots."""
    settings = get_settings()
    return FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description="Abdoul AI API.",
        debug=settings.debug,
    )


app = create_application()
