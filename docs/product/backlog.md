# Product Backlog

Ce backlog transforme la roadmap en sujets évaluables. Il ne vaut ni autorisation
d'implémentation, ni engagement de date.

## Vue synthétique

| ID | Catégorie | Sujet | Priorité | Statut |
| --- | --- | --- | --- | --- |
| DATA-001 | Data | Migration Alembic initiale | Critical | Proposed |
| DATA-002 | Data | Seed portfolio reproductible | Critical | Proposed |
| PLATFORM-001 | Platform | Validation d'une installation vierge | Critical | Proposed |
| BACKEND-001 | Backend | Repositories portfolio | High | Candidate |
| BACKEND-002 | Backend | Services métier portfolio | High | Candidate |
| BACKEND-003 | Backend | CRUD portfolio | High | Candidate |
| PRODUCT-001 | Product | Workflow de gestion du contenu | High | Discovery |
| FRONTEND-001 | Frontend | Pages détail projet | Medium | Candidate |
| FRONTEND-002 | Frontend | Navigation et formulaires | Medium | Candidate |
| FRONTEND-003 | Frontend | Interface d'administration | High | Blocked |
| SECURITY-001 | Security | Authentification administration | High | Discovery |
| DOCUMENTATION-001 | Documentation | Guide migration et seed | High | Candidate |
| PLATFORM-002 | Platform | Durcissement des actions GitHub | Medium | Candidate |
| PLATFORM-003 | Platform | Stratégie de déploiement future | Low | Future |
| AI-001 | AI | Architecture LLM | Low | Future / Not implemented |
| AI-002 | AI | Architecture RAG et embeddings | Low | Future / Not implemented |
| AI-003 | AI | Architecture agents et MCP | Low | Future / Not implemented |

## DATA-001 — Migration Alembic initiale

- **Catégorie :** Data
- **Statut :** Proposed
- **Priorité :** Critical
- **Problème :** une base vierge ne contient aucune table, car aucune révision métier n'existe.
- **Résultat attendu :** Alembic crée les cinq tables et leurs contraintes depuis un état vide.
- **Scope :** révision initiale, upgrade, downgrade, contraintes et relations existantes.
- **Hors scope :** nouveaux modèles, changement du schéma métier, seed et déploiement.
- **Dépendances :** modèles SQLAlchemy actuels et PostgreSQL local.
- **Critères d'acceptation :**
  - la migration s'applique sur une base vierge ;
  - `alembic current` indique la nouvelle révision ;
  - le downgrade restaure l'état antérieur ;
  - aucune différence non expliquée n'apparaît après autogénération.
- **Tests attendus :** test d'upgrade/downgrade sur PostgreSQL isolé et vérification des tables.
- **Documentation attendue :** commandes de migration, prérequis et procédure de rollback.

## DATA-002 — Seed portfolio reproductible

- **Catégorie :** Data
- **Statut :** Proposed
- **Priorité :** Critical
- **Problème :** l'API ne dispose d'aucun contenu initial à afficher.
- **Résultat attendu :** un jeu de données cohérent alimente un portfolio local complet.
- **Scope :** profil, expériences, projets, compétences et associations.
- **Hors scope :** données de production, données personnelles réelles et interface d'édition.
- **Dépendances :** DATA-001.
- **Critères d'acceptation :**
  - le seed est reproductible ;
  - les relations et ordres d'affichage sont cohérents ;
  - aucun secret ou contenu sensible n'est inclus ;
  - l'API retourne un portfolio complet.
- **Tests attendus :** chargement sur base vide, répétition contrôlée et validation du payload API.
- **Documentation attendue :** exécution, réinitialisation et nature des données de démonstration.

## PLATFORM-001 — Validation d'une installation vierge

- **Catégorie :** Platform
- **Statut :** Proposed
- **Priorité :** Critical
- **Problème :** le parcours complet depuis un clone propre n'est pas automatisé ni validé.
- **Résultat attendu :** une procédure déterministe démarre infrastructure, API et frontend.
- **Scope :** Docker Compose, variables locales, migration, seed, health checks et rendu portfolio.
- **Hors scope :** image applicative, cloud, staging et production.
- **Dépendances :** DATA-001 et DATA-002.
- **Critères d'acceptation :**
  - le parcours fonctionne sur une machine vierge conforme aux prérequis ;
  - les deux health checks réussissent ;
  - le portfolio est visible dans le frontend ;
  - tous les contrôles qualité restent verts.
