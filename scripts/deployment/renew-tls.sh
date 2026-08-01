#!/bin/sh
set -eu
compose="docker compose --env-file .env.production.local -f compose.yaml -f compose.prod.yaml"
$compose --profile operations run --rm certbot renew --webroot -w /var/www/certbot --quiet
$compose exec -T nginx nginx -s reload
