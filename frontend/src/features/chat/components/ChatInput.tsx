"use client";

import type { FormEvent } from "react";

import { Button } from "@/components/ui/button";

type ChatInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: (message: string) => void;
  disabled?: boolean;
};

export function ChatInput({ value, onChange, onSend, disabled = false }: ChatInputProps) {
  const isEmpty = value.trim().length === 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = value.trim();
    if (!message || disabled) {
      return;
    }
    onSend(message);
  }

  return (
    <form className="border-line border-t pt-5" onSubmit={handleSubmit}>
      <label className="text-ink text-sm font-bold" htmlFor="chat-message">
        Votre question
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end">
        <textarea
          className="border-line bg-canvas text-ink min-h-24 flex-1 resize-y rounded-2xl border p-4"
          id="chat-message"
          value={value}
          disabled={disabled}
          placeholder="Posez une question sur le parcours d’Abdoul…"
          onChange={(event) => onChange(event.target.value)}
        />
        <Button type="submit" disabled={disabled || isEmpty}>
          Envoyer
        </Button>
      </div>
    </form>
  );
}
