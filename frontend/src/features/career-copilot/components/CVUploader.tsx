"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export function CVUploader() {
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <Card>
      <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]">CV simulé</h2>
      <p className="text-muted mt-3 leading-7">
        Sélectionnez un fichier pour prévisualiser l’expérience. Aucun fichier n’est envoyé, stocké
        ou analysé.
      </p>
      <label
        className="border-line bg-canvas text-ink hover:border-accent mt-6 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-5 text-center font-semibold transition"
        htmlFor="career-cv"
      >
        <span>{fileName ? "Changer de CV" : "Sélectionner un CV"}</span>
        <span className="text-muted mt-1 text-xs font-normal">PDF — démonstration locale</span>
      </label>
      <input
        className="sr-only"
        id="career-cv"
        type="file"
        accept=".pdf,application/pdf"
        aria-label="Sélectionner un CV PDF — démonstration locale"
        onChange={(event) => setFileName(event.target.files?.[0]?.name ?? null)}
      />
      <div className="mt-5" aria-live="polite">
        {fileName ? (
          <Badge variant="success">Sélectionné : {fileName}</Badge>
        ) : (
          <p className="text-muted text-sm">Aucun fichier sélectionné</p>
        )}
      </div>
    </Card>
  );
}
