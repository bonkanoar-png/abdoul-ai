import { apiClient } from "@/lib/api/client";
import { skillsSchema } from "@/schemas/skill";
import type { Skill } from "@/types/skill";

export async function getSkills(): Promise<Skill[]> {
  return skillsSchema.parse(await apiClient.get("/api/v1/skills"));
}
