# Architecture frontend

Le frontend est une application Next.js 16 utilisant React 19, TypeScript strict et l'App Router.

## Arborescence

```text
frontend/src/
├── app/
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
├── features/
│   └── portfolio/
├── hooks/
├── lib/
├── test/
└── types/
```

Les dossiers `hooks/` et certaines racines historiques ne contiennent encore que des placeholders.

## App Router et rendu serveur

`app/page.tsx` est un Server Component asynchrone forcé en rendu dynamique. Il récupère le portfolio
à chaque requête et compose les sections visuelles.

`app/loading.tsx` fournit l'état de chargement. En cas de portfolio absent ou d'API indisponible, la
page affiche un état statique explicite.

## Accès à l'API

```text
page.tsx
   |
   v
get-portfolio.ts
   |
   v
api-client.ts
   |
   v
FastAPI /api/v1/portfolio
```

Le client et le service importent `server-only`. Le navigateur ne contacte donc pas directement
FastAPI pour le portfolio. Le client utilise le `fetch` natif, un timeout de cinq secondes et
`cache: "no-store"`.

## Composants

Le design system minimal utilise Tailwind CSS v4 :

- `Button` et `Container` comme primitives ;
- `Header` et `Footer` pour le layout ;
- `Hero` et `SectionHeading` comme composants communs ;
- composants portfolio pour le profil, les expériences, les projets et les compétences.

Les composants sont responsive, sémantiques et restent des Server Components.

## Types et tests

Le contrat portfolio TypeScript est centralisé dans `src/types/portfolio.ts`.

Vitest, Testing Library et jsdom couvrent :

- le client API ;
- le service portfolio ;
- le rendu des composants ;
- les états vides et les erreurs ;
- la validation des liens externes.

ESLint contrôle les conventions Next.js, TypeScript effectue le contrôle statique et Prettier
applique le formatage ainsi que l'ordre des classes Tailwind.
