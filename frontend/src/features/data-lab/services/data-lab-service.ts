import { dataLabSchema } from "@/features/data-lab/schemas/dataset.schema";
import type { DataLab } from "@/features/data-lab/types/dataset";

const mockDataLab = {
  dataset: {
    name: "Customer NLP Dataset",
    rows: 10_000,
    columns: 35,
    description: "Corpus client anonymisé simulé pour une tâche de classification NLP.",
  },
  metrics: [
    { label: "Accuracy", value: "94%", description: "Prédictions correctes" },
    { label: "F1 Score", value: "0.91", description: "Équilibre précision/rappel" },
    { label: "RMSE", value: "12.4", description: "Erreur quadratique moyenne" },
  ],
  table: {
    caption: "Extrait simulé du Customer NLP Dataset",
    headers: ["ID", "Texte", "Catégorie", "Confiance"],
    rows: [
      ["001", "Connexion impossible", "Incident", "96%"],
      ["002", "Demande de nouvel accès", "Service", "91%"],
      ["003", "Application très lente", "Performance", "88%"],
    ],
  },
  chart: {
    title: "Distribution des catégories",
    description:
      "Incident représente 72%, Service 58%, Performance 43% et Autre 26% sur une échelle relative.",
    values: [
      { label: "Incident", value: 72 },
      { label: "Service", value: 58 },
      { label: "Performance", value: 43 },
      { label: "Autre", value: 26 },
    ],
  },
  models: [
    { name: "Random Forest", accuracy: 0.89, precision: 0.88, recall: 0.86 },
    { name: "XGBoost", accuracy: 0.94, precision: 0.92, recall: 0.91 },
  ],
  insight: {
    title: "Insight principal",
    content:
      "Le modèle XGBoost améliore le rappel tout en conservant une précision élevée sur les classes minoritaires.",
  },
};

export function getMockDataLab(): DataLab {
  return dataLabSchema.parse(mockDataLab);
}
