# Abdoul AI

[![CI](https://github.com/bonkanoar-png/abdoul-ai/actions/workflows/ci.yml/badge.svg)](https://github.com/bonkanoar-png/abdoul-ai/actions/workflows/ci.yml)
[![Frontend CI](https://github.com/bonkanoar-png/abdoul-ai/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/bonkanoar-png/abdoul-ai/actions/workflows/frontend-ci.yml)

## Présentation

Abdoul AI est un portfolio IA interactif. L'application sépare une interface Next.js d'une API
FastAPI et présente le parcours, les compétences, les projets et les publications, avec des
expériences interactives de chatbot, Career Copilot et Data Lab.

## Stack technique

- **Frontend :** Next.js 16, React 19, TypeScript, Tailwind CSS, Vitest et Playwright.
- **Backend :** FastAPI, Pydantic et SQLAlchemy async.
- **Data :** PostgreSQL avec pgvector et Redis.
- **Qualité :** ESLint, TypeScript, Vitest, Playwright, axe-core, Ruff, mypy et pytest.
- **CI :** GitHub Actions ; aucune livraison ou mise en production automatique.

Le dépôt utilise actuellement Next.js 16 et Node.js 24, tels que verrouillés dans
`frontend/package-lock.json` et les workflows.

## Architecture

```text
Utilisateur
    |
    v
frontend/ (Next.js)
    |
    v
backend/ (FastAPI)
    |
    +----> PostgreSQL
    |
    +----> Redis
```

- `frontend/` contient l'App Router, les composants, les fonctionnalités, les services et les tests.
- `backend/` contient l'API et ses couches Domain, Application et Infrastructure.
- `compose.yaml` décrit les services PostgreSQL/pgvector et Redis pour le développement local.
- `docs/` rassemble l'architecture, les conventions, les tests et le déploiement.

Voir la [documentation d'architecture](docs/architecture.md) pour les flux détaillés.

## Installation locale

Prérequis : Git, Node.js 24, npm, Python 3.13 et Docker Compose.

```bash
git clone https://github.com/bonkanoar-png/abdoul-ai.git
cd abdoul-ai

python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements-dev.txt

cp .env.example .env
cp frontend/.env.example frontend/.env.local
docker compose up -d
```

Lancer le backend :

```bash
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

Dans un autre terminal, lancer le frontend :

```bash
cd frontend
npm ci
npm run dev
```

Le frontend est disponible sur `http://localhost:3000`, l'API sur `http://localhost:8000` et la
documentation OpenAPI sur `http://localhost:8000/docs`.

## Variables frontend

Copier `frontend/.env.example` vers `frontend/.env.local`, puis adapter uniquement les origines
publiques :

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Ces variables sont exposables au navigateur et ne doivent contenir aucun secret, token ou clé API.

## Scripts frontend

Depuis `frontend/` :

| Commande            | Rôle                                          |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Lance le serveur de développement             |
| `npm run lint`      | Exécute ESLint                                |
| `npm run typecheck` | Vérifie les types TypeScript sans émission    |
| `npm run test`      | Exécute les tests Vitest                      |
| `npm run build`     | Produit et valide le build Next.js            |
| `npm run test:e2e`  | Exécute les tests Playwright et accessibilité |

## CI et preview

Le workflow `Frontend CI` s'exécute sur les pushes vers `main` et `feature/*`, ainsi que sur les
Pull Requests ciblant `main`. Il installe les dépendances avec `npm ci`, puis bloque en cas d'échec
du lint, du typecheck, des tests, du build ou de Playwright. Les traces et captures Playwright sont
conservées comme artefact lors d'un échec.

La preview recommandée repose sur Vercel, sans connexion ni secret configuré dans ce dépôt. La
[procédure de preview](docs/deployment.md) décrit l'import, le répertoire racine et les variables à
renseigner.

## Documentation

- [Vue globale de l'architecture](docs/architecture.md)
- [Conventions frontend](docs/frontend.md)
- [Stratégie de tests](docs/testing.md)
- [Preview et déploiement](docs/deployment.md)
- [Installation détaillée](docs/development/setup.md)
- [Référence API](docs/api/reference.md)
- [Contribution](docs/development/contributing.md)
