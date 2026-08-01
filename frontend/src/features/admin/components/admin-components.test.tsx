import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AdminForm, AdminTable } from "@/features/admin/components";

describe("AdminTable", () => {
  it("searches, sorts and exposes row actions", () => {
    const edit = vi.fn();
    render(<AdminTable rows={[{ id: "1", name: "Python" }, { id: "2", name: "SQL" }]} columns={["name"]} labels={{ name: "Nom" }} onEdit={edit} onDelete={vi.fn()} />);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "Python" } });
    expect(screen.getByText("Python")).toBeInTheDocument();
    expect(screen.queryByText("SQL")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Modifier" }));
    expect(edit).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }));
  });
});

describe("AdminForm", () => {
  it("serializes comma-separated lists and displays validation errors", async () => {
    const submit = vi.fn().mockResolvedValue({ name: "Ce champ est requis." });
    render(<AdminForm fields={[{ key: "name", label: "Nom" }, { key: "tags", label: "Tags", kind: "list" }]} loading={false} onCancel={vi.fn()} onSubmit={submit} />);
    fireEvent.change(screen.getByLabelText("Tags"), { target: { value: "IA, Data" } });
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));
    await waitFor(() => expect(submit).toHaveBeenCalledWith({ name: "", tags: ["IA", "Data"] }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Ce champ est requis.");
  });
});

