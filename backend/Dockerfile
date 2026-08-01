ARG IMAGE_TAG=local
ARG BUILD_VERSION=development
ARG GIT_SHA=unknown
ARG OCI_SOURCE=https://github.com/bonkanoar-png/abdoul-ai

FROM python:3.12-slim

ARG IMAGE_TAG
ARG BUILD_VERSION
ARG GIT_SHA
ARG OCI_SOURCE

LABEL org.opencontainers.image.source="${OCI_SOURCE}" \
      org.opencontainers.image.revision="${GIT_SHA}" \
      org.opencontainers.image.version="${BUILD_VERSION}" \
      org.opencontainers.image.ref.name="${IMAGE_TAG}"

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

RUN groupadd --gid 10001 appuser \
    && useradd --uid 10001 --gid appuser --create-home --shell /usr/sbin/nologin appuser

COPY requirements.txt .
RUN pip install --no-cache-dir --timeout 600 -r requirements.txt

COPY --chown=appuser:appuser app ./app
COPY --chown=appuser:appuser alembic ./alembic
COPY --chown=appuser:appuser scripts ./scripts
COPY --chown=appuser:appuser alembic.ini ./alembic.ini

USER appuser

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
