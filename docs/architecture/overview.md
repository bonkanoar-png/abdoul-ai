# Vue d'ensemble de l'architecture

Abdoul AI sépare l'interface, l'API et les dépendances de données. Chaque partie peut être exécutée
et testée indépendamment.

## Flux principal

```text
Navigateur
   |
   v
Next.js 16
Server Components
   |
   | GET /api/v1/portfolio
   v
FastAPI
   |
   v
SQLAlchemy 2 async
   |
   v
PostgreSQL + pgvector
```

La page Next.js est rendue à la demande. Son service portfolio appelle FastAPI avec le `fetch`
natif, côté serveur uniquement. FastAPI charge explicitement les relations SQLAlchemy et sérialise
la réponse avec des schémas Pydantic.

## Composants

### Frontend

Le frontend fournit l'interface responsive, les états de chargement et les états d'indisponibilité.
Il ne contient ni accès direct à la base de données, ni logique métier backend.

### Backend

Le backend expose les routes HTTP, centralise la configuration et accède à PostgreSQL avec un moteur
et des sessions asynchrones.

### PostgreSQL et pgvector

PostgreSQL conserve le profil, les expériences, les projets et les compétences. L'image Docker
inclut pgvector, mais aucun schéma vectoriel, aucune migration vectorielle et aucun usage RAG ne sont
implémentés.

### Redis

Redis est présent dans l'infrastructure locale. Il est actuellement interrogé uniquement par
`GET /health/ready`. Aucun cache, stockage de session ou traitement métier Redis n'existe.

## Limites actuelles

- aucune migration métier dans Alembic ;
- aucun mécanisme de seed ;
- aucune authentification ;
- aucune fonctionnalité IA, RAG ou agent ;
- aucun déploiement automatisé.

Les dossiers préparatoires du dépôt ne constituent pas des fonctionnalités livrées. Le
[périmètre actuel](../product/current-scope.md) les distingue explicitement.
