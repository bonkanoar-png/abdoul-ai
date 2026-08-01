# Reverse proxy et préparation HTTPS

## Choix de Nginx

Nginx est retenu pour ce portfolio : le routage est limité à deux upstreams, sa configuration est
explicite et versionnée, et il n’a pas besoin d’accéder au socket Docker. Traefik simplifierait
l’émission automatique de certificats avec Let's Encrypt, mais ajouterait des labels, un mécanisme
de découverte Docker et une surface de permissions inutile à ce stade.

## Architecture de production

```text
Internet :80 / :443
        │
      Nginx
  ┌─────┴─────┐
  │           │
  /       /api/*
  │           │
Next.js    FastAPI
              │
        PostgreSQL / Redis
```

Nginx relie `proxy-network`, `frontend-network` et `backend-network`. Next.js appartient uniquement
au réseau frontend. FastAPI relie le réseau backend au réseau de données. PostgreSQL et Redis ne
possèdent aucun port publié dans la configuration production.

## Routage et URLs

- `/` et toutes les routes hors `/api/` sont transmises à `frontend:3000`.
- `/api/*` conserve son chemin et est transmis à `backend:8000`.
- `/nginx-health` répond directement depuis Nginx et sert au healthcheck Compose.

L’origine publique est `PUBLIC_SITE_URL`, par exemple `https://portfolio.example.com`. L’API visible
par le navigateur est same-origin à `${PUBLIC_SITE_URL}/api`. Les services Next.js actuels étant
server-only, ils utilisent `http://nginx:8080` sur le réseau Docker. Avant toute migration vers des
fetchs client, la configuration frontend devra accepter l’URL relative `/api` ou distinguer URL
serveur et URL navigateur.

FastAPI autorise explicitement `PUBLIC_SITE_URL` via CORS. Le routage same-origin ne nécessite pas
CORS pour les navigateurs, mais cette valeur reste utile pour les accès directs contrôlés.

## Headers de sécurité

Nginx ajoute sur toutes les réponses :

- `X-Frame-Options: DENY` ;
- `X-Content-Type-Options: nosniff` ;
- `Referrer-Policy: strict-origin-when-cross-origin` ;
- une `Permissions-Policy` restrictive ;
- une CSP compatible avec l’hydratation Next.js actuelle.

La CSP autorise encore les scripts et styles inline nécessaires à Next.js. Elle devra être mesurée
en staging avant d’être renforcée avec des nonces. HSTS est uniquement présent dans l’exemple TLS :
il ne doit jamais être activé avant que HTTPS et son renouvellement soient fiables.

## Activation HTTPS

La production utilise Nginx et Certbot avec des volumes Docker séparés pour les certificats et le
challenge ACME. Aucun certificat ou clé privée n’est versionné. Le premier certificat doit être
obtenu avant le démarrage du listener TLS :

```bash
scripts/deployment/bootstrap-tls.sh
```

Certbot crée le certificat sous le nom stable `abdoul-ai`, attendu par `tls.conf`. Nginx conserve le
challenge HTTP et redirige le reste vers HTTPS. Le renouvellement et le rechargement Nginx utilisent
`scripts/deployment/renew-tls.sh`. La procédure DNS, le timer recommandé et les contrôles sont
détaillés dans `production-runbook.md`.

## Commandes de validation

```bash
docker compose --env-file .env.production \
  -f compose.yaml -f compose.prod.yaml config
docker compose --env-file .env.production \
  -f compose.yaml -f compose.prod.yaml up -d --build --wait
curl -I http://localhost/
curl -I http://localhost/api/v1/profile
```

`compose.prod.yaml` est un override et doit toujours être combiné avec `compose.yaml`.

## Risques opérationnels

- Une redirection HTTPS activée avant les certificats provoquerait une indisponibilité ou une boucle.
- Une CSP trop stricte peut bloquer l’hydratation, les images ou de futurs appels WebSocket.
- Le proxy transmet les headers Upgrade, mais tout futur WebSocket doit être testé de bout en bout.
- Une mauvaise origine CORS peut bloquer les accès directs au backend.
- Le renouvellement ACME, l’expiration et le rechargement Nginx doivent être supervisés.
- Les logs Nginx vont vers stdout/stderr ; leur collecte, rotation et rétention relèvent de la plateforme.
