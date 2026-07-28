# Environnement frontend

Le frontend est une application Next.js avec App Router, TypeScript strict et Tailwind CSS. Il se
trouve dans `frontend/` et utilise npm avec le lockfile versionné.

## Installation locale

Depuis la racine du dépôt :

```bash
cp frontend/.env.example frontend/.env.local
cd frontend
npm ci
npm run dev
```

Le serveur de développement est disponible sur `http://localhost:3000`.

## Configuration de l'API

La variable publique suivante configure l'origine du backend :

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Elle doit contenir une origine HTTP ou HTTPS, sans chemin métier. Le module
`src/lib/api/config.ts` centralise sa lecture, supprime le slash final et refuse les protocoles non
HTTP. En l'absence de valeur, l'environnement local utilise `http://localhost:8000`.

Le fichier `.env.local` reste local et ne doit contenir aucun secret. Seul `.env.example` est
versionné.

## Commandes qualité

Depuis `frontend/` :

```bash
npm run lint
npm run typecheck
npm run test
npm run format:check
npm run build
```

ESLint applique les règles Next.js et TypeScript. Prettier contrôle le formatage, Vitest exécute les
tests, TypeScript compile sans émission et `next build` valide la production.

## Organisation

Les tests de composants et services restent proches des fichiers testés. La configuration commune
de Vitest se trouve dans `src/test/setup.ts`. Les modules transverses liés à l'API sont regroupés
dans `src/lib/api/`.
