# Installation locale

Toutes les commandes partent de la racine du dépôt, sauf indication contraire.

## Prérequis

- Python 3.13 ;
- Node.js 24 et npm ;
- Docker avec Docker Compose ;
- Git.

## Backend

Créer l'environnement Python et installer les dépendances de développement :

```bash
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements-dev.txt
```

Sous PowerShell, utiliser `.venv\Scripts\Activate.ps1`.

Créer les fichiers d'environnement locaux :

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Les fichiers `.env` sont ignorés par Git. Ne jamais y placer de secret destiné à être versionné.

## Infrastructure

```bash
docker compose up -d
docker compose ps
```

Compose démarre PostgreSQL/pgvector sur le port 5432 et Redis sur le port 6379. FastAPI et Next.js
ne sont pas conteneurisés.

Pour lancer le backend sur l'hôte, utiliser notamment :

```dotenv
DATABASE_URL=postgresql+asyncpg://abdoul_ai:change-me-local-only@localhost:5432/abdoul_ai
POSTGRES_HOST=localhost
REDIS_HOST=localhost
```

## Migrations et seed

Depuis `backend/` :

```bash
cd backend
alembic upgrade head
python -m scripts.seed
```

Les révisions Alembic créent le schéma applicatif par étapes. Le seed crée uniquement le profil
public avec un identifiant déterministe ; il est idempotent et ne remplace aucune donnée existante.

Pour inspecter ou revenir d'une révision :

```bash
alembic current
alembic downgrade -1
alembic upgrade head
```

## Lancer les applications

Depuis la racine :

```bash
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

Dans un second terminal :

```bash
cd frontend
npm ci
npm run dev
```

Points de contrôle :

- API : `http://localhost:8000` ;
- OpenAPI : `http://localhost:8000/docs` ;
- liveness : `http://localhost:8000/health/live` ;
- readiness : `http://localhost:8000/health/ready` ;
- frontend : `http://localhost:3000`.

La readiness retourne `503` si PostgreSQL ou Redis est indisponible.

## Validation locale

Depuis la racine :

```bash
ruff check backend
ruff format --check backend
mypy backend/app backend/tests
pytest --cov=backend/app
```

Depuis `frontend/` :

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

## Variables principales

| Variable | Rôle |
| --- | --- |
| `APP_NAME`, `APP_VERSION`, `APP_ENV`, `APP_DEBUG` | Identité et mode de l'API |
| `API_V1_PREFIX` | Préfixe des routes métier, `/api/v1` par défaut |
| `DATABASE_URL` | URL SQLAlchemy PostgreSQL utilisant `postgresql+asyncpg` |
| `POSTGRES_*` | Paramètres PostgreSQL et contrôle de santé |
| `REDIS_HOST`, `REDIS_PORT` | Paramètres du contrôle Redis |
| `CORS_ORIGINS` | Origines HTTP autorisées |
| `NEXT_PUBLIC_API_URL` | URL de l'API appelée côté serveur par Next.js |

Les clés d'API IA présentes dans l'exemple racine sont réservées à de futures phases et ne sont pas
requises actuellement.
