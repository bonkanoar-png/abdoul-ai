import { z } from "zod";

export const skillMatchSchema = z.object({
  name: z.string().min(1),
  level: z.string().min(1),
  match: z.number().min(0).max(100),
});

export const profileAnalysisSchema = z.object({
  skills: z.array(z.string()),
  domains: z.array(z.string()),
  experiences: z.array(z.string()),
});

export const jobMatchSchema = z.object({
  title: z.string().min(1),
  compatibility: z.number().min(0).max(100),
  missingSkills: z.array(z.string()),
});

export const careerAnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  scoreLabel: z.string().min(1),
  profile: profileAnalysisSchema,
  skillMatches: z.array(skillMatchSchema),
  jobMatch: jobMatchSchema,
  recommendations: z.array(z.string().min(1)),
});
