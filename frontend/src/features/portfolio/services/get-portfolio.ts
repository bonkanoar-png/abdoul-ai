import "server-only";

import { ApiClientError, apiRequest } from "@/lib/api-client";
import type { Portfolio } from "@/types/portfolio";

export type PortfolioResult =
  { status: "success"; data: Portfolio } | { status: "not-found" } | { status: "unavailable" };

export async function getPortfolio(): Promise<PortfolioResult> {
  try {
    const data = await apiRequest<Portfolio>("/api/v1/portfolio");
    return { status: "success", data };
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return { status: "not-found" };
    }

    return { status: "unavailable" };
  }
}
