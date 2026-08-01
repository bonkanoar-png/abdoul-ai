#!/bin/sh
set -eu

if [ "${CONFIRM_MIGRATION:-}" != "yes" ]; then
  echo "Refusing migration: set CONFIRM_MIGRATION=yes after reviewing the Alembic revision." >&2
  exit 1
fi

compose="docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml"

$compose run --rm -e BACKUP_RUN_ONCE=true postgres-backup
$compose run --rm backend alembic upgrade head
