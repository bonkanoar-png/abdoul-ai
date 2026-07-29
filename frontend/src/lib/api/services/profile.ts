import { apiClient } from "@/lib/api/client";
import { profileSchema } from "@/schemas/profile";
import type { Profile } from "@/types/profile";

export async function getProfile(): Promise<Profile> {
  return profileSchema.parse(await apiClient.get("/api/v1/profile"));
}
