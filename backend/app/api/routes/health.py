"""Health endpoints for process liveness and dependency readiness."""

import asyncio

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.api.schemas.common import HealthResponse
from app.core.config import get_settings
from app.infrastructure.health import check_postgres, check_redis

router = APIRouter(prefix="/health", tags=["health"])


@router.get("", response_model=HealthResponse, summary="Get service health")
async def health() -> HealthResponse:
    """Return stable service identity and process status."""
    settings = get_settings()
    return HealthResponse(
        status="ok",
        service=f"{settings.app_name}-api",
        version=settings.app_version,
    )


@router.get("/live", summary="Check process liveness")
async def liveness() -> dict[str, str]:
    """Confirm that the FastAPI process can serve requests."""
    return {"status": "ok"}


@router.get("/ready", summary="Check dependency readiness")
async def readiness() -> JSONResponse:
    """Confirm that required infrastructure dependencies are reachable."""
    postgres_ok, redis_ok = await asyncio.gather(check_postgres(), check_redis())
    services = {
        "postgres": "ok" if postgres_ok else "unavailable",
        "redis": "ok" if redis_ok else "unavailable",
    }

    if postgres_ok and redis_ok:
        return JSONResponse(status_code=200, content={"status": "ok", "services": services})

    return JSONResponse(
        status_code=503,
        content={"status": "unavailable", "services": services},
    )
