# Architecture Decision Records

Ce journal répertorie les décisions à prendre. Les entrées ci-dessous sont des sujets ouverts :
elles ne définissent aucune solution technique tant que leur statut reste **À décider**.

## ADR-001 — Stratégie migration et seed

- **Date :** non définie
- **Statut :** À décider
- **Contexte :** les modèles SQLAlchemy existent, mais aucune migration métier ni aucun seed ne sont
  fournis. Une installation vierge ne peut pas produire un portfolio fonctionnel.
- **Décision :** aucune décision arrêtée. Définir le cycle de création, upgrade, downgrade et
  initialisation des données.
- **Conséquences :** la décision déterminera la reproductibilité locale, les tests d'intégration et
  la gestion future des données existantes.
- **Alternatives :** migration Alembic autogénérée ou rédigée explicitement ; seed Python,
  commande dédiée ou chargement contrôlé ; seed idempotent ou réinitialisation explicite.

## ADR-002 — Source de vérité du contenu portfolio

- **Date :** non définie
- **Statut :** À décider
- **Contexte :** PostgreSQL contient le modèle prévu, mais aucun workflow de création ou
  publication du contenu n'est défini.
- **Décision :** aucune décision arrêtée. Identifier la source de vérité et le propriétaire du
  contenu.
- **Conséquences :** ce choix conditionnera le CRUD, l'administration, le seed, les imports et les
  règles de publication.
- **Alternatives :** base administrée par API, contenu versionné puis importé, CMS externe ou
  combinaison contrôlée.

## ADR-003 — Frontières domain/application/infrastructure

- **Date :** non définie
- **Statut :** À décider
- **Contexte :** les dossiers `domain` et `application` sont des placeholders tandis que la route
  portfolio interroge directement SQLAlchemy.
- **Décision :** aucune décision arrêtée. Définir les responsabilités et les dépendances entre
  couches avant d'ajouter repositories et services.
- **Conséquences :** la décision influencera la testabilité, le volume d'abstraction et
  l'organisation des futures fonctionnalités.
- **Alternatives :** architecture en couches explicites, service applicatif léger ou maintien d'une
  architecture directe tant que la complexité reste faible.

## ADR-004 — Authentification administration future

- **Date :** non définie
- **Statut :** À décider
- **Contexte :** l'API actuelle est en lecture seule. Toute future écriture devra être protégée.
- **Décision :** aucune décision arrêtée. Définir l'identité administrateur, la session, la
  révocation et les autorisations minimales.
- **Conséquences :** le choix affectera le backend, le frontend, les secrets, les tests et
  l'exploitation.
- **Alternatives :** session serveur, jeton court avec rotation, fournisseur d'identité externe ou
  absence d'interface d'administration publique.

## ADR-005 — Versionnement API

- **Date :** non définie
- **Statut :** À décider
- **Contexte :** le portfolio utilise `/api/v1`, mais aucune politique de compatibilité ou
  dépréciation n'existe.
- **Décision :** aucune décision arrêtée. Formaliser quand une version change et comment les clients
  migrent.
- **Conséquences :** la décision encadrera le CRUD, une éventuelle API publique et les types
  frontend.
- **Alternatives :** versions dans l'URL, négociation par en-tête ou évolution compatible d'une
  seule version jusqu'à un besoin confirmé.

## ADR-006 — Usage futur Redis

- **Date :** non définie
- **Statut :** À décider
- **Contexte :** Redis est déployé localement mais sert uniquement au health check.
- **Décision :** aucune décision arrêtée. Conserver Redis uniquement si un besoin fonctionnel ou
  opérationnel le justifie.
- **Conséquences :** un usage métier ajouterait des règles de cohérence, expiration, panne et tests.
- **Alternatives :** retirer Redis jusqu'au besoin, cache de lecture, sessions, rate limiting ou
  file de travaux.

## ADR-007 — Activation éventuelle de pgvector

- **Date :** non définie
- **Statut :** À décider
- **Contexte :** l'image PostgreSQL inclut pgvector, mais aucune extension, colonne ou requête
  vectorielle n'est déclarée.
- **Décision :** aucune décision arrêtée. Activer pgvector seulement après validation d'un cas
  d'usage et d'une stratégie d'embeddings.
- **Conséquences :** l'activation affecterait migrations, index, coûts, sauvegardes, confidentialité
  et tests.
- **Alternatives :** ne pas utiliser de recherche vectorielle, recherche PostgreSQL classique,
  pgvector ou service spécialisé.

## ADR-008 — Architecture IA future

- **Date :** non définie
- **Statut :** À décider
- **Contexte :** les dossiers `llm` et `rag` sont des placeholders. Aucun LLM, RAG, embedding, agent
  ou MCP n'est implémenté.
- **Décision :** aucune décision arrêtée. Exiger un cas d'usage mesurable, un modèle de menace et une
  méthode d'évaluation avant toute intégration.
- **Conséquences :** une future décision devra couvrir données, fournisseurs, coûts, observabilité,
  permissions, garde-fous et suppression.
- **Alternatives :** aucune IA, fonctionnalités déterministes, LLM sans RAG, RAG contrôlé ou agents
  avec approbation humaine.
