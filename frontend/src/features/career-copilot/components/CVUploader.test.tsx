import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CVUploader } from "@/features/career-copilot";

describe("CVUploader", () => {
  it("renders its empty local-only state", () => {
    render(<CVUploader />);

    expect(screen.getByText("Aucun fichier sélectionné")).toBeInTheDocument();
    expect(screen.getByText(/Aucun fichier n’est envoyé, stocké ou analysé/)).toBeInTheDocument();
  });

  it("shows the selected filename without uploading it", () => {
    render(<CVUploader />);
    const file = new File(["mock"], "cv-abdoul.pdf", { type: "application/pdf" });

    fireEvent.change(screen.getByLabelText("Sélectionner un CV PDF — démonstration locale"), {
      target: { files: [file] },
    });

    expect(screen.getByText("Sélectionné : cv-abdoul.pdf")).toBeInTheDocument();
  });
});
