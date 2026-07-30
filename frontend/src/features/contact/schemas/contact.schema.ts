import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Indiquez votre nom."),
  email: z.email("Indiquez une adresse email valide."),
  message: z.string().trim().min(10, "Le message doit contenir au moins 10 caractères."),
});

export type ContactData = z.infer<typeof contactSchema>;
