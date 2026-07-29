import { apiClient } from "@/lib/api/client";
import { formationsSchema } from "@/schemas/formation";
import type { Formation } from "@/types/formation";

export async function getFormations(): Promise<Formation[]> {
  return formationsSchema.parse(await apiClient.get("/api/v1/formations"));
}
