import { apiClient } from "@/lib/api/client";
import { experiencesSchema } from "@/schemas/experience";
import type { Experience } from "@/types/experience";

export async function getExperiences(): Promise<Experience[]> {
  return experiencesSchema.parse(await apiClient.get("/api/v1/experiences"));
}
