import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactForm } from "@/features/contact";

describe("ContactForm", () => {
  it("renders accessible required fields and explains local-only behavior", () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/Nom/)).toBeRequired();
    expect(screen.getByLabelText(/Email/)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/Message/)).toBeRequired();
    expect(screen.getByText(/Aucune donnée n’est envoyée ni stockée/)).toBeInTheDocument();
  });

  it("announces validation errors", () => {
    render(<ContactForm />);

    fireEvent.click(screen.getByRole("button", { name: "Valider le message" }));

    expect(screen.getAllByRole("alert")).toHaveLength(3);
    expect(screen.getByLabelText(/Nom/)).toHaveAttribute("aria-invalid", "true");
  });

  it("validates a complete message without sending it", () => {
    render(<ContactForm />);

    fireEvent.change(screen.getByLabelText(/Nom/), { target: { value: "Abdoul" } });
    fireEvent.change(screen.getByLabelText(/Email/), {
      target: { value: "abdoul@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Message/), {
      target: { value: "Bonjour, échangeons sur ce projet Data." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Valider le message" }));

    expect(screen.getByRole("status")).toHaveTextContent("Message validé");
  });
});
