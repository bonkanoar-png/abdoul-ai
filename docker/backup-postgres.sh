#!/bin/sh
set -eu

umask 077
backup_dir=/backups
retention_days="${BACKUP_RETENTION_DAYS:-7}"
interval_seconds="${BACKUP_INTERVAL_SECONDS:-86400}"

create_backup() {
  timestamp="$(date -u +%Y%m%dT%H%M%SZ)"
  target="${backup_dir}/${POSTGRES_DB}_${timestamp}.dump"
  pg_dump --host=postgres --username="$POSTGRES_USER" --dbname="$POSTGRES_DB" \
    --format=custom --compress=9 --file="$target"
  pg_restore --list "$target" >/dev/null
  find "$backup_dir" -type f -name '*.dump' -mtime "+$retention_days" -delete
  printf '{"timestamp":"%s","level":"info","service":"postgres-backup","event":"backup_created","file":"%s"}\n' \
    "$timestamp" "$(basename "$target")"
}

if [ "${BACKUP_RUN_ONCE:-false}" = "true" ]; then
  create_backup
  exit 0
fi

while true; do
  create_backup
  sleep "$interval_seconds"
done