- **Tests attendus :** scénario end-to-end local documenté, sans service cloud.
- **Documentation attendue :** guide pas-à-pas et dépannage des erreurs fréquentes.

## BACKEND-001 — Repositories portfolio

- **Catégorie :** Backend
- **Statut :** Candidate
- **Priorité :** High
- **Problème :** la route portfolio interroge directement SQLAlchemy.
- **Résultat attendu :** l'accès aux données est isolé derrière des contrats testables.
- **Scope :** interfaces nécessaires et implémentations SQLAlchemy du portfolio.
- **Hors scope :** abstraction générique universelle, CRUD HTTP et authentification.
- **Dépendances :** décisions ADR-002 et ADR-003.
- **Critères d'acceptation :**
  - la route ne construit plus directement les requêtes métier ;
  - les relations restent chargées explicitement ;
  - les erreurs sont traduites sans fuite interne.
- **Tests attendus :** tests unitaires des repositories et tests d'intégration PostgreSQL ciblés.
- **Documentation attendue :** frontières et responsabilités des repositories.

## BACKEND-002 — Services métier portfolio

- **Catégorie :** Backend
- **Statut :** Candidate
- **Priorité :** High
- **Problème :** aucun service ou cas d'usage n'exprime les règles du portfolio.
- **Résultat attendu :** les opérations sont orchestrées hors des routes HTTP.
- **Scope :** lecture agrégée, ordre d'affichage et règles métier nécessaires.
- **Hors scope :** framework métier abstrait, IA et traitement asynchrone distribué.
- **Dépendances :** BACKEND-001 et ADR-003.
- **Critères d'acceptation :**
  - les routes restent minces ;
  - les règles sont testables sans FastAPI ;
  - les dépendances sont orientées vers les contrats définis.
- **Tests attendus :** tests unitaires de cas nominaux, absences et erreurs.
- **Documentation attendue :** diagramme de flux route → service → repository.

## BACKEND-003 — CRUD portfolio

- **Catégorie :** Backend
- **Statut :** Candidate
- **Priorité :** High
- **Problème :** le contenu ne peut être administré que directement dans la base.
- **Résultat attendu :** une API d'administration permet des écritures validées.
- **Scope :** profil, expériences, projets, compétences, associations et ordre.
- **Hors scope :** API publique, bulk import, billing et multi-tenant.
- **Dépendances :** BACKEND-001, BACKEND-002 et SECURITY-001.
- **Critères d'acceptation :**
  - les contrats de création et mise à jour sont explicites ;
  - les écritures sont authentifiées et autorisées ;
  - les contraintes métier produisent des erreurs stables ;
  - la lecture publique reste compatible.
- **Tests attendus :** tests unitaires, intégration HTTP et autorisations.
- **Documentation attendue :** contrats, codes d'erreur et exemples d'usage.

## PRODUCT-001 — Workflow de gestion du contenu

- **Catégorie :** Product
- **Statut :** Discovery
- **Priorité :** High
- **Problème :** la source de vérité et le parcours éditorial ne sont pas décidés.
- **Résultat attendu :** un workflow clair définit qui modifie quoi, où et avec quelle validation.
- **Scope :** rôles, brouillon éventuel, publication, tri et cycle de vie du contenu.
- **Hors scope :** implémentation technique avant validation du besoin.
- **Dépendances :** ADR-002 et SECURITY-001.
- **Critères d'acceptation :**
  - les utilisateurs et responsabilités sont identifiés ;
  - la source de vérité est décidée ;
  - les scénarios d'édition et publication sont décrits.
- **Tests attendus :** scénarios d'acceptation produit, une fois la solution décidée.
- **Documentation attendue :** parcours éditorial et règles de contenu.

## FRONTEND-001 — Pages détail projet

