# Stratégie de scalabilité

## Limites actuelles

- **Frontend Next.js** : stateless dans son image standalone, horizontalement réplicable derrière un load balancer, sous réserve de déplacer toute session locale.
- **FastAPI** : processus stateless mais métriques actuellement en mémoire par processus ; plusieurs réplicas sont agrégeables par Prometheus, tandis que les compteurs redémarrent avec chaque processus.
- **PostgreSQL** : instance unique et volume local, principal blocage de disponibilité et de montée en charge.
- **Redis** : instance unique avec AOF, utilisé comme cache reconstructible.
- **Nginx/VPS** : point unique de panne et limites CPU, RAM, réseau et disque d'un hôte.

## Trajectoire

1. Mesurer saturation, latence et budget d'erreur avant de scaler.
2. Introduire un load balancer géré et au moins deux réplicas frontend/backend.
3. Remplacer PostgreSQL local par une offre managée avec PITR, réplica et sauvegardes multi-zone.
4. Utiliser Redis managé avec authentification/TLS si son rôle devient critique.
5. Externaliser Loki, Prometheus/Grafana et les fichiers persistants.
6. Envisager un orchestrateur seulement lorsque déploiements multi-hôtes, autoscaling et orchestration justifient sa complexité.

Avant réplication, supprimer `container_name`, tester les migrations avec plusieurs versions applicatives, garantir la compatibilité descendante du schéma et définir drain/rolling update. L'autoscaling doit utiliser des métriques stables et conserver une marge pour les pics.

## Coûts et haute disponibilité

La haute disponibilité augmente coûts cloud, trafic, stockage et astreinte. La stack actuelle n'est ni multi-région ni tolérante à la perte d'une zone. Définir d'abord RPO, RTO et impact financier, puis choisir le niveau de redondance correspondant.
