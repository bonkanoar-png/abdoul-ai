# Observabilité Docker

## Architecture

La stack conserve stdout/stderr comme interface de journalisation Docker et sépare les trois signaux :

- **logs** : JSON pour Nginx et FastAPI, collectés par Grafana Alloy puis stockés sept jours dans Loki ;
- **metrics** : FastAPI expose `/metrics`, scrappé toutes les 15 secondes par Prometheus ;
- **traces** : le contexte est préparé par `X-Request-ID`. L'export OTLP OpenTelemetry reste une évolution future afin d'éviter un collecteur et des SDK tant qu'aucun backend de traces n'est exploité.

Grafana provisionne automatiquement Prometheus, Loki et trois dashboards : API, Docker Logs et Infrastructure.

## Démarrage et accès

```bash
docker compose up -d --wait
docker compose ps
curl http://localhost:8000/health/ready
curl http://localhost:8000/metrics
curl http://localhost:9090/-/ready
curl http://localhost:3100/ready
```

Grafana est accessible sur `http://127.0.0.1:3001`. En développement, les identifiants par défaut sont `admin` / `change-me-local-only`. Ils ne conviennent pas à un environnement partagé. En production, `GRAFANA_ADMIN_PASSWORD` est obligatoire et seul Grafana est publié, sur l'adresse définie par `MONITORING_BIND_ADDRESS` (localhost par défaut).

## Logs et corrélation

Nginx génère un identifiant `$request_id`, le transmet au backend avec `X-Request-ID` et l'ajoute à la réponse. FastAPI accepte uniquement un identifiant au format sûr et borné, ou en génère un nouveau. Les journaux contiennent timestamp, niveau, service, requête, statut et durée. `docker logs` reste disponible.

Alloy ne sélectionne que les conteneurs nommés `abdoul-ai-*`. Son montage en lecture seule de `/var/run/docker.sock` lui donne néanmoins une visibilité importante sur l'hôte : l'accès au dashboard doit rester restreint et un proxy d'autorisation du socket est recommandé pour une plateforme mutualisée.

## Métriques et dashboards

Les métriques applicatives sont volontairement bornées aux labels méthode, route normalisée et statut :

- `abdoul_ai_http_requests_total` ;
- `abdoul_ai_http_request_duration_seconds_total`.

La route `/metrics` n'expose aucun secret. Les dashboards fournis donnent l'état du scrape backend, le débit par statut, l'état de Prometheus et les logs Docker. Les healthchecks existants couvrent frontend, backend, Nginx, PostgreSQL et Redis ; ils restent visibles avec `docker compose ps`.

## OpenTelemetry futur

Une phase ultérieure pourra ajouter un Collector OTLP sur le réseau monitoring, instrumenter FastAPI et Next.js, puis exporter vers Tempo. `X-Request-ID` pourra être conservé comme identifiant métier de corrélation en complément des `trace_id` et `span_id` W3C.

## Limites et exploitation

- Le monitoring consomme CPU, mémoire et espace disque supplémentaires.
- Prometheus conserve 15 jours et Loki 7 jours ; surveiller les volumes avant saturation.
- Loki monolithique et le stockage local conviennent à une instance unique, pas à une plateforme hautement disponible.
- Les métriques ne remplacent pas un exporteur système ou cAdvisor ; aucune métrique Docker fictive n'est présentée.
- Aucun système d'alerting ou d'envoi externe n'est activé. Les règles et destinations devront être définies avec leurs secrets dans le gestionnaire de déploiement.
- Loki n'intègre pas d'authentification : il n'est pas publié en production et doit rester sur le réseau interne.
