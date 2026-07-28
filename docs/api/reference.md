# Référence API

URL locale : `http://localhost:8000`. Le préfixe métier par défaut est `/api/v1`. OpenAPI est
disponible sur `/docs` et `/openapi.json`.

## Santé

| Méthode | Route | Réponse |
| --- | --- | --- |
| `GET` | `/health` | identité, version et statut du service |
| `GET` | `/health/live` | `200` si le processus répond |
| `GET` | `/health/ready` | `200` si PostgreSQL et Redis répondent, sinon `503` |

## Portfolio public

| Méthode | Route | Réponse |
| --- | --- | --- |
| `GET` | `/api/v1/portfolio` | projection initiale profil/expériences/projets/compétences |
| `GET` | `/api/v1/profile` | profil public, ou `404` |
| `GET` | `/api/v1/experiences` | expériences ordonnées |
| `GET` | `/api/v1/formations` | formations ordonnées |
| `GET` | `/api/v1/skills` | compétences ordonnées |
| `GET` | `/api/v1/projects` | projets et technologies |
| `GET` | `/api/v1/technologies` | catalogue des technologies |
| `GET` | `/api/v1/publications` | publications ordonnées |
| `GET` | `/api/v1/certifications` | certifications ordonnées |
| `GET` | `/api/v1/documents` | documents publics ordonnés |

Les collections sans données retournent `200` avec `[]`. Les dates utilisent le format ISO 8601 et
les identifiants UUID sont sérialisés sous forme de chaînes.

## Conversations

| Méthode | Route | Réponse |
| --- | --- | --- |
| `GET` | `/api/v1/conversations` | conversations persistées |
| `GET` | `/api/v1/conversations/{conversation_id}/messages` | messages, ou `404` si la conversation n'existe pas |

`conversation_id` doit être un UUID valide. Une valeur invalide retourne `422`.

## Erreurs

Les erreurs applicatives sont normalisées :

```json
{
  "error": {
    "code": "not_found",
    "message": "Resource not found.",
    "details": null
  }
}
```

Codes usuels :

- `404` : ressource absente ;
- `422` : paramètre ou requête invalide ;
- `500` : erreur interne générique sans détail sensible ;
- `503` : dépendance indisponible pour la readiness.

Toutes les routes métier sont actuellement en lecture seule. CORS autorise seulement les origines
configurées et les méthodes `GET` et `OPTIONS`.
