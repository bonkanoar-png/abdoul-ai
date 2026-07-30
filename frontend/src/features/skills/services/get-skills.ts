import "server-only";

import { skillsSchema, type Skill } from "@/features/skills/schemas/skill.schema";
import { apiClient } from "@/lib/api/client";

export type SkillsResult =
  { status: "success"; data: Skill[] } | { status: "empty" } | { status: "unavailable" };

export async function getSkills(): Promise<Skill[]> {
  return skillsSchema.parse(await apiClient.get("/api/v1/skills"));
}

export async function getSkillsResult(
  loadSkills: () => Promise<Skill[]> = getSkills,
): Promise<SkillsResult> {
  try {
    const skills = skillsSchema.parse(await loadSkills());
    return skills.length > 0 ? { status: "success", data: skills } : { status: "empty" };
  } catch {
    return { status: "unavailable" };
  }
}
