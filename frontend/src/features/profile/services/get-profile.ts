import "server-only";

import { getProfile } from "@/lib/api/services/profile";
import { ApiError } from "@/lib/api/errors";
import type { Profile } from "@/types/profile";

export type ProfileResult =
  { status: "success"; data: Profile } | { status: "not-found" } | { status: "unavailable" };

function isNotFoundError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return error.status === 404;
  }

  return typeof error === "object" && error !== null && "status" in error && error.status === 404;
}

export async function getProfileResult(
  loadProfile: () => Promise<Profile> = getProfile,
): Promise<ProfileResult> {
  try {
    return { status: "success", data: await loadProfile() };
  } catch (error) {
    if (isNotFoundError(error)) {
      return { status: "not-found" };
    }

    return { status: "unavailable" };
  }
}
