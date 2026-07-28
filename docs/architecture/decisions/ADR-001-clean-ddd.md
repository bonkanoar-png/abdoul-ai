# ADR-001 — Clean Architecture et Domain-Driven Design

## Contexte

Le backend doit évoluer sans coupler les règles métier à FastAPI ou SQLAlchemy.

## Décision

Séparer API, Application, Domain et Infrastructure. Le Domain porte les entités, invariants et
contrats ; les dépendances techniques restent aux frontières.

## Conséquences

Les règles sont testables sans base ni serveur. Le mapping et l'injection ajoutent du code explicite,
mais empêchent la fuite des modèles techniques entre couches.

## Alternatives rejetées

- architecture FastAPI organisée uniquement par routes ;
- Active Record avec logique métier dans les modèles ORM ;
- accès SQLAlchemy direct depuis tous les endpoints.
