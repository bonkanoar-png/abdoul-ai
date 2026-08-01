# Runbook incident

## Priorités

- **P1** : indisponibilité totale, perte/corruption de données ou compromission active. Coordination immédiate et mises à jour toutes les 30 minutes.
- **P2** : dégradation importante, SLO menacé, dépendance instable. Prise en charge sous une heure.
- **P3** : anomalie limitée sans impact majeur. Traitement planifié.

## Cycle d'incident

1. **Détection** : horodater, confirmer l'alerte et ouvrir un journal d'incident.
2. **Diagnostic** : vérifier dashboards, `docker compose ps`, capacité disque, logs Loki et derniers changements. Corréler avec `X-Request-ID`.
3. **Mitigation** : rollback applicatif, redémarrage ciblé ou limitation du trafic. Préserver données et preuves.
4. **Résolution** : corriger la cause, exécuter les healthchecks et observer au moins une fenêtre d'alerte complète.
5. **Communication** : publier impact, périmètre et prochaine mise à jour sans exposer de secret.
6. **Post-mortem** : sous cinq jours ouvrés, documenter chronologie, cause systémique, détection, actions et responsables, sans recherche de culpabilité.

Les silences Alertmanager doivent être bornés, motivés et supprimés après intervention. Ne jamais modifier les seuils uniquement pour faire disparaître une alerte.

## Exercices de panne

Annoncer l'exercice, vérifier un backup récent, puis exécuter en période contrôlée :

```bash
CONFIRM_FAILURE_DRILL=yes scripts/operations/failure-drill.sh backend 180
```

Services autorisés : backend, PostgreSQL et Redis. Le script ne supprime aucun volume et restaure le service via un trap. Vérifier le passage de l'alerte en pending/firing, sa résolution, les healthchecks et l'absence de perte de données. Ne pas automatiser ces exercices en production.
