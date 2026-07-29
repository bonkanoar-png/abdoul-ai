import { apiClient } from "@/lib/api/client";
import { documentsSchema } from "@/schemas/document";
import type { Document } from "@/types/document";

export async function getDocuments(): Promise<Document[]> {
  return documentsSchema.parse(await apiClient.get("/api/v1/documents"));
}
