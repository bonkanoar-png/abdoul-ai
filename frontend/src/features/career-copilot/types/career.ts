import type { z } from "zod";

import type {
  careerAnalysisSchema,
  jobMatchSchema,
  profileAnalysisSchema,
  skillMatchSchema,
} from "@/features/career-copilot/schemas/career.schema";

export type CareerAnalysis = z.infer<typeof careerAnalysisSchema>;
export type JobMatch = z.infer<typeof jobMatchSchema>;
export type ProfileAnalysis = z.infer<typeof profileAnalysisSchema>;
export type SkillMatch = z.infer<typeof skillMatchSchema>;
