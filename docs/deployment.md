# Preview et déploiement

## Preview recommandée avec Vercel

Vercel est recommandé pour les previews Next.js. Aucun compte, projet distant, secret ou
déploiement réel n'est configuré par ce dépôt.

Pour préparer les previews de Pull Request :

1. Importer le dépôt GitHub dans Vercel.
2. Définir **Root Directory** sur `frontend`.
3. Laisser le preset **Next.js**, la commande d'installation `npm ci` et la commande de build
   `npm run build`.
4. Déclarer les variables de l'environnement **Preview**.
5. Ouvrir une Pull Request ; l'intégration Vercel crée alors une URL éphémère et publie son statut
   sur la Pull Request.
6. Vérifier la preview uniquement après la réussite de `Frontend CI`.

## Variables d'environnement

| Variable publique      | Valeur locale           | Valeur de preview                    |
| ---------------------- | ----------------------- | ------------------------------------ |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:8000` | Origine HTTPS de l'API de preview    |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | URL canonique attribuée à la preview |

Ces variables sont intégrées au bundle lors du build. Elles ne doivent contenir ni clé API, ni
token, ni mot de passe. Les secrets backend éventuels doivent rester dans l'environnement backend
et ne jamais utiliser le préfixe `NEXT_PUBLIC_`.

Une URL de preview Vercel est dynamique. Si une URL canonique stable est requise pour les
métadonnées, affecter un domaine de preview stable à `NEXT_PUBLIC_SITE_URL`; sinon, renseigner
l'URL fournie pour la validation concernée avant de relancer le build.

## Contrôles avant preview

```bash
cd frontend
npm ci
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

La preview doit pointer vers une API accessible en HTTPS et autorisée par la configuration CORS du
backend. L'API doit être isolée de la production si les interactions écrivent des données.

## Production future

La mise en production n'est pas implémentée dans ce lot. Avant de l'activer, il faudra :

- reproduire le build depuis le lockfile avec une version Node compatible ;
- séparer les variables Preview et Production ;
- définir les contrôles d'accès et la stratégie de rollback ;
- activer les journaux, les métriques, le suivi d'erreurs et les alertes ;
- protéger la branche et exiger la réussite des contrôles CI ;
- documenter les domaines, CORS et politiques de conservation des données.

Le workflow actuel valide la qualité seulement : il ne déploie rien et ne requiert aucun secret.
