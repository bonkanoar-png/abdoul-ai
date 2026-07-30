import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  CareerScore,
  JobMatchCard,
  ProfileAnalyzer,
  RecommendationPanel,
  SkillMatchCard,
} from "@/features/career-copilot";
import { getMockCareerAnalysis } from "@/features/career-copilot/services/career-service";

describe("Career Copilot presentation", () => {
  const analysis = getMockCareerAnalysis();

  it("renders profile analysis and skill matching", () => {
    render(
      <>
        <ProfileAnalyzer profile={analysis.profile} />
        <SkillMatchCard skill={analysis.skillMatches[0]} />
      </>,
    );

    expect(screen.getByRole("heading", { name: "Analyse du profil" })).toBeInTheDocument();
    expect(screen.getAllByText("Python")).toHaveLength(2);
    expect(screen.getByRole("progressbar", { name: "Correspondance Python" })).toHaveAttribute(
      "aria-valuenow",
      "95",
    );
  });

  it("renders score, job matching and recommendations", () => {
    render(
      <>
        <CareerScore score={analysis.score} label={analysis.scoreLabel} />
        <JobMatchCard job={analysis.jobMatch} />
        <RecommendationPanel recommendations={analysis.recommendations} />
      </>,
    );

    expect(screen.getByRole("status", { name: /Score carrière/ })).toBeInTheDocument();
    expect(screen.getByText("92%")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(5);
  });
});
