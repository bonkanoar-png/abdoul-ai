import { apiClient } from "@/lib/api/client";
import { publicationsSchema } from "@/schemas/publication";
import type { Publication } from "@/types/publication";

export async function getPublications(): Promise<Publication[]> {
  return publicationsSchema.parse(await apiClient.get("/api/v1/publications"));
}
