# Développement frontend

## Structure

```text
frontend/
├── src/
│   ├── app/          # routes, layouts et états App Router
│   ├── components/   # composants partagés et primitives UI
│   ├── features/     # modules fonctionnels autonomes
│   ├── lib/          # clients, configuration et utilitaires transverses
│   ├── schemas/      # schémas partagés
│   ├── test/         # configuration et intégration
│   └── types/        # contrats TypeScript partagés
├── tests/e2e/        # scénarios Playwright et mock API
└── messages/         # traductions
```

Dans chaque `feature`, les composants, schémas Zod, services et types restent proches du domaine
fonctionnel concerné. Le dossier `components/` reçoit uniquement ce qui est réellement partagé.

## Conventions de rendu

- Utiliser un Server Component par défaut.
- Ajouter `"use client"` uniquement lorsqu'une interaction navigateur, un état React ou une API Web
  l'exige.
- Garder la récupération de données dans un service séparé du composant d'affichage.
- Ne jamais accéder directement à PostgreSQL ou Redis depuis le frontend.

## Données et validation

Les clients HTTP transverses résident dans `src/lib/api/`. Les services propres à une
fonctionnalité résident dans `src/features/<feature>/services/`. Les réponses externes sont
validées avec Zod, puis converties vers des types utilisables par l'interface. Les composants
doivent prévoir les états de chargement, vide et erreur.

## Configuration

Créer `frontend/.env.local` depuis l'exemple :

```bash
cp frontend/.env.example frontend/.env.local
```

`NEXT_PUBLIC_API_URL` configure l'origine de FastAPI et `NEXT_PUBLIC_SITE_URL` l'origine canonique
du site. Une variable `NEXT_PUBLIC_` est publique : ne jamais y placer de secret.

## Contrôles avant Pull Request

Depuis `frontend/` :

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Le workflow GitHub Actions reproduit ces contrôles avec Node.js 24 et `npm ci`.
