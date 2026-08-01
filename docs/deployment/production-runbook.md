# Runbook de production

## Choix d'architecture

Le déploiement cible un VPS Linux avec Docker Compose. Cette option fournit un coût et une charge d'exploitation adaptés à une jeune application SaaS sur une seule instance. Un service cloud managé réduit certaines opérations mais augmente le coût et la dépendance fournisseur. Kubernetes n'est justifié qu'avec plusieurs nœuds, une équipe d'exploitation et des objectifs de disponibilité supérieurs.

## Préparation du serveur

1. Installer une distribution Linux maintenue, Docker Engine et le plugin Compose.
2. Créer un utilisateur de déploiement non-root autorisé à utiliser Docker.
3. Désactiver SSH par mot de passe, interdire la connexion root et utiliser une clé dédiée.
4. Configurer le firewall : autoriser SSH depuis les adresses d'administration, puis TCP 80 et 443. Bloquer 3000, 8000, 5432, 6379, 9090 et 3100.
5. Créer `/opt/abdoul-ai` avec accès limité à l'utilisateur de déploiement.
6. Vérifier depuis une machine extérieure avec `nmap` ou le scanner du fournisseur que seuls 80/443 et le port SSH choisi sont accessibles.

## Domaine et DNS

Créer un enregistrement `A` pour le domaine racine vers l'IPv4 du VPS. Ajouter `AAAA` uniquement si IPv6 est configuré et filtré. `www` peut être un `CNAME` vers le domaine racine. Attendre la propagation et vérifier avec `dig A`, `dig AAAA` et `dig CNAME` avant de demander le certificat.

## Secrets

Copier `.env.production.example` vers `/opt/abdoul-ai/.env.production.local`, avec permissions `0600`. Ce fichier n'est jamais transféré par le workflow ni ajouté à Git. Générer des valeurs aléatoires distinctes pour PostgreSQL et Grafana.

Les secrets GitHub de l'environnement protégé `production` sont :

- `PRODUCTION_SSH_PRIVATE_KEY` ;
- `PRODUCTION_SSH_KNOWN_HOSTS` ;
- `PRODUCTION_SSH_HOST` ;
- `PRODUCTION_SSH_USER`.

La variable d'environnement GitHub `PRODUCTION_DEPLOY_PATH` vaut typiquement `/opt/abdoul-ai`. Configurer au moins un reviewer obligatoire. Faire tourner les clés SSH et mots de passe après incident, départ d'un opérateur, ou selon la politique interne. `REDIS_PASSWORD` et `SECRET_KEY` ne doivent être ajoutés que lorsque l'application les consomme réellement ; ne pas créer de secret factice donnant une fausse garantie.

## Premier certificat TLS

Le port 80 doit être libre et le DNS résolu vers le serveur :

```bash
cd /opt/abdoul-ai
scripts/deployment/bootstrap-tls.sh
curl -I http://$DOMAIN
curl -I https://$DOMAIN
```

Certbot conserve le certificat sous le nom stable `abdoul-ai`. Nginx redirige HTTP vers HTTPS, sauf le healthcheck local et le challenge ACME. TLS 1.2/1.3, HSTS et les headers de sécurité restent actifs.

Ajouter au cron ou au timer systemd, deux fois par jour :

```cron
17 2,14 * * * cd /opt/abdoul-ai && scripts/deployment/renew-tls.sh >> /var/log/abdoul-ai-certbot.log 2>&1
```

Tester périodiquement avec `certbot renew --dry-run` et alerter avant 21 jours de validité restante.

## Déploiement

Le workflow ne s'exécute que depuis `main`, dans l'environnement GitHub `production`. Après approbation, il transfère uniquement l'infrastructure versionnée, se connecte à GHCR avec `GITHUB_TOKEN`, puis lance : pull du tag SHA immuable, backup vérifié, migration Alembic, démarrage et healthchecks.

Déploiement manuel contrôlé :

```bash
cd /opt/abdoul-ai
scripts/deployment/deploy.sh sha-abcdef0
```

## Migrations

Avant chaque migration, lire les révisions Alembic et rechercher les suppressions ou transformations irréversibles. Le script refuse de s'exécuter sans `CONFIRM_MIGRATION=yes`. Il crée d'abord un backup PostgreSQL validé, puis exécute `alembic upgrade head` dans l'image backend ciblée. Les migrations volumineuses doivent être testées sur une copie représentative et planifiées en maintenance.

## Rollback

Le fichier local `.deployed-image` mémorise le dernier tag déployé. Avant une mise à jour, relever ce tag et le digest GHCR. Pour revenir à l'application précédente :

```bash
scripts/deployment/deploy.sh sha-ancien0
```

Cette commande relance les migrations en avant et ne rétrograde jamais automatiquement la base. Si le schéma est incompatible, stopper les écritures, restaurer le backup pré-déploiement vers une nouvelle base selon `backup-restore.md`, valider, puis basculer. Un `alembic downgrade` ne doit être utilisé qu'après examen explicite de la fonction `downgrade` et test sur copie.

## Incidents et exploitation

- Vérifier `docker compose ps`, puis les logs Nginx/backend et les dashboards Grafana.
- Corréler une requête avec `X-Request-ID` dans Loki.
- En cas de certificat expiré, vérifier DNS, firewall, challenge ACME et logs Certbot avant renouvellement manuel.
- En cas de compromission, isoler le serveur, révoquer clés SSH/tokens, faire tourner tous les secrets, reconstruire sur un hôte sain et restaurer une archive vérifiée.
- Conserver les images par digest et les backups hors hôte. Objectif initial recommandé : RPO 24 h et RTO 4 h, à confirmer selon les besoins métier.

## Sauvegardes et disponibilité

La sauvegarde locale quotidienne ne protège pas contre la perte du VPS. Copier de manière chiffrée les archives vers S3, un stockage compatible ou un hôte distant via rclone, avec rétention quotidienne/hebdomadaire/mensuelle et verrouillage objet si disponible. Tester la restauration au moins trimestriellement.

Cette architecture reste mono-instance : panne VPS, maintenance Docker ou saturation disque provoquent une interruption. Une seconde instance, une base managée et un load balancer seront nécessaires pour améliorer la disponibilité.