- **Catégorie :** Frontend
- **Statut :** Candidate
- **Priorité :** Medium
- **Problème :** les projets ne disposent que d'une carte dans la page principale.
- **Résultat attendu :** chaque projet peut présenter ses informations détaillées.
- **Scope :** route par slug, contenu, compétences, liens et états 404.
- **Hors scope :** édition, commentaires, analytics et personnalisation utilisateur.
- **Dépendances :** contenu projet disponible et contrat API validé.
- **Critères d'acceptation :**
  - les slugs valides rendent un projet ;
  - les slugs inconnus rendent un état 404 ;
  - la page reste accessible et responsive.
- **Tests attendus :** rendu, 404, liens sécurisés et build Next.js.
- **Documentation attendue :** nouvelle route et contrat de données.

## FRONTEND-002 — Navigation et formulaires

- **Catégorie :** Frontend
- **Statut :** Candidate
- **Priorité :** Medium
- **Problème :** la navigation est locale et aucun formulaire de gestion n'existe.
- **Résultat attendu :** les nouveaux parcours restent cohérents et accessibles.
- **Scope :** navigation multi-page et primitives de formulaire nécessaires.
- **Hors scope :** administration avant authentification et nouvelle bibliothèque UI sans besoin.
- **Dépendances :** FRONTEND-001 et définition du workflow produit.
- **Critères d'acceptation :**
  - navigation clavier complète ;
  - états de validation et d'erreur accessibles ;
  - aucun appel non autorisé depuis le navigateur.
- **Tests attendus :** navigation, formulaires, erreurs et accessibilité.
- **Documentation attendue :** architecture de navigation et conventions de formulaire.

## FRONTEND-003 — Interface d'administration

- **Catégorie :** Frontend
- **Statut :** Blocked
- **Priorité :** High
- **Problème :** aucun parcours sécurisé ne permet de gérer le contenu.
- **Résultat attendu :** une interface authentifiée orchestre le CRUD portfolio.
- **Scope :** écrans de gestion, confirmations, erreurs et états de sauvegarde.
- **Hors scope :** multi-tenant, billing et fonctions SaaS.
- **Dépendances :** BACKEND-003 et SECURITY-001.
- **Critères d'acceptation :**
  - toutes les pages d'administration sont protégées ;
  - les opérations sensibles demandent une confirmation ;
  - les erreurs backend sont rendues sans fuite interne.
- **Tests attendus :** autorisation, formulaires, erreurs et parcours critiques.
- **Documentation attendue :** parcours administrateur et modèle d'autorisation.

## SECURITY-001 — Authentification administration

- **Catégorie :** Security
- **Statut :** Discovery
- **Priorité :** High
- **Problème :** aucune identité ni autorisation ne protège de futures écritures.
- **Résultat attendu :** une stratégie minimale et auditable sécurise l'administration.
- **Scope :** identité administrateur, session, expiration, stockage des secrets et autorisations.
- **Hors scope :** SSO entreprise, RBAC multi-tenant et marketplace.
- **Dépendances :** ADR-004 et besoins PRODUCT-001.
- **Critères d'acceptation :**
  - menace et exigences documentées ;
  - secrets absents du dépôt et des logs ;
  - accès non authentifié refusé ;
  - stratégie de révocation définie.
- **Tests attendus :** authentification, expiration, refus et contrôles d'autorisation.
- **Documentation attendue :** modèle de menace, configuration et procédures opérationnelles.

## DOCUMENTATION-001 — Guide migration et seed

- **Catégorie :** Documentation
- **Statut :** Candidate
- **Priorité :** High
- **Problème :** aucun cycle opérationnel migration/seed n'est documenté.
- **Résultat attendu :** un développeur initialise et réinitialise la base sans connaissance cachée.
- **Scope :** commandes, ordre des étapes, rollback, dépannage et données de démonstration.
- **Hors scope :** documentation de déploiement production.
- **Dépendances :** DATA-001 et DATA-002.
- **Critères d'acceptation :**
  - toutes les commandes ont été validées sur une installation vierge ;
  - les risques de perte de données sont signalés ;
  - les différences hôte/Docker sont explicites.
- **Tests attendus :** revue en suivant le guide depuis un clone propre.
- **Documentation attendue :** mise à jour de `setup.md`, `database.md` et du README si nécessaire.

