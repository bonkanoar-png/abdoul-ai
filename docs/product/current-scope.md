# Périmètre fonctionnel actuel

Ce document distingue les fonctionnalités livrées des structures ou idées prévues pour des phases
ultérieures.

## Fonctionnalités actuelles

### Backend

- API de liveness et readiness ;
- API portfolio agrégée en lecture seule ;
- schémas Pydantic publics ;
- modèle de données initial ;
- accès PostgreSQL asynchrone ;
- vérification de disponibilité Redis ;
- configuration Alembic sans migration métier.

### Frontend

- interface portfolio responsive ;
- design system minimal ;
- rendu Next.js par Server Components ;
- récupération serveur du portfolio ;
- états de chargement, portfolio absent et API indisponible.

### Ingénierie

- tests backend et frontend ;
- couverture backend ;
- lint, formatage et typage statique ;
- hooks pre-commit ;
- CI GitHub Actions avec permissions en lecture seule.

## Limites actuelles

- aucune migration métier ;
- aucun seed ;
- aucune authentification ;
- aucune interface d'administration ;
- aucune écriture via l'API ;
- aucune logique de cache Redis ;
- aucun déploiement de production.

## Fonctionnalités futures uniquement

Les éléments suivants ne sont pas implémentés :

```text
Authentification
RAG
Agents IA
Chatbot
SaaS multi-tenant
Billing
Marketplace
```

Les dossiers `domain`, `application`, `llm`, `rag` et `storage` sont des emplacements préparatoires.
Ils ne doivent pas être interprétés comme la preuve de fonctionnalités correspondantes.
