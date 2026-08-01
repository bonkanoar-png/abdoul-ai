# Durcissement Docker et environnements

## Architecture

Le développement conserve un réseau bridge partagé afin de rester simple à diagnostiquer. Les
quatre ports sont publiés sur la machine locale : frontend `3000`, backend `8000`, PostgreSQL `5432`
et Redis `6379`.

La configuration de production s’applique en superposant `compose.prod.yaml`. Elle ajoute un
[reverse proxy Nginx](reverse-proxy.md) et sépare les flux :

```text
Internet
        │
  proxy-network
        │
      Nginx
     ┌──┴──┐
frontend  backend
        │
 data-network
     ┌──┴───┐
 postgres  redis
```

Seul Nginx publie les ports HTTP/HTTPS. Frontend, FastAPI, PostgreSQL et Redis restent privés.

## Sécurité des conteneurs

- Le frontend utilise l’utilisateur `node` (UID/GID 1000) fourni par l’image officielle.
- Le backend utilise `appuser` (UID/GID 10001) et les sources lui appartiennent.
- Les services applicatifs suppriment toutes les capabilities Linux, activent
  `no-new-privileges` et utilisent un filesystem read-only.
- Un tmpfs limité à 64 Mio reste disponible dans `/tmp` pour les bibliothèques qui en ont besoin.
- PostgreSQL et Redis conservent leurs permissions d’image officielles et leurs volumes en écriture ;
  leur entrypoint doit pouvoir préparer les données et changer d’utilisateur.

Le filesystem read-only n’est pas appliqué aux services de données, car il serait incompatible avec
leur initialisation et leur persistance. Les migrations et le seed modifient la base, pas l’image du
backend, et restent exécutables depuis le conteneur non-root.

## Limites de ressources

Les limites locales empêchent un service défaillant de monopoliser l’hôte tout en laissant une marge
adaptée aux builds et au démarrage :

| Service | CPU | Mémoire | PIDs |
| --- | ---: | ---: | ---: |
| Frontend | 1 | 1 Gio | 256 |
| Backend | 1 | 1 Gio | 256 |
| PostgreSQL | 1,5 | 1,5 Gio | 256 |
| Redis | 0,5 | 512 Mio | 128 |

Ces valeurs sont une base et doivent être ajustées à partir de métriques de staging.

## Environnements et variables

Développement :

```bash
docker compose up -d --wait
```

Production préparatoire :

```bash
cp .env.production.example .env.production
# Renseigner les valeurs requises depuis le gestionnaire de secrets.
docker compose --env-file .env.production -f compose.yaml -f compose.prod.yaml config
docker compose --env-file .env.production -f compose.yaml -f compose.prod.yaml up -d
```

`NEXT_PUBLIC_*` est incorporé au build frontend et ne doit jamais contenir de secret. Les URLs
internes utilisent les noms DNS Compose. `PUBLIC_SITE_URL` représente l’origine HTTPS visible par
les utilisateurs.

## Secrets

Les valeurs des fichiers `*.example` ne sont pas des secrets. Le fichier `.env.production` est
ignoré par Git et doit être alimenté au déploiement. Pour une production réelle, préférer des
Docker secrets montés en fichiers ou un gestionnaire externe, puis adapter les entrypoints pour lire
les variantes `_FILE`. La chaîne `DATABASE_URL` doit URL-encoder les caractères réservés du mot de
passe. Redis n’a actuellement aucune authentification : son réseau interne réduit l’exposition mais
une politique d’authentification et de chiffrement reste nécessaire s’il stocke des sessions.

## Sauvegarde et restauration

PostgreSQL est la source durable. Prévoir des sauvegardes `pg_dump` régulières, chiffrées, copiées
hors de l’hôte et testées par restauration avec `pg_restore`. Définir une rétention quotidienne,
hebdomadaire et mensuelle adaptée aux objectifs RPO/RTO. Ne jamais utiliser `docker compose down
--volumes` sur une stack contenant des données utiles.

Redis utilise AOF dans la configuration actuelle. Il doit rester un cache ou un stockage de sessions
reconstructible ; sa persistance ne remplace pas une sauvegarde PostgreSQL.

## Risques résiduels

- Les tags d’images majeurs ne sont pas épinglés par digest.
- Aucun scan automatique d’image ou SBOM n’est ajouté dans ce lot.
- Le reverse proxy, TLS, la rotation des secrets et les sauvegardes automatisées restent externes.
- L’URL API actuelle convient aux Server Components, mais un proxy same-origin sera nécessaire pour
  de futurs appels navigateur.
