import { adminSchemas, type AdminResourceName } from "@/features/admin/schemas/admin.schema";
import type { AdminRepository } from "@/features/admin/types/admin";

type AdminInput = Record<string, string | string[]>;
type AdminRecord = { id: string } & AdminInput;
type ApiRecord = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  slug: string | null;
  start_date: string | null;
  end_date: string | null;
  url: string | null;
  category: string;
  is_current: boolean;
  is_active: boolean;
  sort_order: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
export class AdminApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (!(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
  });
  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;
    throw new AdminApiError(
      response.status,
      payload?.error?.message ?? "La requête Admin a échoué.",
    );
  }
  return response.status === 204 ? (undefined as T) : (response.json() as Promise<T>);
}

export async function loginAdmin(email: string, password: string): Promise<void> {
  await request<void>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logoutAdmin(): Promise<void> {
  await request<void>("/auth/logout", { method: "POST" });
}

export type AdminStatistics = {
  projects_count: number;
  experiences_count: number;
  formations_count: number;
  documents_count: number;
  publications_count: number;
  users_count: number;
  last_activity: string | null;
};

export const getAdminStatistics = () => request<AdminStatistics>("/admin/statistics");

export async function uploadAdminFile(file: File, kind: "documents" | "media", altText = "") {
  const form = new FormData();
  form.append("file", file);
  if (kind === "media") form.append("alt_text", altText);
  return request<{ id: string; filename: string; url: string }>(`/admin/${kind}/upload`, {
    method: "POST",
    body: form,
    headers: {},
  });
}

function toApi(resource: AdminResourceName, input: AdminInput): Omit<ApiRecord, "id"> {
  const text = (key: string) => (typeof input[key] === "string" ? (input[key] as string) : "");
  const dates = text("dates").match(/\d{4}-\d{2}-\d{2}/g) ?? [];
  return {
    title:
      text(
        resource === "experiences" ? "company" : resource === "formations" ? "institution" : "name",
      ) || text("title"),
    subtitle: text(
      resource === "experiences"
        ? "role"
        : resource === "formations"
          ? "degree"
          : resource === "certifications"
            ? "issuer"
            : "category",
    ),
    description: text("description"),
    slug: text("slug") || null,
    start_date: text("date") || dates[0] || null,
    end_date: dates[1] || null,
    url: text("url") || text("demo") || text("credential") || null,
    category: text("category") || text("field") || "General",
    is_current: false,
    is_active: true,
    sort_order: 0,
  };
}

function fromApi(resource: AdminResourceName, row: ApiRecord): AdminRecord {
  const dates = [row.start_date, row.end_date].filter(Boolean).join(" — ");
  const base: Record<AdminResourceName, AdminInput> = {
    experiences: {
      company: row.title,
      role: row.subtitle,
      contractType: row.category,
      location: "",
      dates,
      description: row.description,
      missions: [],
      results: [],
      technologies: [],
      skills: [],
    },
    formations: {
      institution: row.title,
      degree: row.subtitle,
      field: row.category,
      dates,
      status: row.is_current ? "En cours" : "Obtenu",
      highlights: [],
      skills: [],
    },
    skills: {
      name: row.title,
      category: row.category,
      level: row.subtitle || "Non renseigné",
      technologies: [],
    },
    projects: {
      title: row.title,
      description: row.description,
      slug: row.slug ?? "",
      category: row.category,
      technologies: [],
      github: "",
      demo: row.url ?? "",
      features: [],
    },
    publications: {
      title: row.title,
      description: row.description,
      date: row.start_date ?? "",
      url: row.url ?? "",
      tags: [],
    },
    certifications: {
      name: row.title,
      issuer: row.subtitle,
      date: row.start_date ?? "",
      credential: row.url ?? "",
    },
  };
  return { id: row.id, ...base[resource] };
}

export function createAdminApiRepository(
  resource: AdminResourceName,
): AdminRepository<AdminRecord, AdminInput> {
  const path = `/admin/${resource}`;
  return {
    async getAll() {
      return (await request<ApiRecord[]>(path)).map((row) => fromApi(resource, row));
    },
    async getById(id) {
      try {
        return fromApi(resource, await request<ApiRecord>(`${path}/${id}`));
      } catch (error) {
        if (error instanceof AdminApiError && error.status === 404) return null;
        throw error;
      }
    },
    async create(input) {
      const parsed = adminSchemas[resource].parse(input) as AdminInput;
      return fromApi(
        resource,
        await request<ApiRecord>(path, {
          method: "POST",
          body: JSON.stringify(toApi(resource, parsed)),
        }),
      );
    },
    async update(id, input) {
      const current = await this.getById(id);
      if (!current) throw new AdminApiError(404, "Ressource introuvable.");
      const parsed = adminSchemas[resource].parse({ ...current, ...input }) as AdminInput;
      return fromApi(
        resource,
        await request<ApiRecord>(`${path}/${id}`, {
          method: "PUT",
          body: JSON.stringify(toApi(resource, parsed)),
        }),
      );
    },
    async remove(id) {
      await request<void>(`${path}/${id}`, { method: "DELETE" });
    },
  };
}

export const getExperiences = () => createAdminApiRepository("experiences").getAll();
export const createExperience = (input: AdminInput) =>
  createAdminApiRepository("experiences").create(input);
export const updateExperience = (id: string, input: AdminInput) =>
  createAdminApiRepository("experiences").update(id, input);
export const deleteExperience = (id: string) => createAdminApiRepository("experiences").remove(id);

export type AssociatedMedia = { id: string; url: string; alt_text: string; sort_order: number };
export const getAssociatedMedia = (resource: string, contentId: string) =>
  request<AssociatedMedia[]>(`/admin/${resource}/${contentId}/media`);
export const attachMedia = (resource: string, contentId: string, mediaId: string, sortOrder = 0) =>
  request<void>(`/admin/${resource}/${contentId}/media`, {
    method: "POST",
    body: JSON.stringify({ media_id: mediaId, sort_order: sortOrder }),
  });
export const detachMedia = (resource: string, contentId: string, mediaId: string) =>
  request<void>(`/admin/${resource}/${contentId}/media/${mediaId}`, { method: "DELETE" });
