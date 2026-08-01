# Stack Docker Compose

## Architecture locale

`docker compose up` démarre quatre services sur le réseau bridge `abdoul-ai-network` :

- `frontend` : Next.js standalone, publié sur `localhost:3000` ;
- `backend` : FastAPI, publié sur `localhost:8000` ;
- `postgres` : PostgreSQL 17 avec pgvector, publié sur `localhost:5432` ;
- `redis` : Redis 7.4, publié sur `localhost:6379`.

PostgreSQL et Redis utilisent respectivement les volumes nommés `postgres-data` et `redis-data`.
Un `docker compose down` ordinaire conserve ces données. L’option `--volumes` les supprime et ne
doit être utilisée que lorsqu’une réinitialisation explicite est souhaitée.

## Démarrage et contrôles

```bash
docker compose build
docker compose up -d
docker compose ps
curl http://localhost:3000
curl http://localhost:8000/health
curl http://localhost:8000/api/v1/profile
```

Le backend attend que PostgreSQL et Redis soient sains. Le frontend attend ensuite que le endpoint
de readiness du backend confirme ces deux dépendances.

Les migrations et le seed restent des opérations explicites :

```bash
docker compose exec backend alembic upgrade head
docker compose exec backend python -m scripts.seed
```

## URL de l’API

Les services de données Next.js actuels sont exclusivement exécutés côté serveur. Compose injecte
donc `NEXT_PUBLIC_API_URL=http://backend:8000` pendant le build et au runtime : `backend` est le nom
DNS interne résolu sur le réseau Docker. Depuis la machine hôte, FastAPI reste accessible via
`http://localhost:8000`.

Le préfixe `NEXT_PUBLIC_` rend cette valeur impropre à de futurs appels exécutés dans le navigateur,
qui ne peut pas résoudre le nom `backend`. Avant d’introduire de tels appels, il faudra adopter un
proxy same-origin (`/api`) ou séparer clairement `API_SERVER_URL` et `NEXT_PUBLIC_API_URL`.

## Production

La configuration actuelle vise le développement local. En production :

- PostgreSQL et Redis ne doivent pas publier leurs ports sur l’hôte ;
- les identifiants par défaut doivent être remplacés par des secrets gérés hors du dépôt ;
- les migrations doivent être orchestrées avant le trafic applicatif ;
- les images doivent être construites et analysées dans un registre, avec suivi du temps de build
  et de leur taille.
