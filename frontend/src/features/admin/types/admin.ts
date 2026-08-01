import type { z } from "zod";

import type {
  certificationAdminSchema,
  experienceAdminSchema,
  formationAdminSchema,
  profileAdminSchema,
  projectAdminSchema,
  publicationAdminSchema,
  skillAdminSchema,
} from "@/features/admin/schemas/admin.schema";

export type AdminEntity<T> = T & { id: string };
export type AdminProfile = z.infer<typeof profileAdminSchema>;
export type AdminExperience = AdminEntity<z.infer<typeof experienceAdminSchema>>;
export type AdminFormation = AdminEntity<z.infer<typeof formationAdminSchema>>;
export type AdminSkill = AdminEntity<z.infer<typeof skillAdminSchema>>;
export type AdminProject = AdminEntity<z.infer<typeof projectAdminSchema>>;
export type AdminPublication = AdminEntity<z.infer<typeof publicationAdminSchema>>;
export type AdminCertification = AdminEntity<z.infer<typeof certificationAdminSchema>>;

export interface AdminRepository<T extends { id: string }, TInput = Omit<T, "id">> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | null>;
  create(input: TInput): Promise<T>;
  update(id: string, input: Partial<TInput>): Promise<T>;
  remove(id: string): Promise<void>;
}

