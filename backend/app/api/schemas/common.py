"""Shared response schemas for API infrastructure."""

from typing import Any

from pydantic import BaseModel


class ErrorDetail(BaseModel):
    """Stable machine- and human-readable API error."""

    code: str
    message: str
    details: Any | None = None


class ErrorResponse(BaseModel):
    """Envelope returned for every handled API error."""

    error: ErrorDetail


class HealthResponse(BaseModel):
    """Service identity and process health."""

    status: str
    service: str
    version: str


class MetadataResponse(BaseModel):
    """Optional metadata envelope for future paginated responses."""

    count: int
