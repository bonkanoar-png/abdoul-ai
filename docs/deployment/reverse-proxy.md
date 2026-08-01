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

Le port hôte `443` est relié au listener TLS de préparation, qui refuse les handshakes tant qu’aucun
certificat réel n’est installé. Aucun faux certificat n’est versionné.

Sur l’hôte de production :

1. obtenir un certificat pour le domaine avec le gestionnaire ACME choisi ;
2. monter `fullchain.pem` et `privkey.pem` dans `nginx/certs/` avec des permissions lisibles par
   l’UID 101 ;
3. copier `nginx/conf.d/tls.conf.example` vers `nginx/conf.d/tls.conf` ;
4. adapter `server_name` et retirer le bloc TLS de préparation de `default.conf` ;
5. valider avec `nginx -t`, redémarrer Nginx puis tester le renouvellement ;
6. ajouter la redirection HTTP vers HTTPS seulement après cette validation.

Le répertoire de certificats ne doit contenir dans Git que `.gitkeep`. Les clés privées doivent être
fournies par le système de déploiement ou un volume externe.

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
- Le renouvellement ACME, les permissions des clés et leur rechargement doivent être supervisés.
- Les logs Nginx vont vers stdout/stderr ; leur collecte, rotation et rétention relèvent de la plateforme.
