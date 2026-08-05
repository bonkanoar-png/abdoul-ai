# Durcissement final du CMS

## JWT et Redis

Chaque JWT contient un `jti`. Au logout, le `jti` est ajouté sous `jwt:blacklist:{jti}` avec un TTL égal à la durée restante du token. La dépendance d’authentification consulte Redis avant d’autoriser la requête. L’audit conserve `TOKEN_REVOKE`.

## Médias

Les projets, expériences, formations et certifications exposent des routes de consultation, association, réordonnancement et dissociation. `DOCUMENT_MANAGE` est obligatoire pour muter une galerie. Les services vérifient l’existence active du contenu et du média avant l’association.

## Fichiers

La validation applique successivement limite de taille, whitelist MIME, signature binaire et `FileSecurityScanner`. `NoOpScanner` rend le point d’extension explicite en développement. En production, il doit être remplacé par ClamAV ou un scanner cloud avec politique fail-closed.

Signatures reconnues : PDF, PNG, JPEG et WEBP. Le nom client ne devient jamais un chemin de stockage.

## Sauvegardes

Le volume `uploads-data` est archivé dans `uploads-backup-data`, avec timestamp UTC, compression, permissions `0600` et rotation. Les sauvegardes fichiers et PostgreSQL doivent être coordonnées et testées par hash.
