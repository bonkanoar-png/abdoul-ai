# Finalisation professionnelle du CMS

## Architecture

Le CMS suit `UI → cookie HttpOnly → FastAPI → permissions → services → repositories → PostgreSQL/Storage`. Les routes ne manipulent jamais directement le système de fichiers. Les métadonnées restent transactionnelles en base et les binaires passent par `StorageService`.

## Authentification et RBAC

Le login place le JWT dans `access_token`, cookie HttpOnly, `SameSite=Lax`, limité au chemin `/api/v1`. `Secure` est automatique en production et configurable pour le développement. Le logout journalise l’action puis supprime le cookie.

`ADMIN` possède toutes les permissions. `EDITOR` peut lire, créer et modifier le contenu, mais pas supprimer, gérer les documents, utilisateurs, statistiques ou paramètres. `require_permission()` protège les opérations sensibles.

## Documents et stockage

Les PDF, PNG, JPEG et WEBP sont acceptés jusqu’à la limite `UPLOAD_MAX_BYTES`. Le nom d’origine n’est jamais utilisé comme chemin : un UUID devient le nom stocké, et chaque chemin est résolu sous la racine configurée pour bloquer la traversée.

`LocalStorage` utilise le volume Docker `uploads-data`. `S3CompatibleStorage` formalise le contrat de production sans intégrer de credentials ni de SDK avant le choix du fournisseur.

Sauvegarde locale : arrêter les écritures, archiver le volume `uploads-data`, puis vérifier le checksum de l’archive. La restauration doit remettre le volume et la sauvegarde PostgreSQL du même point temporel avant de relancer le backend.

## Médias et relations

La table `media` porte l’URL, le chemin, le MIME, la taille, le texte alternatif et l’auteur. Les tables d’association relient médias, technologies et compétences aux projets, expériences, formations et certifications. Les clés utilisent `RESTRICT`, sans cascade destructive.

## Audit

`audit_logs` est append-only et conserve acteur, action, ressource, valeurs avant/après, IP, user-agent, request ID et date. Login, logout, upload et mutations de contenu produisent une entrée.

## Statistiques

`GET /api/v1/admin/statistics` calcule les volumes principaux et la dernière activité. L’accès nécessite `STATISTICS_VIEW`.

## Sécurité

- validation Pydantic et limites de taille ;
- whitelist MIME ;
- cookie inaccessible à JavaScript ;
- aucune interpolation HTML du contenu riche : le Markdown reste du texte ;
- permissions vérifiées côté API, indépendamment de l’affichage frontend ;
- volume uploads isolé du code applicatif en lecture seule.
