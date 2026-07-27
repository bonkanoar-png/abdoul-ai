# Definition of Done — Phase Foundation

## 1. Introduction

Ce document définit les conditions vérifiables auxquelles la Phase Foundation d'Abdoul AI peut
être considérée comme terminée. Il sert de référence commune pour la validation technique,
fonctionnelle, documentaire et collaborative de la fondation.

La Phase Foundation couvre :

- l'infrastructure locale PostgreSQL/pgvector et Redis ;
- l'application FastAPI et ses endpoints de santé et de portfolio en lecture seule ;
- les modèles SQLAlchemy, Alembic et l'initialisation des données nécessaires au portfolio ;
- l'interface Next.js qui présente le portfolio ;
- les tests, les contrôles qualité, la CI et la documentation du périmètre livré.

Une fonctionnalité n'est terminée que si son comportement est implémenté, testé, documenté et
validé dans un environnement représentatif. Les fonctionnalités listées comme futures ne sont ni
requises pour clôturer la Foundation ni présentées comme disponibles.

Cette checklist est une porte de sortie de phase. Une case ne doit être cochée qu'après vérification
du résultat associé sur la version candidate finale.

## 2. Critères techniques

### Backend

- [ ] L'application FastAPI démarre correctement avec la configuration documentée.
- [ ] La configuration est chargée et validée avant le traitement des requêtes.
- [ ] `GET /health/live` répond correctement.
- [ ] `GET /health/ready` reflète la disponibilité de PostgreSQL et Redis.
- [ ] `GET /api/v1/portfolio` retourne le portfolio attendu en lecture seule.
- [ ] Les schémas Pydantic publics sont séparés des modèles SQLAlchemy.
- [ ] Les réponses `404`, `500` et les indisponibilités de dépendances sont gérées sans exposer de
      détails internes.

### Base de données

- [ ] Une migration Alembic initiale versionnée crée le schéma portfolio.
- [ ] La migration s'applique avec succès sur une base PostgreSQL vierge.
- [ ] Le rollback de la migration initiale est testé et documenté.
- [ ] Un seed reproductible fournit un portfolio local cohérent.
- [ ] Le seed peut être exécuté selon la stratégie d'idempotence documentée.
- [ ] Les migrations, le seed et les données d'exemple ne contiennent aucune donnée sensible.

### Frontend

- [ ] L'application Next.js démarre avec la configuration documentée.
- [ ] La page portfolio est fonctionnelle et responsive.
- [ ] Le profil est affiché à partir du contrat API.
- [ ] Les expériences sont affichées.
- [ ] Les projets sont affichés.
- [ ] Les compétences sont affichées.
- [ ] L'absence de portfolio produit un état vide compréhensible.
- [ ] L'indisponibilité de l'API produit un état d'erreur maîtrisé.
- [ ] La récupération du portfolio reste effectuée côté serveur.

## 3. Critères qualité

Toutes les commandes suivantes doivent terminer avec un code de sortie nul sur la version candidate
finale.

### Backend

Depuis la racine du dépôt :

| Contrôle | Commande | Résultat attendu |
| --- | --- | --- |
| Ruff | `ruff check backend` | Aucune erreur de lint |
| Ruff format | `ruff format --check backend` | Aucun fichier à reformater |
| mypy | `mypy backend/app backend/tests` | Aucune erreur de typage |
| pytest | `pytest` | Tous les tests réussissent |
| Coverage | `pytest --cov=backend/app` | Suite réussie et couverture mesurée sans régression inexpliquée |
| pre-commit | `pre-commit run --all-files` | Tous les hooks réussissent |

### Frontend

Depuis `frontend/` :

| Contrôle | Commande | Résultat attendu |
| --- | --- | --- |
| Prettier | `npm run format:check` | Aucun fichier à reformater |
| ESLint | `npm run lint` | Aucune erreur de lint |
| TypeScript | `npm run typecheck` | Aucune erreur de typage |
| Vitest | `npm run test` | Tous les tests réussissent |
| Build Next.js | `npm run build` | Build de production réussi |

En complément :

- [ ] Les contrôles locaux et ceux de la CI utilisent des commandes cohérentes.
- [ ] Aucun warning nouveau n'est ignoré sans justification.
- [ ] Toute exclusion de lint, typage ou couverture est limitée et documentée.

## 4. Critères sécurité

- [ ] Aucun secret, token, mot de passe réel, fichier de clés ou donnée personnelle sensible n'est
      versionné.
- [ ] Les fichiers `.env` locaux sont exclus de Git ; seuls des exemples sûrs sont suivis.
- [ ] Les workflows GitHub Actions utilisent des permissions minimales, dont
      `contents: read`.
