# Qualité et intégration continue

## Backend

### Ruff

Ruff contrôle les erreurs Python, les imports, les modernisations sûres et le formatage :

```bash
ruff check backend
ruff format --check backend
```

La configuration cible Python 3.13 avec une longueur de ligne de 100 caractères.

### mypy

```bash
mypy backend/app backend/tests
```

Le code applicatif conserve un typage strict. Une tolérance ciblée s'applique aux tests pour les
fixtures pytest et certaines métadonnées SQLAlchemy.

### pytest

```bash
pytest --cov=backend/app
```

Les tests utilisent pytest-cov et un transport ASGI en mémoire.

## Frontend

Depuis `frontend/` :

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

- Prettier applique le formatage et ordonne les classes Tailwind.
- ESLint active les règles Next.js Core Web Vitals et TypeScript.
- `tsc --noEmit` réalise le contrôle statique.
- Vitest exécute les tests unitaires.
- le build Next.js détecte les régressions de compilation.

## Pre-commit

L'outil est inclus dans les dépendances backend de développement :

```bash
pre-commit install
pre-commit run --all-files
```

Les hooks vérifient :

- `ruff check` ;
- `ruff format --check` ;
- `npm --prefix frontend run format:check` ;
- `npm --prefix frontend run lint`.

Ils n'appliquent aucun auto-fix.

## GitHub Actions

Le workflow canonique est :

```text
.github/workflows/ci.yml
```

Il s'exécute sur les pushes et pull requests avec deux jobs indépendants :

```text
backend-quality
frontend-quality
```

Le job backend démarre un service PostgreSQL éphémère, valide le cycle Alembic
`upgrade/downgrade/upgrade`, puis exécute également les tests marqués PostgreSQL. Les caches pip et
npm accélèrent l'installation. Une concurrence par workflow et branche annule les exécutions
obsolètes. Les permissions sont limitées à :

```yaml
permissions:
  contents: read
```

`quality.yml` reste disponible en déclenchement manuel et appelle le workflow canonique afin
d'éviter la duplication des étapes.

La CI ne contient aucune étape de déploiement, aucun secret personnalisé, aucune publication
d'image et aucune intégration cloud.
