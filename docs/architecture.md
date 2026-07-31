# Architecture du système

## Vue globale

Abdoul AI est composé de couches déployables indépendamment. Le frontend ne contacte jamais
directement les systèmes de données.

```text
Utilisateur
    |
    | HTTPS
    v
Next.js (frontend)
    |
    | API HTTP / JSON
    v
FastAPI (backend)
    |
    +----> PostgreSQL + pgvector
    |
    +----> Redis
```

## Frontend

L'application Next.js utilise l'App Router, React, TypeScript strict et Tailwind CSS. Les Server
Components assurent par défaut la récupération et le rendu des données. Les Client Components sont
réservés aux interactions. Les appels backend sont centralisés dans des services, et les réponses
externes sont validées avec Zod avant d'alimenter l'interface.

## Backend

FastAPI expose les routes HTTP et orchestre les cas d'usage. Le domaine reste indépendant du
framework web et de la persistance. SQLAlchemy async implémente l'accès aux données et Pydantic
sérialise les contrats de l'API.

## Données

PostgreSQL est la source de vérité persistante. L'image locale inclut pgvector en préparation de
futurs usages vectoriels. Redis est une dépendance d'infrastructure disponible pour les contrôles
de santé et de futurs besoins transitoires ; le frontend n'y accède pas directement.

## Flux API

1. L'utilisateur ouvre une route Next.js.
2. Le Server Component ou le service de la fonctionnalité demande les données à FastAPI.
3. FastAPI valide la requête et exécute le cas d'usage.
4. La couche Infrastructure lit ou écrit dans PostgreSQL, et consulte Redis lorsque le cas le
   nécessite.
5. La réponse JSON est validée puis rendue par Next.js.

Les origines sont configurées par environnement. `NEXT_PUBLIC_API_URL` désigne FastAPI et
`NEXT_PUBLIC_SITE_URL` l'URL canonique du frontend. Aucune donnée sensible ne doit être placée dans
une variable préfixée par `NEXT_PUBLIC_`.

Pour le détail des couches existantes, consulter les documents
[frontend](architecture/frontend.md), [backend](architecture/backend-architecture.md) et
[base de données](architecture/database.md).
