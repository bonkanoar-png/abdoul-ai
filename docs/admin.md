# Administration du portfolio

## Architecture

L’espace `/admin` est un CMS frontend bâti avec l’App Router. Le layout et les pages restent des Server Components par défaut ; seuls la navigation, les tableaux, formulaires et modales interactifs sont des Client Components.

La couche `features/admin/services` expose un contrat de repository asynchrone (`getAll`, `getById`, `create`, `update`, `remove`). Son implémentation actuelle conserve des jeux de données mockés en mémoire et les valide avec les schémas Zod du domaine admin. Elle pourra être remplacée par un adaptateur HTTP sans modifier les composants.

## Ressources gérées

- profil ;
- expériences ;
- formations ;
- compétences ;
- projets ;
- publications ;
- certifications.

Les documents et paramètres disposent de routes préparatoires. Les listes offrent recherche, tri et pagination locale. Les formulaires partagés gèrent création, édition, erreurs de validation, chargement et confirmation de suppression.

## Fonctionnement actuel

Les mutations ne sont pas persistées après un rechargement complet : le repository est volontairement mocké. Aucune authentification réelle n’est active. La route `/admin/login` constitue seulement un emplacement futur et l’espace doit rester inaccessible en production tant qu’une protection serveur n’a pas été ajoutée.

Les routes admin déclarent `noindex` dans leurs métadonnées et sont exclues par `robots.ts`.

## Future connexion API

Une prochaine phase ajoutera un adaptateur `FastAPIAdminRepository` implémentant le même contrat. Il appellera les endpoints d’administration FastAPI, qui persisteront les données dans PostgreSQL. Il faudra alors ajouter l’authentification, la gestion des autorisations, les jetons CSRF si nécessaire, la persistance des uploads et des tests de contrat API.

