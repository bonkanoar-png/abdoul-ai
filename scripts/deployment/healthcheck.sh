#!/bin/sh
set -eu

domain="${DOMAIN:?DOMAIN is required}"
attempts="${HEALTHCHECK_ATTEMPTS:-30}"
delay="${HEALTHCHECK_DELAY_SECONDS:-5}"

check() {
  url="$1"
  count=1
  while [ "$count" -le "$attempts" ]; do
    if curl --fail --silent --show-error --max-time 10 "$url" >/dev/null; then
      printf 'healthy: %s\n' "$url"
      return 0
    fi
    count=$((count + 1))
    sleep "$delay"
  done
  printf 'unhealthy after %s attempts: %s\n' "$attempts" "$url" >&2
  return 1
}

check "https://${domain}/"
check "https://${domain}/nginx-health"

docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml ps
docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml exec -T backend \
  python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/health/ready', timeout=5)"
docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml exec -T prometheus \
  wget -q -O /dev/null http://127.0.0.1:9090/-/ready
