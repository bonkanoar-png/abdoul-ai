# Tests

Les suites backend et frontend sont indépendantes et n'utilisent aucun serveur ou service réseau
réel.

## Backend

Depuis la racine, avec l'environnement virtuel activé :

```bash
ruff check backend
ruff format --check backend
mypy backend/app backend/tests
pytest
pytest --cov=backend/app
```

La suite contient des tests unitaires et des tests d'intégration ASGI :

```text
backend/tests/unit/
backend/tests/integration/
```

Les tests couvrent notamment :

- la configuration de la base ;
- les métadonnées et relations SQLAlchemy ;
- les schémas Pydantic ;
- les routes health ;
- les réponses `200`, `404` et `500` du portfolio ;
- la sérialisation des UUID et dates.

La couverture backend observée lors de la mise en place de la qualité est de **92 %**. Cette valeur
est un état courant, pas une garantie permanente ; la commande de couverture reste la source de
vérité.

## Frontend

Depuis `frontend/` :

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```

Vitest utilise Testing Library et jsdom. Les tests couvrent :

- le client HTTP serveur avec `fetch` simulé ;
- le service portfolio ;
- les composants de profil, expériences, projets et compétences ;
- les états vides ;
- la gestion des erreurs et des liens externes.

Aucun test frontend ne contacte une API réelle. Le build Next.js valide également TypeScript et la
construction de la route dynamique.

## Exécuter tous les contrôles locaux

```bash
pre-commit run --all-files
```

Les hooks vérifient Ruff, le formatage Python, Prettier et ESLint sans auto-fix.
