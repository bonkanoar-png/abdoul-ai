# Base de données

Abdoul AI utilise PostgreSQL avec SQLAlchemy 2 en mode asynchrone et le pilote asyncpg.

## Tables

```text
profiles
experiences
projects
skills
project_skills
```

## Relations

```text
Profile
├── Experiences
└── Projects
    └── Skills
```

- Un profil possède plusieurs expériences.
- Un profil possède plusieurs projets.
- Un projet possède plusieurs compétences.
- Une compétence peut être associée à plusieurs projets.
- `project_skills` porte la relation many-to-many avec une clé primaire composite.

La suppression d'un profil cascade vers ses expériences et projets. Les associations
projet-compétence utilisent également des clés étrangères avec suppression en cascade.

## Modèles

### Profile

Identité du propriétaire du portfolio : nom, titre, biographie, localisation, email et liens
publics facultatifs.

### Experience

Entreprise, rôle, description, dates et ordre d'affichage. Des contraintes vérifient que la date de
fin suit la date de début et qu'une expérience actuelle n'a pas de date de fin.

### Project

Slug unique, titre, résumé, description, liens facultatifs, image facultative, état mis en avant et
ordre d'affichage.

### Skill

Nom unique, catégorie et ordre d'affichage.

## Infrastructure locale

`compose.yaml` utilise l'image `pgvector/pgvector:pg17`. Elle rend pgvector disponible dans
l'environnement PostgreSQL, mais aucune extension, colonne vectorielle ou requête vectorielle n'est
actuellement déclarée par le projet.

## Alembic

Alembic est configuré dans `backend/alembic.ini` et `backend/alembic/env.py`. L'URL est lue depuis
`DATABASE_URL` et n'est pas inscrite dans `alembic.ini`.

Depuis `backend/` :

```bash
alembic current
alembic upgrade head
```

À ce stade :

- aucune migration métier n'existe dans `backend/alembic/versions` ;
- aucun seed n'est fourni ;
- la documentation ne suppose donc pas que les tables ou données sont déjà créées.
