#!/bin/sh
set -eu

UPLOADS_DIR=${UPLOADS_DIR:-/uploads}
BACKUP_DIR=${BACKUP_DIR:-/backups}
RETENTION_DAYS=${UPLOADS_BACKUP_RETENTION_DAYS:-14}
ACTION=${1:-backup}

mkdir -p "$BACKUP_DIR"

if [ "$ACTION" = "backup" ]; then
  timestamp=$(date -u +%Y%m%dT%H%M%SZ)
  archive="$BACKUP_DIR/uploads-$timestamp.tar.gz"
  tar -C "$UPLOADS_DIR" -czf "$archive" .
  chmod 600 "$archive"
  find "$BACKUP_DIR" -type f -name 'uploads-*.tar.gz' -mtime "+$RETENTION_DAYS" -delete
  printf '{"action":"UPLOAD_BACKUP","archive":"%s","timestamp":"%s"}\n' "$archive" "$timestamp"
elif [ "$ACTION" = "restore" ]; then
  archive=${2:?usage: uploads-backup.sh restore ARCHIVE}
  case "$archive" in "$BACKUP_DIR"/uploads-*.tar.gz) ;; *) echo "invalid backup path" >&2; exit 2 ;; esac
  tar -tzf "$archive" >/dev/null
  tar -C "$UPLOADS_DIR" -xzf "$archive"
else
  echo "unsupported action" >&2
  exit 2
fi
