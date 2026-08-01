# Sauvegarde et restauration PostgreSQL

## Stratégie

Le service `postgres-backup` exécute quotidiennement `pg_dump` au format custom compressé. Chaque archive est vérifiée avec `pg_restore --list`, stockée dans le volume Docker `postgres-backups` avec un mode créé sous `umask 077`, puis supprimée après sept jours par défaut.

Paramètres disponibles :

- `BACKUP_INTERVAL_SECONDS` : intervalle, 86400 par défaut ;
- `BACKUP_RETENTION_DAYS` : rétention locale, 7 par défaut.

Les sauvegardes restent locales. Pour une vraie reprise après sinistre, chiffrer et répliquer régulièrement le volume vers un stockage externe avec rétention immuable.

## Créer et vérifier une sauvegarde

Pour lancer une sauvegarde ponctuelle sans perturber le service planifié :

```bash
docker compose run --rm -e BACKUP_RUN_ONCE=true postgres-backup
docker compose exec postgres-backup sh -c 'ls -lh /backups && pg_restore --list "$(ls -1t /backups/*.dump | head -n 1)" >/dev/null'
```

Ne copiez pas les archives dans Git. Elles contiennent les données de la base et doivent être traitées comme confidentielles.

## Test de restauration isolé

Ne testez jamais une restauration sur la base active. Créez une base temporaire, restaurez et vérifiez-la :

```bash
docker compose exec postgres createdb -U "$POSTGRES_USER" abdoul_ai_restore_test
docker compose exec postgres-backup sh -c 'pg_restore --clean --if-exists --no-owner --host=postgres --username="$POSTGRES_USER" --dbname=abdoul_ai_restore_test "$(ls -1t /backups/*.dump | head -n 1)"'
docker compose exec postgres psql -U "$POSTGRES_USER" -d abdoul_ai_restore_test -c 'SELECT count(*) FROM alembic_version;'
docker compose exec postgres dropdb -U "$POSTGRES_USER" abdoul_ai_restore_test
```

## Procédure d'urgence

1. Stopper les écritures applicatives et noter l'heure de l'incident.
2. Identifier la dernière archive valide avec `pg_restore --list`.
3. Créer une nouvelle base vide ; ne pas écraser immédiatement la base sinistrée.
4. Restaurer avec `pg_restore --no-owner`, puis contrôler la version Alembic et les tables critiques.
5. Pointer temporairement le backend vers la base restaurée et tester `/health/ready` et les routes publiques.
6. Basculer seulement après validation, conserver l'ancienne base pour l'analyse, puis documenter l'incident.

## Redis

Redis sert actuellement de dépendance de disponibilité et de cache. AOF est activé dans le volume `redis-data`, mais aucun backup Redis distinct n'est réalisé : les données doivent pouvoir être régénérées. Si Redis accueille ultérieurement des données irremplaçables, définir une politique RDB/AOF externalisée avant ce changement d'usage.

## Limites et sécurité

- Le volume de backup est sur le même hôte : panne disque, vol ou suppression du serveur peuvent détruire base et copies.
- Le mot de passe PostgreSQL est injecté par environnement dans le conteneur ; utiliser un secret de déploiement, le faire tourner et limiter l'accès Docker.
- Tester la restauration périodiquement est indispensable : une archive non restaurée n'est pas une garantie de reprise.
- La rotation par âge suppose une horloge hôte correcte et ne fournit ni chiffrement ni verrouillage immuable.
