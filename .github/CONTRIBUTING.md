# Contribuer à Abdoul AI

Merci de contribuer à Abdoul AI. Les changements doivent rester limités au périmètre annoncé,
être testés et décrire uniquement les fonctionnalités réellement disponibles.

## Prérequis

- Python 3.13 ;
- Node.js 24 et npm ;
- Docker avec Docker Compose ;
- Git.

Consultez le [guide d'installation](../docs/development/setup.md) avant de commencer.

## Workflow de contribution

```text
Issue
  ↓
Branche feature/*
  ↓
Développement
  ↓
Tests qualité
  ↓
Pull Request
  ↓
Review
  ↓
Merge
```

1. Vérifier qu'aucune issue existante ne couvre déjà le besoin.
2. Créer ou compléter une issue structurée.
3. Créer une branche dédiée avec un périmètre limité.
4. Implémenter le changement sans inclure de travaux adjacents.
5. Exécuter les contrôles locaux.
6. Ouvrir une pull request avec le template fourni.
7. Traiter les retours de review avant la fusion.

## Branches

- `main` représente la ligne principale stable du dépôt.
- `develop` représente la ligne d'intégration prévue.
- `feature/*` isole un changement ou un LOT.

La présence de ces branches ne garantit pas qu'une protection distante soit configurée. Vérifiez la
branche cible demandée avant d'ouvrir une pull request. Ne forcez pas un push sur une branche
partagée et ne fusionnez pas sans validation.

## Commits

Utilisez des messages courts, impératifs et centrés sur un seul changement. Préfixes recommandés :

```text
feat:
fix:
test:
docs:
ci:
chore:
```

Exemples :

```text
feat(portfolio): add project filtering
fix(api): handle missing profile
test: cover portfolio error states
docs: clarify local setup
ci: add quality validation
chore: update development tooling
```

Évitez de mélanger code métier, documentation, dépendances et infrastructure dans un même commit
sans nécessité explicite.

## Contrôles locaux obligatoires

### Backend

Depuis la racine du dépôt :

```bash
ruff check backend
ruff format --check backend
mypy backend/app backend/tests
pytest
```

### Frontend

Depuis `frontend/` :

```bash
npm run format:check
npm run lint
npm run typecheck
npm run test
npm run build
```

### Pre-commit

```bash
pre-commit run --all-files
```

La CI GitHub Actions répète les contrôles essentiels sur les pushes et pull requests. Une réussite
locale ne remplace pas la validation de la CI.

## Pull requests

Une pull request doit :

- expliquer le résultat et le LOT ou l'issue concernés ;
- lister les changements et le hors périmètre ;
- rester suffisamment petite pour être relue ;
- inclure ou adapter les tests pertinents ;
- mettre à jour la documentation lorsque le comportement documenté change ;
- passer tous les contrôles CI ;
- recevoir la review attendue avant fusion.

N'incluez pas de refactoring opportuniste ou de dépendance sans rapport avec l'objectif annoncé.

## Sécurité

- Ne versionnez jamais `.env`, mots de passe, tokens, clés API ou clés privées.
- Expurgez les logs, captures et exemples avant de les publier.
- Gardez chaque pull request limitée au scope annoncé.
- Signalez les vulnérabilités en suivant la [politique de sécurité](SECURITY.md), jamais dans une
  issue publique.
