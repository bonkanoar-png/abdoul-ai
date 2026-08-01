#!/bin/sh
set -eu

image_tag="${1:?usage: deploy.sh <immutable-image-tag>}"
case "$image_tag" in
  sha-[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]|v[0-9]*.[0-9]*.[0-9]*) ;;
  *) echo "IMAGE_TAG must be an immutable sha-xxxxxxx or SemVer tag" >&2; exit 1 ;;
esac

test -f .env.production.local || { echo ".env.production.local is missing" >&2; exit 1; }
export IMAGE_TAG="$image_tag"
compose="docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml"

$compose pull backend frontend
CONFIRM_MIGRATION=yes scripts/migration/deploy.sh
$compose up -d --remove-orphans --wait
scripts/deployment/healthcheck.sh

printf '%s\n' "$image_tag" > .deployed-image
