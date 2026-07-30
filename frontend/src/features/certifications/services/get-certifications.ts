import "server-only";

import {
  certificationsSchema,
  type Certification,
} from "@/features/certifications/schemas/certification.schema";
import { apiClient } from "@/lib/api/client";

export type CertificationsResult =
  { status: "success"; data: Certification[] } | { status: "empty" } | { status: "unavailable" };

export async function getCertifications(): Promise<Certification[]> {
  return certificationsSchema.parse(await apiClient.get("/api/v1/certifications"));
}

export async function getCertificationsResult(
  loadCertifications: () => Promise<Certification[]> = getCertifications,
): Promise<CertificationsResult> {
  try {
    const certifications = certificationsSchema.parse(await loadCertifications());
    return certifications.length > 0
      ? { status: "success", data: certifications }
      : { status: "empty" };
  } catch {
    return { status: "unavailable" };
  }
}
