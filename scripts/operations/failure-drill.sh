#!/bin/sh
set -eu

service="${1:?usage: failure-drill.sh <backend|postgres|redis> [seconds]}"
duration="${2:-180}"
case "$service" in backend|postgres|redis) ;; *) echo "unsupported service" >&2; exit 1 ;; esac
case "$duration" in *[!0-9]*|'') echo "duration must be an integer" >&2; exit 1 ;; esac
if [ "${CONFIRM_FAILURE_DRILL:-}" != "yes" ]; then
  echo "Set CONFIRM_FAILURE_DRILL=yes after announcing the drill." >&2
  exit 1
fi

compose="docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml"
recover() {
  $compose start "$service" >/dev/null
}
trap recover EXIT INT TERM

echo "Stopping $service for ${duration}s; no volumes or data will be removed."
$compose stop "$service"
sleep "$duration"
recover
trap - EXIT INT TERM
$compose up -d --wait "$service"
echo "Failure drill complete: $service recovered."
