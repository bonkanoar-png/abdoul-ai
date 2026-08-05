# Sauvegarde et restauration des uploads

Le volume `uploads-data` est sauvegardé dans `uploads-backup-data` par le service `uploads-backup`. Chaque archive porte un timestamp UTC, utilise `tar.gz`, reçoit les permissions `0600` et suit `UPLOADS_BACKUP_RETENTION_DAYS`.

Sauvegarde manuelle :

```bash
docker compose run --rm uploads-backup /scripts/uploads-backup.sh backup
```

Restauration contrôlée : arrêter les écritures Admin, identifier l’archive, vérifier son hash et son contenu avec `tar -tzf`, puis exécuter :

```bash
docker compose run --rm uploads-backup /scripts/uploads-backup.sh restore /backups/uploads-YYYYMMDDTHHMMSSZ.tar.gz
```

La sauvegarde PostgreSQL restaurée doit correspondre au même point temporel. Après restauration, vérifier les hashes des fichiers attendus et les URLs depuis l’API Admin.
