# ADR-004 — Stratégie de migrations Alembic

## Contexte

Le schéma PostgreSQL doit évoluer de façon reproductible et réversible.

## Décision

Versionner des révisions Alembic ordonnées, explicites et réversibles. Appliquer les migrations avant
les seeds ; conserver les données initiales hors des révisions de schéma.

## Conséquences

Un environnement neuf peut atteindre `head` de manière déterministe et revenir d'une révision.
Chaque changement ORM nécessitant un changement de schéma doit être accompagné d'une migration
revue et testée.

## Alternatives rejetées

- `metadata.create_all()` en production ;
- modifications manuelles de la base ;
- insertion des données métier dans les migrations de structure.
