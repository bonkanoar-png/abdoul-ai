# SLO, SLI et budget d'erreur

## Périmètre initial

Ces objectifs sont internes et ne constituent pas une garantie contractuelle. La plateforme mono-instance vise **99,5 % de disponibilité mensuelle** pour le parcours public, soit environ 21 min 55 s de budget d'indisponibilité sur un mois de 30,44 jours.

| Indicateur        | SLI                                  | SLO mensuel initial                         |
| ----------------- | ------------------------------------ | ------------------------------------------- |
| Disponibilité API | requêtes hors 5xx / requêtes totales | ≥ 99,5 %                                    |
| Erreurs API       | réponses 5xx / requêtes totales      | < 0,5 %                                     |
| Latence API       | histogramme HTTP FastAPI             | p95 < 1 s, p99 < 2,5 s                      |
| Dépendances       | probes TCP PostgreSQL et Redis       | ≥ 99,5 %                                    |
| Capacité hôte     | Node Exporter                        | CPU < 85 %, RAM < 90 %, disque libre > 15 % |

Les sondes Prometheus ne mesurent pas encore un parcours utilisateur synthétique complet depuis Internet. Les fenêtres de maintenance annoncées restent comptabilisées jusqu'à décision contraire explicite.

## Budget d'erreur

Le budget consommé est `1 - SLI`. À 50 % de consommation avant la moitié du mois, ralentir les changements risqués. À 100 %, geler les déploiements non essentiels et privilégier fiabilité, capacité et correction des causes récurrentes. Revoir l'objectif après trois mois de données, sans le relever uniquement pour masquer des incidents.

## Mesure et alertes

Prometheus reste la source unique des alertes ; Grafana sert à visualiser et explorer, sans règles dupliquées. Alertmanager groupe et inhibe les notifications, mais utilise volontairement un receiver nul tant qu'aucun canal opérationnel n'est approuvé. Les percentiles proviennent des buckets de l'histogramme, pas de moyennes.

## Tests de charge futurs

Préparer k6 ou Locust dans un environnement isolé avec jeux de données non sensibles. Scénarios : page publique, lecture portfolio, pics de 10/50/100 utilisateurs virtuels et endurance 30 minutes. Seuils initiaux : erreurs < 0,5 %, p95 < 1 s et aucune saturation durable. Ne jamais lancer ces tests contre la production sans fenêtre, limite de débit et plan d'arrêt.
