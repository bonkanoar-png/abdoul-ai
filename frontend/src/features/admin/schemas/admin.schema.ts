import { z } from "zod";

const required = z.string().trim().min(1, "Ce champ est requis.");
const optionalUrl = z.union([z.literal(""), z.url("URL invalide.")]);
const list = z.array(required).default([]);

export const profileAdminSchema = z.object({
  name: required,
  title: required,
  bio: required,
  location: required,
  email: z.email("Adresse email invalide."),
  github: optionalUrl,
  linkedin: optionalUrl,
  avatar: optionalUrl,
});

export const experienceAdminSchema = z.object({
  company: required,
  role: required,
  contractType: required,
  location: required,
  dates: required,
  description: required,
  missions: list,
  results: list,
  technologies: list,
  skills: list,
});

export const formationAdminSchema = z.object({
  institution: required,
  degree: required,
  field: required,
  dates: required,
  status: required,
  highlights: list,
  skills: list,
});

export const skillAdminSchema = z.object({
  name: required,
  category: required,
  level: required,
  technologies: list,
});

export const projectAdminSchema = z.object({
  title: required,
  description: required,
  slug: z.string().trim().min(1, "Le slug est requis.").regex(/^[a-z0-9-]+$/, "Minuscules, chiffres et tirets uniquement."),
  category: required,
  technologies: list,
  github: optionalUrl,
  demo: optionalUrl,
  features: list,
});

export const publicationAdminSchema = z.object({
  title: required,
  description: required,
  date: z.iso.date("Date invalide."),
  url: optionalUrl,
  tags: list,
});

export const certificationAdminSchema = z.object({
  name: required,
  issuer: required,
  date: z.iso.date("Date invalide."),
  credential: optionalUrl,
});

export const adminSchemas = {
  experiences: experienceAdminSchema,
  formations: formationAdminSchema,
  skills: skillAdminSchema,
  projects: projectAdminSchema,
  publications: publicationAdminSchema,
  certifications: certificationAdminSchema,
} as const;

export type AdminResourceName = keyof typeof adminSchemas;
export type AdminRecordInput = Record<string, string | string[]>;

