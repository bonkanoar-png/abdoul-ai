import { adminSchemas, type AdminResourceName } from "@/features/admin/schemas/admin.schema";
import { createAdminApiRepository } from "@/features/admin/services/admin-api";

export const adminServices = Object.fromEntries(
  (Object.keys(adminSchemas) as AdminResourceName[]).map((resource) => [
    resource,
    createAdminApiRepository(resource),
  ]),
) as Record<AdminResourceName, ReturnType<typeof createAdminApiRepository>>;

export async function getAdminCounts(): Promise<Record<AdminResourceName, number>> {
  const entries = await Promise.all(
    (Object.keys(adminServices) as AdminResourceName[]).map(
      async (resource) => [resource, (await adminServices[resource].getAll()).length] as const,
    ),
  );
  return Object.fromEntries(entries) as Record<AdminResourceName, number>;
}
