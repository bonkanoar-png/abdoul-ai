import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CareerCopilotPage from "@/app/career-copilot/page";
import DataLabPage from "@/app/data-lab/page";
import { ChatWindow } from "@/features/chat";
import { ContactForm } from "@/features/contact";
import { ProjectCard, ProjectDetails } from "@/features/projects";
import { projectFixture } from "@/features/projects/project.fixture";

describe("principal user flows", () => {
  it("moves from a project card to its complete local details", () => {
    const { unmount } = render(<ProjectCard project={projectFixture} />);
    expect(screen.getByRole("link", { name: "Découvrir le projet" })).toHaveAttribute(
      "href",
      `/projects/${projectFixture.slug}`,
    );
    unmount();

    render(<ProjectDetails project={projectFixture} />);
    expect(
      screen.getByRole("heading", { level: 1, name: projectFixture.title }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Technologies" })).toBeInTheDocument();
  });

  it("selects an AI suggestion and receives mock messages", () => {
    render(<ChatWindow />);
    fireEvent.click(screen.getByRole("button", { name: "Quels sont ses projets IA ?" }));
    fireEvent.click(screen.getByRole("button", { name: "Envoyer" }));

    expect(screen.getByRole("article", { name: "Message utilisateur" })).toBeInTheDocument();
    expect(screen.getByRole("article", { name: "Message assistant" })).toHaveTextContent(
      "Réponse simulée",
    );
    expect(screen.getByLabelText("Messages de la conversation")).toHaveAttribute(
      "aria-live",
      "polite",
    );
  });

  it("validates the complete contact form flow accessibly", () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole("button", { name: "Valider le message" }));
    expect(screen.getAllByRole("alert")).toHaveLength(3);

    fireEvent.change(screen.getByLabelText(/Nom/), { target: { value: "Abdoul" } });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: "abdoul@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Message/), {
      target: { value: "Échangeons sur une mission Data et IA." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Valider le message" }));

    expect(screen.getByRole("status")).toHaveTextContent("Message validé");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("shows the Career Copilot analysis and score flow", () => {
    render(<CareerCopilotPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Career Copilot" })).toBeInTheDocument();
    expect(screen.getByRole("status", { name: "Score carrière 87 sur 100" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Machine Learning Engineer" })).toBeInTheDocument();
  });

  it("shows the Data Lab dataset, metrics and accessible table flow", () => {
    render(<DataLabPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Data Lab" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Customer NLP Dataset" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Accuracy" })).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Extrait simulé du Customer NLP Dataset" }),
    ).toBeInTheDocument();
  });
});
