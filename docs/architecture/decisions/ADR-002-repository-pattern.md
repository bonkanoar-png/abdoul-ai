# ADR-002 — Repository Pattern

## Contexte

Les cas d'usage ont besoin de lire les données sans dépendre de SQLAlchemy.

## Décision

Définir les contrats de repositories dans le Domain et leurs implémentations SQLAlchemy dans
Infrastructure. Les repositories retournent des entités Domain via des mappers dédiés.

## Conséquences

Les use cases acceptent des doubles de test simples et la persistance peut évoluer indépendamment.
Chaque nouvelle ressource exige toutefois un contrat, une implémentation et un mapping cohérents.

## Alternatives rejetées

- sessions SQLAlchemy injectées directement dans Application ;
- repository générique masquant les besoins propres à chaque agrégat ;
- modèles ORM exposés comme objets métier.
