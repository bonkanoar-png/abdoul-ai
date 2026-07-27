# Installation locale

## Prérequis

- Python 3.13 ;
- Node.js 24 et npm ;
- Docker avec Docker Compose ;
- Git.

Toutes les commandes suivantes partent de la racine du dépôt, sauf indication contraire.

## 1. Backend Python

```bash
python3.13 -m venv .venv
source .venv/bin/activate
python -m pip install -r backend/requirements-dev.txt
```

Sous Windows PowerShell, l'activation équivalente est :

```powershell
.venv\Scripts\Activate.ps1
```

## 2. Variables d'environnement

Créer les fichiers locaux à partir des exemples :

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env.local
```

Ces fichiers sont ignorés par Git. Ne jamais y copier de secret destiné à être versionné.

### Exécution sur la machine hôte

Compose expose PostgreSQL et Redis sur `localhost`, tandis que les valeurs `postgres` et `redis`
correspondent aux noms DNS internes du réseau Docker. Pour lancer FastAPI directement sur la
machine, utiliser notamment :

```dotenv
DATABASE_URL=postgresql+asyncpg://abdoul_ai:change-me-local-only@localhost:5432/abdoul_ai
POSTGRES_HOST=localhost
REDIS_HOST=localhost
NEXT_PUBLIC_API_URL=http://localhost:8000
```

`Settings` cherche `.env` dans le répertoire courant. La commande Uvicorn documentée est lancée
depuis la racine et utilise donc le fichier `.env` racine.

## 3. Infrastructure

```bash
docker compose up -d
docker compose ps
```

Services démarrés :

- PostgreSQL/pgvector sur le port 5432 ;
- Redis sur le port 6379.

FastAPI et Next.js ne sont pas des services Compose dans l'état actuel.

Pour arrêter l'infrastructure :

```bash
docker compose down
```

## 4. Backend

```bash
uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload
```

Points de contrôle :

```text
http://localhost:8000/docs
http://localhost:8000/health/live
http://localhost:8000/health/ready
```

La readiness répond `503` si PostgreSQL ou Redis n'est pas accessible.

## 5. Frontend

Dans un second terminal :

```bash
cd frontend
npm ci
npm run dev
```

Ouvrir `http://localhost:3000`.

## État de la base

La migration initiale crée le schéma portfolio complet. Depuis `backend/`, avec `DATABASE_URL`
configurée pour la base cible :

```bash
alembic upgrade head
python -m scripts.seed
```

La migration doit toujours être appliquée avant le seed. Le script initialise uniquement le profil
public avec un UUID déterministe. Sa première exécution crée le profil ; les suivantes détectent le
même identifiant et n'appliquent aucun changement. Le script ne supprime et ne remplace aucune
donnée existante.

## Variables actives

### Backend

| Variable | Rôle |
| --- | --- |
| `APP_NAME` | Nom exposé par FastAPI |
| `APP_ENV` | Environnement `development`, `test` ou `production` |
| `APP_DEBUG` | Mode debug FastAPI |
| `API_V1_PREFIX` | Préfixe de l'API portfolio |
| `BACKEND_HOST`, `BACKEND_PORT` | Valeurs de configuration du backend |
| `DATABASE_URL` | URL SQLAlchemy PostgreSQL async |
| `POSTGRES_*` | Paramètres du contrôle de santé PostgreSQL |
| `REDIS_HOST`, `REDIS_PORT` | Paramètres du contrôle Redis |
| `HEALTHCHECK_TIMEOUT_SECONDS` | Timeout des dépendances |

`BACKEND_HOST` et `BACKEND_PORT` ne remplacent pas automatiquement les options de la commande
Uvicorn.

### Frontend

| Variable | Rôle |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL de base utilisée par le client API serveur |

### Variables réservées

Les variables suivantes figurent dans l'exemple racine, mais aucune fonctionnalité active ne les
utilise :

```text
REDIS_URL
SECRET_KEY
JWT_ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES
OPENAI_API_KEY
MISTRAL_API_KEY
ANTHROPIC_API_KEY
STORAGE_PROVIDER
```

Elles ne sont pas nécessaires au fonctionnement actuel. Ne jamais versionner de mot de passe réel,
de clé d'API, de clé privée ou de `SECRET_KEY`.
