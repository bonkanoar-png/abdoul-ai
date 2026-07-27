# Abdoul AI

Abdoul AI est une fondation de portfolio moderne composée d'une interface Next.js et d'une API
FastAPI. Le projet expose aujourd'hui un portfolio en lecture seule, des contrôles de santé et une
chaîne complète de qualité logicielle.

Le dépôt ne contient actuellement ni authentification, ni chatbot, ni RAG, ni agents IA, ni
plateforme SaaS, ni déploiement de production.

## Stack technique

- **Frontend :** Next.js 16, React 19, TypeScript, App Router, Server Components et Tailwind CSS v4.
- **Backend :** Python 3.13, FastAPI, Pydantic, SQLAlchemy 2 async et asyncpg.
- **Données :** PostgreSQL avec l'image pgvector, Redis et Alembic.
- **Qualité :** Ruff, mypy, pytest, Vitest, ESLint, Prettier et pre-commit.
- **CI :** GitHub Actions sur chaque push et pull request, sans déploiement.

## Architecture

```text
Navigateur
   |
   v
Next.js — Server Components
   |
   v
FastAPI
   |
   v
SQLAlchemy async
   |
   v
PostgreSQL + pgvector

Redis est utilisé uniquement par le contrôle de disponibilité.
```

Le frontend et le backend restent deux applications séparées. Next.js appelle l'API depuis le
serveur ; aucune requête portfolio n'est envoyée directement par le navigateur.

## Prérequis

- Python 3.13 ;
- Node.js 24 et npm ;
- Docker avec Docker Compose ;
- Git.

## Démarrage rapide

### 1. Installer le backend

```bash
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements-dev.txt
```

### 2. Préparer l'environnement local

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Pour exécuter FastAPI sur la machine hôte, remplacer le nom d'hôte `postgres` par `localhost` dans
`DATABASE_URL` et définir `REDIS_HOST=localhost` dans `.env`.

### 3. Démarrer PostgreSQL et Redis

```bash
docker compose up -d
docker compose ps
```

Compose démarre uniquement PostgreSQL/pgvector et Redis. Le backend et le frontend sont lancés
séparément.

### 4. Démarrer le backend

```bash
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

### 5. Démarrer le frontend

Dans un second terminal :

```bash
cd frontend
npm ci
npm run dev
```

Le frontend est alors disponible sur `http://localhost:3000` et l'API sur
`http://localhost:8000`.

> Aucune migration métier et aucun seed ne sont encore fournis. Les tables et données du portfolio
> doivent exister pour que `GET /api/v1/portfolio` retourne un contenu.

## Commandes principales

```bash
# Backend, depuis la racine
ruff check backend
ruff format --check backend
mypy backend/app backend/tests
pytest --cov=backend/app

# Frontend
cd frontend
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build

# Tous les contrôles pre-commit
pre-commit run --all-files
```

## Documentation

- [Vue d'ensemble](docs/architecture/overview.md)
- [Architecture backend](docs/architecture/backend.md)
- [Architecture frontend](docs/architecture/frontend.md)
- [Base de données](docs/architecture/database.md)
- [Installation locale](docs/development/setup.md)
- [Tests](docs/development/testing.md)
- [Qualité et CI](docs/development/quality-and-ci.md)
- [Périmètre fonctionnel actuel](docs/product/current-scope.md)
