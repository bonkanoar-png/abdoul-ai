"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { contactSchema, type ContactData } from "@/features/contact/schemas/contact.schema";

type FieldErrors = Partial<Record<keyof ContactData, string>>;

export function ContactForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isReady, setIsReady] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsReady(false);

    const formData = new FormData(event.currentTarget);
    const result = contactSchema.safeParse({
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    });

    if (!result.success) {
      const fields = result.error.flatten().fieldErrors;
      setErrors({
        name: fields.name?.[0],
        email: fields.email?.[0],
        message: fields.message?.[0],
      });
      return;
    }

    setErrors({});
    setIsReady(true);
  }

  return (
    <Card>
      <h2 className="text-ink text-2xl font-bold tracking-[-0.03em]">Préparer votre message</h2>
      <p className="text-muted mt-3 leading-7">
        Ce formulaire valide uniquement votre message dans le navigateur. Aucune donnée n’est
        envoyée ni stockée.
      </p>
      <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
        <div>
          <label className="text-ink text-sm font-bold" htmlFor="contact-name">
            Nom <span aria-hidden="true">*</span>
          </label>
          <input
            className="border-line bg-canvas text-ink mt-2 min-h-12 w-full rounded-xl border px-4"
            id="contact-name"
            name="name"
            required
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? (
            <p className="text-danger mt-2 text-sm" id="contact-name-error" role="alert">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-ink text-sm font-bold" htmlFor="contact-email">
            Email <span aria-hidden="true">*</span>
          </label>
          <input
            className="border-line bg-canvas text-ink mt-2 min-h-12 w-full rounded-xl border px-4"
            id="contact-email"
            name="email"
            type="email"
            required
            aria-describedby={errors.email ? "contact-email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? (
            <p className="text-danger mt-2 text-sm" id="contact-email-error" role="alert">
              {errors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label className="text-ink text-sm font-bold" htmlFor="contact-message">
            Message <span aria-hidden="true">*</span>
          </label>
          <textarea
            className="border-line bg-canvas text-ink mt-2 min-h-40 w-full rounded-xl border p-4"
            id="contact-message"
            name="message"
            required
            aria-describedby={errors.message ? "contact-message-error" : undefined}
            aria-invalid={Boolean(errors.message)}
          />
          {errors.message ? (
            <p className="text-danger mt-2 text-sm" id="contact-message-error" role="alert">
              {errors.message}
            </p>
          ) : null}
        </div>
        <Button type="submit">Valider le message</Button>
        {isReady ? (
          <p className="text-success font-semibold" role="status">
            Message validé. Copiez-le ensuite dans votre messagerie pour l’envoyer.
          </p>
        ) : null}
      </form>
    </Card>
  );
}