## PLATFORM-002 — Durcissement des actions GitHub

- **Catégorie :** Platform
- **Statut :** Candidate
- **Priorité :** Medium
- **Problème :** les actions utilisent des tags majeurs plutôt que des SHA immuables.
- **Résultat attendu :** la chaîne CI réduit son exposition à une modification amont inattendue.
- **Scope :** références immuables, politique de mise à jour et vérification des permissions.
- **Hors scope :** déploiement, secrets cloud et publication d'artefacts.
- **Dépendances :** validation de la politique de maintenance.
- **Critères d'acceptation :**
  - chaque action tierce est épinglée de façon vérifiable ;
  - les permissions restent en lecture seule ;
  - les mises à jour sont documentées.
- **Tests attendus :** exécution complète des jobs backend et frontend.
- **Documentation attendue :** procédure de mise à jour des actions.

## PLATFORM-003 — Stratégie de déploiement future

- **Catégorie :** Platform
- **Statut :** Future
- **Priorité :** Low
- **Problème :** aucune cible ni exigence de déploiement n'est définie.
- **Résultat attendu :** les contraintes sont décidées avant toute infrastructure cloud.
- **Scope :** environnements, disponibilité, coûts, secrets, rollback et observabilité.
- **Hors scope :** implémentation d'un fournisseur ou déploiement automatique.
- **Dépendances :** maturité produit et exigences non fonctionnelles.
- **Critères d'acceptation :**
  - options comparées ;
  - responsabilités et risques identifiés ;
  - aucune ressource créée pendant la phase de décision.
- **Tests attendus :** critères de validation à définir avec la cible retenue.
- **Documentation attendue :** ADR et stratégie d'exploitation.

## AI-001 — Architecture LLM

- **Catégorie :** AI
- **Statut :** Future / Not implemented
- **Priorité :** Low
- **Problème :** aucun cas d'usage IA validé ne justifie encore une intégration LLM.
- **Résultat attendu :** les usages, risques, coûts et limites sont évalués avant le code.
- **Scope :** découverte produit, fournisseurs possibles, confidentialité et évaluation.
- **Hors scope :** appel LLM, clé fournisseur, chatbot et agent.
- **Dépendances :** besoin produit validé et ADR-008.
- **Critères d'acceptation :** cas d'usage mesurable, données autorisées et budget défini.
- **Tests attendus :** protocole d'évaluation à définir, sans appel réel à ce stade.
- **Documentation attendue :** architecture candidate, risques et décision.

## AI-002 — Architecture RAG et embeddings

- **Catégorie :** AI
- **Statut :** Future / Not implemented
- **Priorité :** Low
- **Problème :** aucune source documentaire ni exigence de recherche n'est définie.
- **Résultat attendu :** une décision établit si un RAG apporte une valeur mesurable.
- **Scope :** sources, ingestion, permissions, embeddings, recherche et évaluation.
- **Hors scope :** pipeline RAG, index vectoriel et activation pgvector.
- **Dépendances :** AI-001, ADR-007 et ADR-008.
- **Critères d'acceptation :** corpus autorisé, métriques, coût et politique de suppression définis.
- **Tests attendus :** jeu d'évaluation futur, sans infrastructure dans cette tâche.
- **Documentation attendue :** flux de données, sécurité et alternatives sans RAG.

## AI-003 — Architecture agents et MCP

- **Catégorie :** AI
- **Statut :** Future / Not implemented
- **Priorité :** Low
- **Problème :** aucun besoin validé ne nécessite des actions autonomes ou des outils MCP.
- **Résultat attendu :** capacités, limites et contrôles humains sont définis avant expérimentation.
- **Scope :** menaces, permissions, approbations, outils candidats et observabilité.
- **Hors scope :** agent, serveur MCP, outil exécutable et marketplace.
- **Dépendances :** AI-001 et ADR-008.
- **Critères d'acceptation :** cas d'usage, niveau d'autonomie et garde-fous explicitement approuvés.
- **Tests attendus :** scénarios de sûreté futurs, aucun outil réel dans cette tâche.
- **Documentation attendue :** modèle de menace, matrice de permissions et critères d'arrêt.
