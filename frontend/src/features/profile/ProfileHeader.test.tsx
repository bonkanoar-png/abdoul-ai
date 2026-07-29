import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileHeader } from "@/features/profile";

describe("ProfileHeader", () => {
  it("renders identity, location and an accessible avatar", () => {
    render(
      <ProfileHeader
        profile={{
          name: "Abdoul",
          title: "AI/Data/Backend Engineer",
          location: "Paris, France",
          avatar_url: "https://example.com/avatar.jpg",
        }}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Abdoul" })).toBeInTheDocument();
    expect(screen.getByText("AI/Data/Backend Engineer")).toBeInTheDocument();
    expect(screen.getByText("Paris, France")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Abdoul" })).toHaveAttribute(
      "src",
      "https://example.com/avatar.jpg",
    );
  });

  it("uses named initials when no avatar is available", () => {
    render(
      <ProfileHeader
        profile={{
          name: "Abdoul Diallo",
          title: "AI Engineer",
          location: "France",
          avatar_url: null,
        }}
      />,
    );

    expect(screen.getByLabelText("Abdoul Diallo")).toHaveTextContent("AD");
  });
});
