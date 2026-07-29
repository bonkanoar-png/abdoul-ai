import { apiClient } from "@/lib/api/client";
import { certificationsSchema } from "@/schemas/certification";
import type { Certification } from "@/types/certification";

export async function getCertifications(): Promise<Certification[]> {
  return certificationsSchema.parse(await apiClient.get("/api/v1/certifications"));
}
