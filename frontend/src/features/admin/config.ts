import type { AdminResourceName } from "@/features/admin/schemas/admin.schema";

export type AdminField = { key: string; label: string; kind?: "textarea" | "date" | "url" | "email" | "list" };
export type AdminResourceConfig = { singular: string; plural: string; fields: AdminField[]; columns: string[] };

export const adminResourceConfig: Record<AdminResourceName, AdminResourceConfig> = {
  experiences: { singular: "expérience", plural: "Expériences", columns: ["company", "role", "dates"], fields: [
    { key: "company", label: "Entreprise" }, { key: "role", label: "Poste" }, { key: "contractType", label: "Type de contrat" }, { key: "location", label: "Lieu" }, { key: "dates", label: "Dates" }, { key: "description", label: "Description", kind: "textarea" }, { key: "missions", label: "Missions", kind: "list" }, { key: "results", label: "Résultats", kind: "list" }, { key: "technologies", label: "Technologies", kind: "list" }, { key: "skills", label: "Compétences", kind: "list" },
  ]},
  formations: { singular: "formation", plural: "Formations", columns: ["institution", "degree", "status"], fields: [
    { key: "institution", label: "Établissement" }, { key: "degree", label: "Diplôme" }, { key: "field", label: "Domaine" }, { key: "dates", label: "Dates" }, { key: "status", label: "Statut" }, { key: "highlights", label: "Points forts", kind: "list" }, { key: "skills", label: "Compétences", kind: "list" },
  ]},
  skills: { singular: "compétence", plural: "Compétences", columns: ["name", "category", "level"], fields: [
    { key: "name", label: "Nom" }, { key: "category", label: "Catégorie" }, { key: "level", label: "Niveau" }, { key: "technologies", label: "Technologies", kind: "list" },
  ]},
  projects: { singular: "projet", plural: "Projets", columns: ["title", "category", "slug"], fields: [
    { key: "title", label: "Titre" }, { key: "description", label: "Description", kind: "textarea" }, { key: "slug", label: "Slug" }, { key: "category", label: "Catégorie" }, { key: "technologies", label: "Technologies", kind: "list" }, { key: "github", label: "GitHub", kind: "url" }, { key: "demo", label: "Démo", kind: "url" }, { key: "features", label: "Fonctionnalités", kind: "list" },
  ]},
  publications: { singular: "publication", plural: "Publications", columns: ["title", "date", "tags"], fields: [
    { key: "title", label: "Titre" }, { key: "description", label: "Description", kind: "textarea" }, { key: "date", label: "Date", kind: "date" }, { key: "url", label: "URL", kind: "url" }, { key: "tags", label: "Tags", kind: "list" },
  ]},
  certifications: { singular: "certification", plural: "Certifications", columns: ["name", "issuer", "date"], fields: [
    { key: "name", label: "Nom" }, { key: "issuer", label: "Émetteur" }, { key: "date", label: "Date", kind: "date" }, { key: "credential", label: "Justificatif", kind: "url" },
  ]},
};

export const adminNavigation = [
  ["/admin", "Vue d’ensemble"], ["/admin/profile", "Profil"], ["/admin/experiences", "Expériences"], ["/admin/formations", "Formations"], ["/admin/skills", "Compétences"], ["/admin/projects", "Projets"], ["/admin/publications", "Publications"], ["/admin/certifications", "Certifications"], ["/admin/documents", "Documents"], ["/admin/settings", "Paramètres"],
] as const;

