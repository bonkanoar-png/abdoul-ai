import "server-only";

import {
  publicationsSchema,
  type Publication,
} from "@/features/publications/schemas/publication.schema";
import { apiClient } from "@/lib/api/client";

export type PublicationsResult =
  { status: "success"; data: Publication[] } | { status: "empty" } | { status: "unavailable" };

export async function getPublications(): Promise<Publication[]> {
  return publicationsSchema.parse(await apiClient.get("/api/v1/publications"));
}

export async function getPublicationsResult(
  loadPublications: () => Promise<Publication[]> = getPublications,
): Promise<PublicationsResult> {
  try {
    const publications = publicationsSchema.parse(await loadPublications());
    return publications.length > 0
      ? { status: "success", data: publications }
      : { status: "empty" };
  } catch {
    return { status: "unavailable" };
  }
}
