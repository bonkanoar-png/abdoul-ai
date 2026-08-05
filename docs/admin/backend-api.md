# API backend du CMS Admin

## Architecture

Les routes sous `/api/v1/admin` suivent le flux `router → service → repository → SQLAlchemy`. Le repository est le seul composant Admin qui manipule les sessions SQLAlchemy. Les suppressions sont logiques : `is_active` passe à `false` et les données restent disponibles pour l’audit et une éventuelle restauration.

## Authentification

`POST /api/v1/auth/login` accepte un email et un mot de passe, puis place un JWT de courte durée dans un cookie HttpOnly. Les mots de passe sont hachés avec bcrypt via Passlib. Chaque route Admin résout le compte avec `get_current_admin()`. `POST /api/v1/auth/logout` invalide le cookie navigateur.

Le premier compte peut être initialisé explicitement avec `ADMIN_INITIAL_EMAIL` et `ADMIN_INITIAL_PASSWORD`. Cette opération n’a lieu que lors d’une authentification dont les valeurs correspondent exactement à l’environnement. Le secret de signature `ADMIN_JWT_SECRET` doit être aléatoire, propre à l’environnement et géré par le coffre de secrets en production.

## Endpoints

- `GET|PUT /api/v1/admin/profile`
- `POST /api/v1/admin/documents/upload`
- `GET|POST /api/v1/admin/media`
- `GET /api/v1/admin/statistics`
- `GET /api/v1/admin/audit`
- `GET|POST /api/v1/admin/{experiences,formations,projects,skills,publications,certifications,documents}`
- `GET|PUT|DELETE /api/v1/admin/{resource}/{id}`

Les documents et images sont validés puis stockés via l’abstraction `StorageService`.

## Modèles et migration

Les modèles portfolio existants sont réutilisés. La migration `20260801_06_admin_cms_initial_schema` ajoute `is_active`, `created_by` et `updated_by` aux huit tables éditables, leurs index d’archivage et la table `user_admins` avec les rôles `ADMIN` et `EDITOR`.

Exécution :

```bash
cd backend
alembic current
alembic upgrade head
alembic history
```

## Sécurité

- payloads Pydantic stricts, chaînes et descriptions bornées ;
- erreurs uniformisées par les handlers FastAPI existants ;
- autorisation Bearer obligatoire et expiration JWT ;
- CORS limité aux origines configurées, avec méthodes d’écriture et header `Authorization` explicites ;
- aucune suppression physique via l’API ;
- identifiants `created_by` et `updated_by` préparés pour un futur journal d’audit.

Le rôle est inclus dans le JWT mais l’autorisation fine `ADMIN`/`EDITOR` devra être appliquée aux opérations sensibles lorsque les règles éditoriales seront arrêtées.

## Tests

Les tests couvrent le hachage, le JWT, la protection des routes et le client frontend avec API mockée, notamment la création et l’expiration de token. Les tests PostgreSQL d’intégration nécessitent `TEST_DATABASE_URL`.
