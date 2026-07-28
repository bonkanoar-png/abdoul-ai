# Architecture backend

Le backend suit une séparation Clean Architecture inspirée du Domain-Driven Design.

```text
API
 |
 v
Application
 |
 v
Domain
 ^
 |
Infrastructure
 |
 v
Database
```

Les dépendances pointent vers le Domain. FastAPI et SQLAlchemy restent aux frontières.

## Domain

`backend/app/domain` contient :

- les entités métier et leurs invariants ;
- les contrats de repositories abstraits ;
- les services de domaine sans dépendance framework.

Une entité Domain n'est ni un schéma Pydantic ni un modèle SQLAlchemy.

## Application

`backend/app/application` orchestre les opérations en lecture seule :

- les use cases décrivent une intention applicative ;
- les services coordonnent les repositories ;
- les DTO transportent les données entre Application et API.

Cette couche dépend des contrats du Domain, jamais des implémentations SQLAlchemy.

## Infrastructure et Database

`backend/app/infrastructure/database` fournit :

- le moteur et les sessions SQLAlchemy 2 async ;
- les modèles ORM PostgreSQL ;
- les mappers ORM vers Domain ;
- les repositories qui implémentent les contrats Domain.

Les relations sont chargées explicitement, notamment avec `selectinload`, afin d'éviter les accès
implicites incompatibles avec l'async et de maîtriser le nombre de requêtes.

Alembic versionne le schéma dans `backend/alembic/versions`. Le seed du profil est séparé des
migrations et reste idempotent.

## API

`backend/app/api` est responsable de :

- la composition des routeurs HTTP ;
- l'injection des dépendances et repositories ;
- la validation des entrées ;
- la sérialisation via des schémas Pydantic ;
- la normalisation des erreurs et des en-têtes de sécurité.

Les routes ne retournent jamais directement les modèles ORM. L'API métier est préfixée par
`/api/v1`; les routes de santé restent à la racine.

## Flux d'une lecture

```text
Requête HTTP
  -> route FastAPI
  -> dépendance Application
  -> use case/service
  -> contrat Domain
  -> repository SQLAlchemy
  -> mapper
  -> DTO
  -> schéma de réponse Pydantic
```

Les endpoints actuels sont en lecture seule. L'authentification, les commandes d'écriture et les
capacités IA appartiennent à des phases ultérieures.
