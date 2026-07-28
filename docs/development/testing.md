# Tests

Les tests sont organisés par couche et n'ouvrent aucun serveur HTTP externe.

## Backend

```text
backend/tests/
├── unit/          # entités, cas d'usage, services, schémas et infrastructure isolée
├── integration/   # API ASGI et repositories PostgreSQL
├── factories/     # construction d'entités Domain valides
└── fixtures/      # sessions et schémas PostgreSQL temporaires
```

Exécuter la suite et la couverture depuis la racine :

```bash
pytest
pytest --cov=backend/app
```

Le seuil configuré est de 90 %. Les tests PostgreSQL nécessitent une base dédiée :

```bash
TEST_DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/test_db pytest
```

Sans `TEST_DATABASE_URL`, ces scénarios sont ignorés. Les fixtures créent des schémas temporaires
isolés. Les factories créent des objets Domain et ne contournent pas leurs invariants.

Les tests d'intégration couvrent notamment :

- repositories SQLAlchemy et mappings ORM vers Domain ;
- routes publiques, erreurs et sérialisation ;
- migrations et persistance des relations ;
- seed idempotent ;
- budgets de requêtes protégeant les chargements contre les régressions N+1.

Contrôles statiques associés :

```bash
ruff check backend
ruff format --check backend
mypy backend/app backend/tests
```

## Frontend

Depuis `frontend/` :

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Vitest, Testing Library et jsdom valident le client serveur, le service portfolio, les composants,
les états vides et les erreurs. Les appels `fetch` sont simulés ; aucune API réelle n'est contactée.

## Validation complète

```bash
pre-commit run --all-files
```

Les hooks exécutent les vérifications Ruff, Ruff format, Prettier et ESLint sans modifier les
fichiers.
