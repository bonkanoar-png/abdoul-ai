#!/bin/sh
set -eu

test -f .env.production.local || { echo ".env.production.local is missing" >&2; exit 1; }
set -a
. ./.env.production.local
set +a
: "${DOMAIN:?DOMAIN is required}"
: "${LETSENCRYPT_EMAIL:?LETSENCRYPT_EMAIL is required}"

compose="docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml"
$compose stop nginx 2>/dev/null || true
$compose --profile operations run --rm --service-ports certbot certonly \
  --standalone --non-interactive --agree-tos --no-eff-email \
  --email "$LETSENCRYPT_EMAIL" --cert-name abdoul-ai -d "$DOMAIN"
$compose up -d nginx