- [ ] Aucune route d'écriture non protégée n'est exposée.
- [ ] Aucune publication d'artefact, d'image ou de déploiement automatique n'est active.
- [ ] Les variables réservées aux fonctions futures sont clairement identifiées comme inactives.
- [ ] Les erreurs API et les logs ne divulguent aucun détail interne ou secret.

## 5. Critères infrastructure

L'environnement local doit fournir :

- [ ] PostgreSQL au moyen de l'image pgvector prévue par le projet.
- [ ] pgvector disponible dans l'image PostgreSQL, sans présenter un usage vectoriel comme actif.
- [ ] Redis disponible pour le contrôle de readiness.
- [ ] Des volumes persistants distincts pour PostgreSQL et Redis.
- [ ] Des health checks fonctionnels pour PostgreSQL et Redis.
- [ ] Des ports, variables et commandes de démarrage documentés.
- [ ] Un démarrage reproductible de l'infrastructure avec Docker Compose.

Le backend et le frontend ne sont actuellement pas conteneurisés. Ils sont exécutés séparément
selon le guide d'installation locale. Leur conteneurisation et tout déploiement de production sont
hors du périmètre de la Phase Foundation.

## 6. Critères tests

### Backend

- [ ] Les tests unitaires couvrent la configuration, les schémas et les modèles.
- [ ] Les tests API couvrent les endpoints health et portfolio.
- [ ] Les réponses nominales et les erreurs `404`, `500` et `503` pertinentes sont validées.
- [ ] La sérialisation des UUID, dates et relations est validée.
- [ ] Une validation sur une instance PostgreSQL réelle confirme le schéma et les requêtes.
- [ ] La migration initiale est testée sur une base vierge.
- [ ] Le rollback de migration est testé.
- [ ] Le seed est testé sur une base vierge et selon sa stratégie de répétition.

### Frontend

- [ ] Les composants portfolio couvrent le rendu des données et les états vides.
- [ ] Le client API et le service portfolio couvrent succès, absence et indisponibilité.
- [ ] Les erreurs et les liens externes sont testés.
- [ ] Le build Next.js de production réussit.
- [ ] Une validation d'intégration confirme le flux Next.js → FastAPI → PostgreSQL.
- [ ] Le portfolio issu du seed est vérifié dans l'interface.

## 7. Critères documentation

- [ ] Le `README.md` décrit fidèlement le périmètre et les commandes principales.
- [ ] L'architecture backend, frontend et base de données est documentée.
- [ ] L'installation locale depuis un environnement vierge est documentée et reproductible.
- [ ] La création, l'application et le rollback des migrations sont documentés.
- [ ] La procédure et la stratégie de répétition du seed sont documentées.
- [ ] Les variables d'environnement actives et réservées sont documentées.
- [ ] Les commandes de tests et de qualité correspondent aux configurations actuelles.
- [ ] Le périmètre produit, la roadmap, le backlog et les décisions sont synchronisés.
- [ ] Les limites de la Foundation et les fonctionnalités futures sont explicites.

## 8. Critères Git et collaboration

- [ ] Le working tree de la version candidate est propre.
- [ ] Chaque changement est porté par un commit explicite et limité à son périmètre.
- [ ] La branche distante est synchronisée avec la branche locale validée.
- [ ] La Pull Request passe la CI, est relue et reçoit la validation attendue.
- [ ] Aucune modification directe non autorisée n'est effectuée sur `main` ou `develop`.
- [ ] Aucun force push n'est effectué sur une branche partagée.
- [ ] Aucun merge ou rebase non autorisé n'est inclus dans la livraison.
- [ ] Le commit déclaré comme final correspond exactement à la version validée.

## 9. Hors Definition of Done Foundation

Les fonctionnalités suivantes ne sont pas requises pour terminer la Phase Foundation :

- authentification ;
- dashboard ;
- administration ;
- CRUD complet ;
- SaaS ;
- multi-tenant ;
- RBAC ;
- billing ;
- API publique ;
- SDK ;
- LLM ;
- RAG ;
- embeddings ;
- agents ;
- MCP.

**Statut : Future / Not implemented.**

Leur absence ne bloque pas la clôture de la Foundation. Elles ne doivent toutefois pas être
présentées comme disponibles et restent soumises aux décisions et lots futurs correspondants.

## 10. Validation finale

La Phase Foundation est complète uniquement lorsque chaque domaine ci-dessous est validé et que les
preuves associées sont disponibles.

## Phase Foundation Complete

- [ ] Infrastructure validée
- [ ] Backend validé
- [ ] Base validée
- [ ] Frontend validé
- [ ] Tests validés
- [ ] Qualité validée
- [ ] Sécurité validée
- [ ] Documentation validée
- [ ] Git validé

Tant qu'une de ces cases reste ouverte, la Phase Foundation demeure en cours de validation.
