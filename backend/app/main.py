"""FastAPI application entry point.

Run locally with:
    uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.errors import register_error_handlers
from app.api.responses import SecurityHeadersMiddleware
from app.api.router import build_api_router
from app.core.config import get_settings
from app.core.observability import (
    configure_json_logging,
    install_observability,
    prometheus_metrics,
)

OPENAPI_TAGS = [
    {"name": "health", "description": "Process and infrastructure availability."},
    {"name": "portfolio", "description": "Complete public portfolio projection."},
    {"name": "profile", "description": "Public profile information."},
    {"name": "experiences", "description": "Professional experience history."},
    {"name": "formations", "description": "Education and formation history."},
    {"name": "skills", "description": "Public capability catalog."},
    {"name": "projects", "description": "Public projects and their technologies."},
    {"name": "technologies", "description": "Technology catalog."},
    {"name": "publications", "description": "Public articles and content."},
    {"name": "certifications", "description": "Professional certifications."},
    {"name": "documents", "description": "Public profile documents."},
    {"name": "conversations", "description": "Read-only persisted conversations."},
]


def create_application() -> FastAPI:
    """Compose the production-ready FastAPI application shell."""
    settings = get_settings()
    configure_json_logging()
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description="Public API for the Abdoul AI portfolio and conversation persistence.",
        debug=settings.debug,
        docs_url=settings.docs_url,
        redoc_url=settings.redoc_url,
        openapi_url=settings.openapi_url,
        openapi_tags=OPENAPI_TAGS,
    )
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Accept", "Authorization", "Content-Type"],
    )
    application.add_middleware(SecurityHeadersMiddleware)
    application.mount(
        settings.public_upload_base_url,
        StaticFiles(directory=settings.upload_directory, check_dir=False),
        name="uploads",
    )
    install_observability(application)

    @application.get("/metrics", include_in_schema=False)
    async def metrics() -> Response:
        return Response(prometheus_metrics(), media_type="text/plain; version=0.0.4")

    register_error_handlers(application)
    application.include_router(build_api_router(settings.api_v1_prefix))
    return application


app = create_application()
