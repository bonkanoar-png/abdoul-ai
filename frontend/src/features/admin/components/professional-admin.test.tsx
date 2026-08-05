import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  AuditTable,
  MediaGallery,
  PermissionGuard,
  RichEditor,
  StatisticsCard,
} from "./professional-admin";

describe("professional admin components", () => {
  it("guards privileged controls", () => {
    const { rerender } = render(
      <PermissionGuard allowed={false}>
        <button>Danger</button>
      </PermissionGuard>,
    );
    expect(screen.queryByRole("button")).toBeNull();
    rerender(
      <PermissionGuard allowed>
        <button>Danger</button>
      </PermissionGuard>,
    );
    expect(screen.getByRole("button", { name: "Danger" })).toBeInTheDocument();
  });

  it("edits Markdown as plain text", () => {
    const onChange = vi.fn();
    render(<RichEditor value="**safe**" onChange={onChange} />);
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "# Titre" } });
    expect(onChange).toHaveBeenCalledWith("# Titre");
  });

  it("renders media, audit and statistics states", () => {
    render(
      <>
        <MediaGallery items={[{ id: "1", url: "/image.png", alt_text: "Projet" }]} />
        <AuditTable
          rows={[
            {
              id: "a",
              actor_email: "admin@example.com",
              action: "UPLOAD",
              resource: "media",
              created_at: "2026-08-01T12:00:00Z",
            },
          ]}
        />
        <StatisticsCard label="Projets" value={4} />
      </>,
    );
    expect(screen.getByAltText("Projet")).toBeInTheDocument();
    expect(screen.getByText("UPLOAD")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});
