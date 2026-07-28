# CI/CD et automatisation

La chaîne GitHub Actions valide le projet sans déploiement, publication d'image ou accès en
écriture au dépôt.

## Workflows

### Pipeline canonique

`.github/workflows/ci.yml` se déclenche sur :

- chaque `push` ;
- chaque `pull_request` ;
- un appel depuis un autre workflow avec `workflow_call`.

La concurrence est limitée par workflow et référence Git. Une nouvelle exécution annule une
exécution obsolète sur la même référence.

### Validation manuelle

`.github/workflows/quality.yml` expose `workflow_dispatch` et appelle directement la pipeline
canonique. Il ne maintient aucune copie des commandes qualité.

## Backend quality gate

Le job `backend-quality` utilise Python 3.13 et le cache pip :

```text
installation requirements-dev
  -> ruff check
  -> ruff format --check
  -> mypy
  -> Alembic upgrade/downgrade/upgrade
  -> pytest avec couverture >= 90 %
```

Un service `pgvector/pgvector:pg17` éphémère permet d'exécuter les tests repositories et
d'intégration PostgreSQL ainsi que les migrations. La base n'est ni partagée ni conservée après le
job.

Commandes locales équivalentes :

```bash
ruff check backend
ruff format --check backend
mypy backend/app backend/tests
pytest --cov=backend/app --cov-fail-under=90
```

Pour reproduire le cycle de migrations, démarrer PostgreSQL puis, depuis `backend/` :

```bash
alembic upgrade head
alembic downgrade -1
alembic upgrade head
```

## Frontend quality gate

Le job `frontend-quality` utilise Node.js 24, `npm ci` et le cache npm :

```text
format:check
  -> lint
  -> typecheck
  -> test
  -> build
```

Le build valide Next.js sans modifier l'application et sans publier d'artefact.

## Variables CI

| Variable | Utilisation |
| --- | --- |
| `DATABASE_URL` | migrations Alembic sur le service PostgreSQL |
| `TEST_DATABASE_URL` | tests d'intégration PostgreSQL |
| `APP_ENV` | environnement applicatif `test` |

Les identifiants PostgreSQL inscrits dans le workflow sont temporaires, limités au runner et ne
constituent pas des secrets. Aucun GitHub Secret n'est requis pour la pipeline actuelle.

`REDIS_URL` et la forme générique `ENVIRONMENT` figurent dans certains environnements possibles,
mais le code actuel consomme respectivement `REDIS_HOST`/`REDIS_PORT` et `APP_ENV`. Les tests de
santé simulent Redis, donc aucun service Redis ni secret associé n'est nécessaire en CI.

Si une future étape exige une donnée sensible, elle devra être fournie par GitHub Secrets, limitée
au job concerné et ne jamais être affichée dans les logs.

## Sécurité et règles de contribution

- permissions GitHub limitées à `contents: read` ;
- aucune clé personnalisée ni token d'écriture ;
- aucune publication de paquet ou d'image ;
- aucun déploiement automatique ;
- aucun `docker build`, car le dépôt ne contient actuellement aucun Dockerfile applicatif.

Toute Pull Request doit réussir les deux jobs avant revue et intégration.
