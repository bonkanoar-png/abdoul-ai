# Périmètre fonctionnel actuel

Ce document distingue les fonctionnalités livrées des structures ou idées prévues pour des phases
ultérieures.

## Fonctionnalités actuelles

### Backend

- API de santé, portfolio et ressources publiques en lecture seule ;
- Domain, contrats de repositories, use cases, services et DTO ;
- repositories SQLAlchemy async et mappers ORM vers Domain ;
- schémas Pydantic et erreurs API normalisées ;
- migrations Alembic du schéma Backend Core ;
- seed idempotent du profil public ;
- conversations et messages persistés en lecture seule ;
- vérification de disponibilité Redis ;

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

- aucune commande d'écriture via l'API ;
- aucun seed de contenu complet au-delà du profil ;
- aucune authentification ;
- aucune interface d'administration ;
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

Les couches `domain` et `application` sont implémentées pour le Backend Core. Les emplacements
`llm`, `rag` et `storage` restent préparatoires et ne prouvent aucune fonctionnalité IA.
