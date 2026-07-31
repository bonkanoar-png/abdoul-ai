# Stratégie de tests

## Tests unitaires

Vitest exécute les tests des fonctions, schémas, services et composants isolés. Testing Library
vérifie les comportements visibles plutôt que les détails internes.

```bash
cd frontend
npm run test
```

## Tests d'intégration

Les tests d'intégration frontend se trouvent sous `src/test/integration/` ou à proximité du module
testé. Ils contrôlent la composition de plusieurs couches — validation, service et rendu — avec des
réponses réseau simulées. Ils ne nécessitent pas de backend réel.

## Tests E2E

Playwright lance une API simulée et un build de production Next.js, puis vérifie les parcours dans
Chromium :

```bash
cd frontend
npx playwright install chromium
npm run test:e2e
```

En CI, le navigateur et ses dépendances système sont installés avec
`npx playwright install --with-deps chromium`. Les scénarios échoués conservent captures et traces
dans un artefact GitHub Actions pendant sept jours.

## Accessibilité

Les scénarios Playwright utilisent `@axe-core/playwright` pour détecter automatiquement les
violations d'accessibilité. Ces contrôles complètent, sans remplacer, les assertions de navigation
au clavier, de rôles et de libellés.

## Validation complète

Depuis `frontend/`, exécuter dans l'ordre :

```bash
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npx playwright test
```

Chaque commande est bloquante dans `Frontend CI`. Le build effectué par la configuration Playwright
peut être répété localement : cela garantit que les E2E exercent la version de production.

Les tests backend et leur couverture restent documentés dans
[la documentation de tests existante](development/testing.md).
