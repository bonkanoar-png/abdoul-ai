"""Lightweight request correlation, structured logs, and Prometheus metrics."""

from __future__ import annotations

import json
import logging
import re
import threading
import time
import uuid
from collections import defaultdict

from fastapi import FastAPI, Request, Response

REQUEST_ID_HEADER = "X-Request-ID"
_SAFE_REQUEST_ID = re.compile(r"^[A-Za-z0-9._:-]{1,128}$")
_metrics_lock = threading.Lock()
_request_counts: defaultdict[tuple[str, str, str], int] = defaultdict(int)
_request_duration_seconds: defaultdict[tuple[str, str], float] = defaultdict(float)


class JsonFormatter(logging.Formatter):
    """Serialize application logs as one JSON object per line."""

    def format(self, record: logging.LogRecord) -> str:
        payload: dict[str, object] = {
            "timestamp": self.formatTime(record, "%Y-%m-%dT%H:%M:%S%z"),
            "level": record.levelname.lower(),
            "service": "abdoul-ai-backend",
            "logger": record.name,
            "message": record.getMessage(),
        }
        for field in ("request_id", "method", "path", "status_code", "duration_ms"):
            value = getattr(record, field, None)
            if value is not None:
                payload[field] = value
        if record.exc_info:
            payload["exception"] = self.formatException(record.exc_info)
        return json.dumps(payload, ensure_ascii=True, separators=(",", ":"))


def configure_json_logging() -> None:
    """Keep Docker stdout/stderr logging while making backend records machine-readable."""
    handler = logging.StreamHandler()
    handler.setFormatter(JsonFormatter())
    root_logger = logging.getLogger()
    root_logger.handlers = [handler]
    root_logger.setLevel(logging.INFO)


def _request_id(request: Request) -> str:
    candidate = request.headers.get(REQUEST_ID_HEADER, "")
    return candidate if _SAFE_REQUEST_ID.fullmatch(candidate) else uuid.uuid4().hex


def _metric_path(request: Request) -> str:
    route = request.scope.get("route")
    return str(getattr(route, "path", request.url.path))


def install_observability(application: FastAPI) -> None:
    """Install request instrumentation without changing business routes."""
    logger = logging.getLogger("abdoul_ai.http")

    @application.middleware("http")
    async def observe_request(request: Request, call_next):  # type: ignore[no-untyped-def]
        request_id = _request_id(request)
        started_at = time.perf_counter()
        status_code = 500
        try:
            response: Response = await call_next(request)
            status_code = response.status_code
            return response
        finally:
            duration = time.perf_counter() - started_at
            path = _metric_path(request)
            with _metrics_lock:
                _request_counts[(request.method, path, str(status_code))] += 1
                _request_duration_seconds[(request.method, path)] += duration
            if "response" in locals():
                response.headers[REQUEST_ID_HEADER] = request_id
            logger.info(
                "request_completed",
                extra={
                    "request_id": request_id,
                    "method": request.method,
                    "path": path,
                    "status_code": status_code,
                    "duration_ms": round(duration * 1000, 3),
                },
            )


def prometheus_metrics() -> str:
    """Render bounded HTTP counters and durations in Prometheus text format."""
    lines = [
        "# HELP abdoul_ai_http_requests_total Total HTTP requests.",
        "# TYPE abdoul_ai_http_requests_total counter",
    ]
    with _metrics_lock:
        counts = sorted(_request_counts.items())
        durations = sorted(_request_duration_seconds.items())
    for (method, path, status), value in counts:
        lines.append(
            f'abdoul_ai_http_requests_total{{method="{method}",path="{path}",status="{status}"}} {value}'
        )
    lines.extend(
        [
            "# HELP abdoul_ai_http_request_duration_seconds_total Cumulative HTTP request duration.",
            "# TYPE abdoul_ai_http_request_duration_seconds_total counter",
        ]
    )
    for (method, path), value in durations:
        lines.append(
            f'abdoul_ai_http_request_duration_seconds_total{{method="{method}",path="{path}"}} {value:.9f}'
        )
    return "\n".join(lines) + "\n"
