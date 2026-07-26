"""Health endpoints for process liveness and dependency readiness."""

import asyncio

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.infrastructure.health import check_postgres, check_redis

router = APIRouter(prefix="/health", tags=["health"])


@router.get("/live")
async def liveness() -> dict[str, str]:
    """Confirm that the FastAPI process can serve requests."""
    return {"status": "ok"}


@router.get("/ready")
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
