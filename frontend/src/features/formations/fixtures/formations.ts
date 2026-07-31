import type { Formation } from "@/features/formations/types/formation";

export const formationFixtures = [
  {
    id: "2f33ad0e-e886-45cb-812a-2dd2ff9ba72c",
    title: "Master IA, Science des données et systèmes intelligents",
    degree: "Master",
    institution: "Université Paris-Est Créteil (UPEC)",
    location: "France",
    startDate: "2021",
    endDate: "2023",
    description:
      "Formation avancée en conception de systèmes intelligents, apprentissage automatique et valorisation des données.",
    skills: ["IA", "Machine Learning", "Deep Learning", "Data Science"],
    type: "Intelligence artificielle",
    website: "https://www.u-pec.fr/",
  },
  {
    id: "57376946-6c8f-46b7-9a5a-0e8d573a50e0",
    title: "Master Statistiques & Data Science",
    degree: "Master",
    institution: "Université Paris 13 / Fès",
    location: "France / Maroc",
    startDate: "2020",
    endDate: "2020",
    description:
      "Spécialisation en méthodes statistiques, modélisation et analyse de données appliquées.",
    skills: ["Statistiques", "Modélisation", "Analyse de données"],
    type: "Data Science",
    mention: "Parcours Data Science",
  },
  {
    id: "e397bc8f-32d8-4e07-b336-aac8df1cfcbf",
    title: "Licence Mathématiques et Applications",
    degree: "Licence",
    institution: "Université",
    location: "Maroc",
    startDate: "2017",
    endDate: "2020",
    description:
      "Socle scientifique en mathématiques appliquées, probabilités et raisonnement statistique.",
    skills: ["Mathématiques", "Probabilités", "Statistiques"],
    type: "Mathématiques",
    credential: "Licence Mathématiques et Applications",
  },
] satisfies Formation[];
