# Abdoul AI

[![CI](https://github.com/bonkanoar-png/abdoul-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/bonkanoar-png/abdoul-ai/actions/workflows/ci.yml)

Abdoul AI est une plateforme de portfolio professionnel conçue comme une base évolutive pour de
futurs usages d'intelligence artificielle. Elle sépare une interface Next.js d'une API FastAPI
asynchrone, avec un domaine métier indépendant de la persistance.

La phase Backend Core fournit aujourd'hui une API publique en lecture seule pour le profil, les
expériences, formations, compétences, projets, technologies, publications, certifications,
documents et conversations persistées. Aucun LLM, RAG ou agent n'est encore implémenté.

## Fonctionnalités

- portfolio public structuré et ordonné ;
- ressources métier exposées par des endpoints dédiés ;
- conversations et messages persistés en lecture seule ;
- migrations Alembic et seed de profil idempotent ;
- contrôles de santé PostgreSQL et Redis ;
- tests unitaires, API et PostgreSQL ;
- contrôles qualité locaux et CI GitHub Actions.

## Stack technique

- **Backend :** Python 3.13, FastAPI, Pydantic, SQLAlchemy 2 async et asyncpg.
- **Données :** PostgreSQL 17 avec pgvector, Redis et Alembic.
- **Frontend :** Next.js 16, React 19, TypeScript, Server Components et Tailwind CSS v4.
- **Qualité :** Ruff, mypy, pytest, coverage, Vitest, ESLint, Prettier et pre-commit.
- **CI :** GitHub Actions, sans déploiement automatique.

## Architecture

```text
Next.js (Server Components)
            |
            v
FastAPI API -> Application -> Domain
                              ^
                              |
                Infrastructure SQLAlchemy
                              |
                              v
                         PostgreSQL
```

Les entités et contrats du Domain ne dépendent ni de FastAPI ni de SQLAlchemy. Les cas d'usage
Application orchestrent ces contrats ; les repositories SQLAlchemy assurent leur implémentation.

## Démarrage rapide

Prérequis : Python 3.13, Node.js 24, npm, Docker Compose et Git.

```bash
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements-dev.txt
cp .env.example .env
cp frontend/.env.example frontend/.env.local
docker compose up -d
```

Pour un backend lancé sur l'hôte, définir `DATABASE_URL` avec `localhost` et
`REDIS_HOST=localhost`, puis :

```bash
cd backend
alembic upgrade head
python -m scripts.seed
cd ..
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

Dans un autre terminal :

```bash
cd frontend
npm ci
npm run dev
```

L'API est disponible sur `http://localhost:8000`, sa documentation sur `/docs`, et le frontend sur
`http://localhost:3000`.

## Validation

```bash
ruff check backend
ruff format --check backend
mypy backend/app backend/tests
pytest --cov=backend/app
pre-commit run --all-files
```

```bash
cd frontend
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

## Documentation

- [Architecture backend](docs/architecture/backend-architecture.md)
- [Architecture frontend](docs/architecture/frontend.md)
- [Base de données](docs/architecture/database.md)
- [Référence API](docs/api/reference.md)
- [Installation locale](docs/development/setup.md)
- [Tests](docs/development/testing.md)
- [Qualité et CI](docs/development/quality-and-ci.md)
- [CI/CD et automatisation](docs/development/ci-cd.md)
- [Contribution](docs/development/contributing.md)
- [Périmètre produit](docs/product/current-scope.md)
- [Roadmap](docs/product/roadmap.md)
