# Base de données

Abdoul AI utilise PostgreSQL 17 avec SQLAlchemy 2 asynchrone et le pilote asyncpg.

## Tables actuelles

```text
profiles
├── experiences
├── formations
├── projects ── project_skills ── skills
└── documents

publications
certifications
conversations
└── messages
```

Les relations de propriété utilisent des clés étrangères et des suppressions en cascade lorsque le
cycle de vie de l'enfant dépend du parent. Les projets et compétences sont associés par
`project_skills`, dont la clé primaire est composite.

## Modèles et Domain

Les modèles ORM représentent la persistance. Les repositories les convertissent en entités Domain
avec des mappers dédiés ; ils ne sont pas exposés directement par l'API.

Les lectures de relations sont explicites afin de rester compatibles avec `AsyncSession` et de
prévenir les régressions N+1.

## Alembic

Alembic est configuré dans `backend/alembic.ini` et `backend/alembic/env.py`. Les révisions
versionnées créent successivement :

1. le schéma portfolio initial ;
2. publications et certifications ;
3. formations ;
4. documents ;
5. conversations et messages.

Depuis `backend/` :

```bash
alembic current
alembic upgrade head
alembic downgrade -1
```

Les migrations décrivent uniquement le schéma. Le seed idempotent du profil s'exécute séparément :

```bash
python -m scripts.seed
```

## Infrastructure locale

`compose.yaml` utilise `pgvector/pgvector:pg17`. L'image rend pgvector disponible, mais le schéma
actuel ne crée ni extension vectorielle, ni embedding, ni fonctionnalité RAG.
