# Contribution

## Workflow Git

```text
feature branch
      |
      v
commit
      |
      v
push
      |
      v
review
      |
      v
merge
```

Créer une branche depuis `develop`, limiter chaque changement à un objectif cohérent et ne jamais
modifier directement `main` ou `develop`.

## Commits

Utiliser un message explicite au format Conventional Commits :

```text
type(scope): description concise
```

Exemples : `feat(profile): add profile vertical slice`, `test: add repository coverage`,
`docs(api): document public endpoints`.

## Validation avant Pull Request

Backend, depuis la racine :

```bash
ruff check backend
ruff format --check backend
mypy backend/app backend/tests
pytest --cov=backend/app
```

Frontend, depuis `frontend/` :

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

Vérifier aussi :

```bash
git diff --check
pre-commit run --all-files
```

La Pull Request doit décrire son périmètre, ses validations et les éventuels risques. Les contrôles
CI doivent réussir et la revue doit être obtenue avant intégration. Ne pas versionner de secret,
d'artefact de build ou de fichier d'environnement local.
