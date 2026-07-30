import { careerAnalysisSchema } from "@/features/career-copilot/schemas/career.schema";
import type { CareerAnalysis } from "@/features/career-copilot/types/career";

const mockCareerAnalysis = {
  score: 87,
  scoreLabel: "Profil Data & IA",
  profile: {
    skills: ["Python", "SQL", "NLP", "Machine Learning"],
    domains: ["Data Science", "Intelligence Artificielle", "Backend"],
    experiences: ["Analyse de données", "Industrialisation ML", "Conception d’API"],
  },
  skillMatches: [
    { name: "Python", level: "Avancé", match: 95 },
    { name: "Machine Learning", level: "Confirmé", match: 90 },
    { name: "SQL", level: "Confirmé", match: 88 },
  ],
  jobMatch: {
    title: "Machine Learning Engineer",
    compatibility: 92,
    missingSkills: ["Cloud", "Kubernetes"],
  },
  recommendations: [
    "Approfondir le déploiement de modèles sur le Cloud.",
    "Documenter deux études de cas ML de bout en bout.",
    "Renforcer la pratique de Kubernetes en environnement projet.",
  ],
};

export function getMockCareerAnalysis(): CareerAnalysis {
  return careerAnalysisSchema.parse(mockCareerAnalysis);
}
