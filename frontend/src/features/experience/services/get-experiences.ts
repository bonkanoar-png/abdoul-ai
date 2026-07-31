import "server-only";

import { z } from "zod";

import {
  experiencesSchema,
  type Experience,
} from "@/features/experience/schemas/experience.schema";
import { experienceFixtures } from "@/features/experience/fixtures/experiences";
import { apiClient } from "@/lib/api/client";

export type ExperiencesResult =
  { status: "success"; data: Experience[] } | { status: "empty" } | { status: "unavailable" };

export async function getExperiences(): Promise<Experience[]> {
  return experiencesSchema.parse(await apiClient.get("/api/v1/experiences"));
}

export async function getPortfolioExperiences(): Promise<Experience[]> {
  return experiencesSchema.parse(experienceFixtures);
}

export async function getExperiencesResult(
  loadExperiences: () => Promise<Experience[]> = getPortfolioExperiences,
): Promise<ExperiencesResult> {
  try {
    const experiences = experiencesSchema.parse(await loadExperiences());
    return experiences.length > 0 ? { status: "success", data: experiences } : { status: "empty" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "unavailable" };
    }
    return { status: "unavailable" };
  }
}
