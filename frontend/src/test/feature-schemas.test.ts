import { describe, expect, it } from "vitest";

import { careerAnalysisSchema } from "@/features/career-copilot/schemas/career.schema";
import { certificationSchema } from "@/features/certifications/schemas/certification.schema";
import { contactSchema } from "@/features/contact/schemas/contact.schema";
import { dataLabSchema } from "@/features/data-lab/schemas/dataset.schema";
import { experienceSchema } from "@/features/experience/schemas/experience.schema";
import { messageSchema } from "@/features/chat/schemas/message.schema";
import { projectSchema } from "@/features/projects/schemas/project.schema";
import { projectFixture } from "@/features/projects/project.fixture";
import { publicationSchema } from "@/features/publications/schemas/publication.schema";
import { skillSchema } from "@/features/skills/schemas/skill.schema";
import { getMockCareerAnalysis } from "@/features/career-copilot/services/career-service";
import { getMockDataLab } from "@/features/data-lab/services/data-lab-service";
import { profileSchema } from "@/schemas/profile";
import {
  certificationFixture,
  experienceFixture,
  profileFixture,
  publicationFixture,
  skillFixture,
  timestamp,
} from "@/test/fixtures";

describe("feature Zod schemas", () => {
  it.each([
    ["Profile", profileSchema, profileFixture],
    ["Experience", experienceSchema, experienceFixture],
    ["Skill", skillSchema, skillFixture],
    ["Project", projectSchema, projectFixture],
    ["Publication", publicationSchema, publicationFixture],
    ["Certification", certificationSchema, certificationFixture],
    [
      "Message",
      messageSchema,
      { id: "message-1", role: "assistant", content: "Réponse", createdAt: timestamp },
    ],
    ["Career", careerAnalysisSchema, getMockCareerAnalysis()],
    ["Dataset", dataLabSchema, getMockDataLab()],
  ])("accepts valid %s data", (_name, schema, value) => {
    expect(schema.safeParse(value).success).toBe(true);
  });

  it("accepts documented optional and nullable fields", () => {
    expect(
      projectSchema.safeParse({
        ...projectFixture,
        image_url: null,
        github_url: null,
        demo_url: null,
        category: null,
      }).success,
    ).toBe(true);
    expect(
      publicationSchema.safeParse({ ...publicationFixture, tags: null, url: null }).success,
    ).toBe(true);
    expect(
      certificationSchema.safeParse({
        ...certificationFixture,
        credential_url: null,
        description: null,
      }).success,
    ).toBe(true);
  });

  it.each([
    ["Profile", profileSchema, { ...profileFixture, email: "invalid" }],
    ["Experience", experienceSchema, { ...experienceFixture, id: "invalid" }],
    ["Skill", skillSchema, { ...skillFixture, name: "" }],
    ["Project", projectSchema, { ...projectFixture, slug: "" }],
    ["Publication", publicationSchema, { ...publicationFixture, url: "invalid" }],
    ["Certification", certificationSchema, { ...certificationFixture, issued_at: "invalid" }],
    [
      "Message",
      messageSchema,
      { id: "message-1", role: "system", content: "Réponse", createdAt: timestamp },
    ],
    ["Career", careerAnalysisSchema, { ...getMockCareerAnalysis(), score: 101 }],
    [
      "Dataset",
      dataLabSchema,
      { ...getMockDataLab(), dataset: { ...getMockDataLab().dataset, rows: -1 } },
    ],
  ])("rejects invalid %s data", (_name, schema, value) => {
    expect(schema.safeParse(value).success).toBe(false);
  });

  it("rejects missing required contact fields and accepts a valid form", () => {
    expect(contactSchema.safeParse({}).success).toBe(false);
    expect(
      contactSchema.safeParse({
        name: "Abdoul",
        email: "abdoul@example.com",
        message: "Un message suffisamment détaillé.",
      }).success,
    ).toBe(true);
  });
});
