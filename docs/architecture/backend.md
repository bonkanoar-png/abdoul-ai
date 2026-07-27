# Architecture backend

Le backend est une application FastAPI asynchrone située dans `backend/app`.

## Arborescence

```text
backend/app/
├── api/
│   ├── dependencies/
│   ├── routes/
│   └── schemas/
├── application/
│   ├── services/
│   └── use_cases/
├── core/
├── domain/
│   ├── entities/
│   ├── repositories/
│   └── services/
├── infrastructure/
│   ├── database/
│   ├── llm/
│   ├── rag/
│   └── storage/
└── main.py
```

## Modules implémentés

### API

`app/api` contient les dépendances de session, les routes et les schémas Pydantic publics.

| Méthode | Route | Rôle |
| --- | --- | --- |
| `GET` | `/health/live` | Confirmer que le processus répond |
| `GET` | `/health/ready` | Vérifier PostgreSQL et Redis |
| `GET` | `/api/v1/portfolio` | Lire le premier portfolio disponible |

L'endpoint portfolio peut répondre :

- `200` avec le profil, les expériences, les projets et les compétences ;
- `404` lorsqu'aucun profil n'existe ;
- `500` avec un message générique lors d'une erreur SQLAlchemy.

Les modèles SQLAlchemy ne sont jamais retournés directement : `PortfolioResponse` et ses schémas
imbriqués assurent la sérialisation.

### Core

`app/core/config.py` charge et valide la configuration avec `pydantic-settings`. La configuration
est mémorisée au niveau du processus.

### Infrastructure

`app/infrastructure/database` fournit :

- la base déclarative SQLAlchemy ;
- le moteur PostgreSQL async ;
- la fabrique de sessions async ;
- les cinq modèles persistants.

`app/infrastructure/health.py` vérifie PostgreSQL avec asyncpg et Redis avec son client async.

## Structures préparatoires

Les emplacements suivants contiennent uniquement des placeholders :

```text
application/
domain/
infrastructure/llm/
infrastructure/rag/
infrastructure/storage/
```

Ils préparent une évolution possible de l'architecture, mais aucune entité de domaine, aucun cas
d'usage, aucun LLM, aucun RAG et aucun stockage applicatif n'y sont implémentés.

## Migrations et tests

Alembic est configuré pour utiliser `DATABASE_URL` et les métadonnées SQLAlchemy. Aucune révision
métier n'existe actuellement.

Les tests sont répartis entre :

```text
backend/tests/unit/
backend/tests/integration/
```

Ils couvrent la configuration, les modèles, les schémas, les routes de santé et le portfolio sans
serveur HTTP ni réseau externe.
