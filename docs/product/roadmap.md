# Abdoul AI Roadmap

Cette roadmap décrit des horizons de travail, sans engagement de date. Seuls les éléments de
**Done** sont implémentés. Les autres sections expriment des priorités ou une vision à valider.

## Done

Lots terminés :

- LOT 1 → LOT 17

Résumé :

- fondation du dépôt et de l'environnement ;
- infrastructure locale PostgreSQL/pgvector et Redis ;
- backend FastAPI et accès SQLAlchemy async ;
- health checks et API portfolio en lecture seule ;
- modèle de données initial et configuration Alembic ;
- frontend Next.js et interface portfolio ;
- intégration frontend/backend côté serveur ;
- tests backend et frontend ;
- qualité, typage statique et pre-commit ;
- CI/CD de validation sans déploiement ;
- documentation technique ;
- collaboration GitHub et politiques de contribution.

La fondation technique est disponible, mais aucune migration métier ni donnée initiale ne rend
encore le portfolio exploitable sur une installation vierge.

## Now

### Migration initiale

Objectifs :

- créer la première migration Alembic ;
- générer le schéma depuis les cinq modèles actuels ;
- vérifier les contraintes, relations et suppressions en cascade ;
- valider l'application de la migration sur une base PostgreSQL vierge ;
- documenter les commandes d'upgrade et de rollback.

Résultat attendu : une installation reproductible crée toutes les tables nécessaires sans
intervention manuelle.

### Seed portfolio

Objectifs :

- ajouter des données portfolio reproductibles ;
- couvrir le profil, les expériences, les projets et les compétences ;
- préserver un contenu de démonstration sans secret ni donnée personnelle sensible ;
- permettre un rendu frontend complet en environnement local ;
- définir une procédure idempotente ou explicitement réinitialisable.

Résultat attendu : l'API portfolio retourne un contenu cohérent après migration et initialisation.

### Validation end-to-end

Objectifs :

- démarrer PostgreSQL et Redis avec Docker Compose ;
- appliquer les migrations ;
- charger le seed ;
- lancer FastAPI puis Next.js ;
- vérifier les health checks ;
- vérifier le rendu réel du portfolio ;
- formaliser une procédure reproductible depuis un clone propre.

Résultat attendu : un développeur peut valider toute la chaîne locale sans connaissance implicite du
projet.

## Next

### Architecture métier backend

- introduire des repositories explicites ;
- définir les services et cas d'usage nécessaires ;
- clarifier les frontières `domain`, `application` et `infrastructure` ;
- ajouter une validation métier indépendante du transport HTTP.

### Gestion du portfolio

- définir un CRUD pour le profil, les expériences, les projets et les compétences ;
- spécifier les règles de tri, d'unicité et de suppression ;
- versionner les contrats d'écriture ;
- protéger les opérations d'administration.

### Administration et sécurité

- choisir une stratégie d'authentification d'administration ;
- définir les autorisations minimales ;
- créer une interface d'administration seulement après sécurisation de l'API ;
- journaliser les changements sensibles sans exposer de secrets.

### Expérience frontend

- ajouter des pages détail projet ;
- compléter la navigation ;
- concevoir les formulaires de gestion ;
- traiter les médias et leurs états d'erreur ;
- améliorer l'accessibilité et les tests des nouveaux parcours.

## Later

Tous les éléments de cette section sont futurs et non implémentés.

### SaaS

- multi-tenant ;
- organisations ;
- RBAC ;
- billing ;
- quotas.

### Plateforme API

- API publique ;
- SDK ;
- webhooks ;
- documentation développeur externe ;
- stratégie de compatibilité.

### IA

- LLM ;
- RAG ;
- embeddings ;
- agents ;
- MCP ;
- marketplace d'outils.

Ces sujets nécessitent des décisions séparées sur la sécurité, les données, les coûts,
l'observabilité et la gouvernance. Les dossiers préparatoires actuels ne constituent pas une
implémentation.
