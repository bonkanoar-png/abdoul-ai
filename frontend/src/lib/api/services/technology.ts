import { apiClient } from "@/lib/api/client";
import { technologiesSchema } from "@/schemas/technology";
import type { Technology } from "@/types/technology";

export async function getTechnologies(): Promise<Technology[]> {
  return technologiesSchema.parse(await apiClient.get("/api/v1/technologies"));
}
