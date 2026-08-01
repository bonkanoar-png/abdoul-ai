import { adminSchemas, type AdminResourceName } from "@/features/admin/schemas/admin.schema";
import type { AdminRepository } from "@/features/admin/types/admin";

type StoredRecord = { id: string } & Record<string, string | string[]>;

const seed: Record<AdminResourceName, StoredRecord[]> = {
  experiences: [
    { id: "exp-1", company: "Orange", role: "Data Analyst", contractType: "CDI", location: "Paris", dates: "2023 — aujourd’hui", description: "Analyse et valorisation de données.", missions: ["Industrialiser les analyses"], results: ["Délais réduits"], technologies: ["Python", "SQL"], skills: ["Data Science"] },
    { id: "exp-2", company: "Freelance", role: "AI Engineer", contractType: "Mission", location: "Remote", dates: "2022 — 2023", description: "Conception de solutions IA.", missions: ["Prototypage NLP"], results: ["MVP livré"], technologies: ["FastAPI"], skills: ["NLP"] },
    { id: "exp-3", company: "Laboratoire", role: "Data Scientist", contractType: "Stage", location: "France", dates: "2021 — 2022", description: "Modélisation statistique.", missions: ["Entraînement de modèles"], results: ["Modèle validé"], technologies: ["scikit-learn"], skills: ["Machine Learning"] },
    { id: "exp-4", company: "Université", role: "Assistant recherche", contractType: "Projet", location: "France", dates: "2020 — 2021", description: "Recherche appliquée.", missions: ["Revue bibliographique"], results: ["Publication"], technologies: ["R"], skills: ["Statistiques"] },
  ],
  formations: [
    { id: "form-1", institution: "Université", degree: "Master", field: "Intelligence artificielle", dates: "2021 — 2023", status: "Obtenu", highlights: ["Machine Learning"], skills: ["IA"] },
    { id: "form-2", institution: "Université", degree: "Licence", field: "Mathématiques appliquées", dates: "2018 — 2021", status: "Obtenu", highlights: ["Statistiques"], skills: ["Modélisation"] },
    { id: "form-3", institution: "OpenClassrooms", degree: "Parcours", field: "Data Science", dates: "2022", status: "Obtenu", highlights: ["Projets pratiques"], skills: ["Python"] },
    { id: "form-4", institution: "Formation continue", degree: "Certificat", field: "Backend", dates: "2024", status: "En cours", highlights: ["API"], skills: ["FastAPI"] },
  ],
  skills: [
    { id: "skill-1", name: "Python", category: "Langage", level: "Avancé", technologies: ["FastAPI", "Pandas"] },
    { id: "skill-2", name: "Machine Learning", category: "IA", level: "Confirmé", technologies: ["scikit-learn"] },
    { id: "skill-3", name: "SQL", category: "Data", level: "Confirmé", technologies: ["PostgreSQL"] },
  ],
  projects: [{ id: "project-1", title: "Abdoul AI", description: "Portfolio augmenté par l’IA.", slug: "abdoul-ai", category: "Portfolio", technologies: ["Next.js", "FastAPI"], github: "", demo: "", features: ["Chatbot", "Data Lab"] }],
  publications: [{ id: "pub-1", title: "Construire une IA utile", description: "Retour d’expérience sur une IA centrée utilisateur.", date: "2026-06-01", url: "", tags: ["IA", "Produit"] }],
  certifications: [{ id: "cert-1", name: "Machine Learning", issuer: "Organisme de formation", date: "2025-06-01", credential: "" }],
};

function clone<T>(value: T): T {
  return structuredClone(value);
}

export function createMockAdminRepository(resource: AdminResourceName): AdminRepository<StoredRecord, Record<string, string | string[]>> {
  let records = clone(seed[resource]);
  const schema = adminSchemas[resource];

  return {
    async getAll() { return clone(records); },
    async getById(id) { return clone(records.find((record) => record.id === id) ?? null); },
    async create(input) {
      const data = schema.parse(input) as Record<string, string | string[]>;
      const created = { id: `${resource}-${Date.now()}-${records.length}`, ...data };
      records = [...records, created];
      return clone(created);
    },
    async update(id, input) {
      const current = records.find((record) => record.id === id);
      if (!current) throw new Error("Ressource introuvable.");
      const data = schema.parse({ ...current, ...input }) as Record<string, string | string[]>;
      const updated = { id, ...data };
      records = records.map((record) => (record.id === id ? updated : record));
      return clone(updated);
    },
    async remove(id) {
      if (!records.some((record) => record.id === id)) throw new Error("Ressource introuvable.");
      records = records.filter((record) => record.id !== id);
    },
  };
}

export const adminServices = Object.fromEntries(
  (Object.keys(adminSchemas) as AdminResourceName[]).map((resource) => [resource, createMockAdminRepository(resource)]),
) as Record<AdminResourceName, ReturnType<typeof createMockAdminRepository>>;

export function getAdminCounts() {
  return Object.fromEntries(Object.entries(seed).map(([key, records]) => [key, records.length])) as Record<AdminResourceName, number>;
}
