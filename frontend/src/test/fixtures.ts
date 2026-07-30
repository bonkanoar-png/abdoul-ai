import type { Certification } from "@/features/certifications";
import type { Experience } from "@/features/experience";
import type { Publication } from "@/features/publications";
import type { Skill } from "@/features/skills";
import type { Profile } from "@/types/profile";

export const baseId = "123e4567-e89b-42d3-a456-426614174000";
export const secondId = "123e4567-e89b-42d3-a456-426614174001";
export const timestamp = "2026-07-01T10:00:00Z";

export const experienceFixture = {
  id: baseId,
  profile_id: secondId,
  company: "Orange SA",
  role: "Data Analyst NLP / IA",
  description: "Analyse et industrialisation de solutions NLP.",
  start_date: "2024-01-01",
  end_date: null,
  is_current: true,
  sort_order: 1,
  created_at: timestamp,
  updated_at: timestamp,
  location: "Paris",
  technologies: ["Python", "NLP"],
} satisfies Experience;

export const skillFixture = {
  id: baseId,
  name: "Python",
  category: "Backend Engineering",
  sort_order: 1,
  created_at: timestamp,
  updated_at: timestamp,
  level: "Avancé",
  icon: null,
} satisfies Skill;

export const publicationFixture = {
  id: baseId,
  title: "Industrialiser un modèle NLP",
  slug: "industrialiser-nlp",
  summary: "Du prototype au service fiable.",
  content: "Contenu technique.",
  published_at: timestamp,
  url: "https://example.com/nlp",
  tags: ["NLP", "Backend"],
} satisfies Publication;

export const certificationFixture = {
  id: baseId,
  name: "Google Data Analytics Certificate",
  issuer: "Google",
  issued_at: "2025-06-01",
  credential_url: "https://example.com/certificate",
  description: "Certification Data.",
} satisfies Certification;

export const profileFixture = {
  id: baseId,
  name: "Abdoul",
  title: "AI Engineer",
  bio: "Profil Data et IA.",
  location: "France",
  email: "abdoul@example.com",
  github_url: "https://github.com/abdoul",
  linkedin_url: null,
  avatar_url: null,
  created_at: timestamp,
  updated_at: timestamp,
} satisfies Profile;
