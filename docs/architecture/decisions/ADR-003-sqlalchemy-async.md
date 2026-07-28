# ADR-003 — SQLAlchemy asynchrone

## Contexte

FastAPI traite les requêtes de manière asynchrone et PostgreSQL est la source persistante.

## Décision

Utiliser SQLAlchemy 2 async avec `asyncpg`, `AsyncEngine` et `AsyncSession`. Charger explicitement
les relations requises et contrôler les budgets de requêtes.

## Conséquences

Les accès à la base ne bloquent pas la boucle événementielle. Le lazy loading implicite est évité ;
les transactions et durées de vie des sessions doivent être gérées explicitement.

## Alternatives rejetées

- SQLAlchemy synchrone dans les routes async ;
- SQL brut généralisé ;
- autre ORM sans bénéfice suffisant pour le modèle relationnel existant.
