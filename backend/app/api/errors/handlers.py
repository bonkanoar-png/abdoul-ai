"""Uniform FastAPI and Starlette exception handlers."""

from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.api.schemas.common import ErrorDetail, ErrorResponse


def _error_response(
    *,
    status_code: int,
    code: str,
    message: str,
    details: Any | None = None,
) -> JSONResponse:
    payload = ErrorResponse(
        error=ErrorDetail(code=code, message=message, details=details)
    ).model_dump(mode="json")
    return JSONResponse(status_code=status_code, content=payload)


async def http_exception_handler(
    _request: Request,
    exception: Exception,
) -> JSONResponse:
    """Normalize explicit HTTP errors and unmatched routes."""
    if not isinstance(exception, StarletteHTTPException):
        return await unexpected_exception_handler(_request, exception)
    code = "RESOURCE_NOT_FOUND" if exception.status_code == 404 else "HTTP_ERROR"
    message = str(exception.detail)
    return _error_response(status_code=exception.status_code, code=code, message=message)


async def validation_exception_handler(
    _request: Request,
    exception: Exception,
) -> JSONResponse:
    """Return validation failures without leaking implementation internals."""
    if not isinstance(exception, RequestValidationError):
        return await unexpected_exception_handler(_request, exception)
    details = [
        {
            "location": list(error["loc"]),
            "message": error["msg"],
            "type": error["type"],
        }
        for error in exception.errors()
    ]
    return _error_response(
        status_code=422,
        code="VALIDATION_ERROR",
        message="Request validation failed.",
        details=details,
    )


async def unexpected_exception_handler(
    _request: Request,
    _exception: Exception,
) -> JSONResponse:
    """Hide internal exception details behind a stable response."""
    return _error_response(
        status_code=500,
        code="INTERNAL_SERVER_ERROR",
        message="An unexpected error occurred.",
    )


def register_error_handlers(application: FastAPI) -> None:
    """Register all global exception handlers on an application."""
    application.add_exception_handler(StarletteHTTPException, http_exception_handler)
    application.add_exception_handler(RequestValidationError, validation_exception_handler)
    application.add_exception_handler(Exception, unexpected_exception_handler)
