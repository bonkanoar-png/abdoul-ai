# Disaster recovery

## Objectifs et prérequis

Objectifs initiaux à valider métier : RPO 24 h et RTO 4 h. Conserver hors VPS des backups PostgreSQL chiffrés, les tags/digests d'images, la configuration versionnée et une copie sécurisée des secrets. Tester une restauration trimestrielle.

| Scénario              | Détection                              | Action immédiate                                      | Restauration et validation                                                         |
| --------------------- | -------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Panne application     | BackendDown, 5xx, healthcheck          | suspendre les déploiements, consulter logs/request ID | redémarrer ou rollback image ; vérifier HTTPS, readiness et SLO                    |
| Panne conteneur       | Compose/Prometheus `up=0`              | identifier OOM, disque ou configuration               | recréer sans supprimer les volumes ; vérifier toutes les cibles                    |
| Perte VPS             | sondes externes et SSH indisponibles   | déclarer P1, isoler l'ancien hôte                     | provisionner un VPS sain, restaurer secrets/certificat et dernier backup, puis DNS |
| Corruption PostgreSQL | erreurs SQL/readiness, contrôle backup | stopper les écritures et préserver les preuves        | restaurer dans une nouvelle base, vérifier Alembic et données, puis basculer       |
| Secret compromis      | alerte fournisseur, accès anormal      | révoquer clé/token et isoler la source                | rotation complète, redéploiement, audit des logs et post-mortem                    |

Ne jamais utiliser `docker compose down -v` pendant un incident. Une restauration doit suivre `backup-restore.md` et conserver la base endommagée pour analyse tant que la capacité le permet.
