"use client";

import { useState } from "react";
import { FileUploader } from "@/features/admin/components";

export default function DocumentsPage() {
  const [files, setFiles] = useState<{ id: string; filename: string; url: string }[]>([]);
  return (
    <section>
      <h1 className="text-3xl font-bold">Documents</h1>
      <p className="text-muted mt-2 mb-8">
        PDF et images sécurisés, persistés dans le stockage configuré.
      </p>
      <FileUploader onUploaded={(file) => setFiles((current) => [file, ...current])} />
      {files.length ? (
        <ul className="mt-6 space-y-2">
          {files.map((file) => (
            <li key={file.id}>
              <a className="text-accent underline" href={file.url}>
                {file.filename}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted mt-6">Aucun document envoyé pendant cette session.</p>
      )}
    </section>
  );
}
