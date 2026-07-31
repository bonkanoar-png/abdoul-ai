import "server-only";

import { formationFixtures } from "@/features/formations/fixtures/formations";
import { formationsSchema } from "@/features/formations/schemas/formation.schema";
import type { Formation } from "@/features/formations/types/formation";

export type FormationsResult =
  { status: "success"; data: Formation[] } | { status: "empty" } | { status: "error" };

/**
 * Local, validated source that can later be replaced by an API adapter without
 * changing the page or presentation components.
 */
export async function getFormations(): Promise<Formation[]> {
  return formationsSchema.parse(formationFixtures);
}

export async function getFormationsResult(
  loadFormations: () => Promise<Formation[]> = getFormations,
): Promise<FormationsResult> {
  try {
    const formations = formationsSchema.parse(await loadFormations());
    return formations.length > 0 ? { status: "success", data: formations } : { status: "empty" };
  } catch {
    return { status: "error" };
  }
}
