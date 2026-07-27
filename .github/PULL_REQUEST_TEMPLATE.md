## Informations générales

### Résumé du changement

Décrivez brièvement le résultat de cette pull request.

### LOT concerné

Indiquez le LOT et son périmètre.

### Issue associée

Référencez l'issue avec `Closes #...` ou indiquez « aucune ».

## Type de changement

- [ ] Feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring
- [ ] Tests

## Périmètre

### Fichiers ou composants concernés

Listez les zones modifiées.

### Hors périmètre

Listez les éléments explicitement exclus.

## Vérifications

- [ ] Les tests pertinents ont été exécutés.
- [ ] `ruff check backend` est réussi.
- [ ] `ruff format --check backend` est réussi.
- [ ] `mypy backend/app backend/tests` est réussi.
- [ ] `pytest` est réussi.
- [ ] `npm run format:check` est réussi depuis `frontend/`.
- [ ] `npm run lint` est réussi depuis `frontend/`.
- [ ] `npm run typecheck` est réussi depuis `frontend/`.
- [ ] `npm run test` est réussi depuis `frontend/`.
- [ ] `npm run build` est réussi depuis `frontend/`.
- [ ] La documentation a été mise à jour si nécessaire.
- [ ] Aucun secret, token, clé API ou fichier `.env` n'a été ajouté.
- [ ] Aucun changement hors scope n'est inclus.

## Sécurité

> Ne jamais inclure de secrets, tokens, clés API, mots de passe, clés privées ou fichiers `.env`.

Décrivez ici les éventuels impacts de sécurité, ou indiquez « aucun ».

## Notes pour la review

Signalez les décisions importantes, compromis ou zones nécessitant une attention particulière.
