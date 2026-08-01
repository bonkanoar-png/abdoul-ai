# CI Docker, GHCR et sécurité de la supply chain

## Architecture du workflow

Le workflow `.github/workflows/docker-build.yml` complète les workflows applicatifs existants. Une
matrice construit séparément les images frontend et backend sur les pushes vers `main`, les branches
`feature/*`, les tags SemVer `v*.*.*` et toutes les pull requests.

```text
Checkout → Buildx/cache GHA → build local → Trivy → SBOM → politique CRITICAL → GHCR
```

Les pull requests construisent, scannent et produisent les artefacts sans se connecter au registry.
Les pushes autorisés utilisent uniquement le `GITHUB_TOKEN` fourni par GitHub Actions. Les actions
externes sont épinglées à des commits immuables, avec leur version lisible en commentaire.

## Images et registry

Le registry retenu est GitHub Container Registry :

- `ghcr.io/bonkanoar-png/abdoul-ai-frontend`
- `ghcr.io/bonkanoar-png/abdoul-ai-backend`

Le workflow demande uniquement `contents: read` et `packages: write`. Aucun mot de passe Docker Hub,
token personnel ou clé privée n’est requis. La visibilité et la politique de rétention des packages
GHCR doivent être configurées dans GitHub après la première publication.

## Convention de tags

| Source          | Tags produits                           | Publication |
| --------------- | --------------------------------------- | ----------- |
| Pull request    | `pr-<numéro>`, `sha-<court>`            | Non         |
| Branche feature | nom de branche normalisé, `sha-<court>` | Oui         |
| `main`          | `main`, `latest`, `sha-<court>`         | Oui         |
| Tag `v1.2.3`    | `1.2.3`, `1.2`, `sha-<court>`           | Oui         |

`latest` est un alias de découverte, pas une référence de déploiement. Staging et production doivent
utiliser un tag SemVer ou SHA immuable via `IMAGE_TAG` dans la superposition Compose production. Un
rollback consiste à remettre l’ancien tag immuable puis à relancer `docker compose pull` et `up`.

## Labels OCI et versionnement

Les deux Dockerfiles acceptent :

- `IMAGE_TAG`
- `BUILD_VERSION`
- `GIT_SHA`
- `OCI_SOURCE`

Ils produisent les labels `org.opencontainers.image.source`, `.revision`, `.version` et `.ref.name`.
Le workflow les alimente depuis les métadonnées GitHub et le commit exact.

## Cache BuildKit

Buildx utilise le backend de cache GitHub Actions avec un scope distinct par composant :

```text
cache-from: type=gha,scope=frontend|backend
cache-to: type=gha,mode=max,scope=frontend|backend
```

Le premier build alimente le cache ; les suivants réutilisent les couches compatibles. Les contextes
et `.dockerignore` limitent les invalidations et empêchent l’inclusion des environnements locaux.

## Scans de vulnérabilités

Trivy analyse les paquets OS et bibliothèques applicatives :

- HIGH et CRITICAL sont exportées dans un rapport SARIF informatif ;
- les CRITICAL corrigibles bloquent la publication ;
- `ignore-unfixed` évite de bloquer sur une vulnérabilité sans correctif disponible.

Cette politique donne un garde-fou exploitable sans rendre les HIGH immédiatement bloquantes. Les
HIGH doivent être triées et corrigées dans un délai défini. Toute exception CRITICAL doit être rare,
temporaire, documentée et revue ; aucune liste d’exclusion permanente n’est fournie ici.

## SBOM

Trivy génère un SBOM CycloneDX JSON par image. Les SBOM et rapports SARIF sont conservés quatorze
jours comme artefacts GitHub Actions. Ils permettent l’inventaire des dépendances, l’analyse après
publication et la réponse à une nouvelle vulnérabilité.

## Signature future

Cosign n’est pas activé dans ce lot : signer sans politique de vérification au déploiement donnerait
une garantie incomplète. La prochaine étape recommandée est la signature keyless avec l’identité OIDC
GitHub Actions, l’attestation de provenance et une vérification obligatoire avant déploiement. Elle
nécessitera `id-token: write` uniquement dans le job de publication.

## Validation locale

```bash
docker build \
  --build-arg IMAGE_TAG=local \
  --build-arg BUILD_VERSION=local \
  --build-arg GIT_SHA="$(git rev-parse HEAD)" \
  -t abdoul-ai-frontend:local frontend

docker build \
  --build-arg IMAGE_TAG=local \
  --build-arg BUILD_VERSION=local \
  --build-arg GIT_SHA="$(git rev-parse HEAD)" \
  -t abdoul-ai-backend:local backend

docker image inspect abdoul-ai-frontend:local --format '{{json .Config.Labels}}'
docker image inspect abdoul-ai-backend:local --format '{{json .Config.Labels}}'
```

Si Trivy est installé localement :

```bash
trivy image --severity HIGH,CRITICAL abdoul-ai-frontend:local
trivy image --format cyclonedx --output frontend.cdx.json abdoul-ai-frontend:local
```

## Secrets et risques

- Les fichiers `.env` et `.env.production` restent ignorés par Git.
- Aucun secret n’est passé comme build arg, car les arguments peuvent apparaître dans les métadonnées.
- Préférer OIDC aux secrets longue durée pour les services cloud futurs.
- Limiter les permissions GitHub, protéger les environnements et planifier la rotation des secrets.
- Le stockage GHCR et des artefacts a un coût et exige une politique de rétention.
- Les bases Trivy, builds sans cache et faux positifs peuvent augmenter le temps CI.
- Les images de base et dépendances doivent rester mises à jour même lorsque le scan passe.
