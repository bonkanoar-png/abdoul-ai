import { describe, expect, it } from "vitest";

import { ApiError } from "@/lib/api/errors";

describe("ApiError", () => {
  it("retains the stable API error fields", () => {
    const details = [{ location: ["path", "id"], message: "Invalid UUID" }];
    const error = new ApiError(422, {
      code: "VALIDATION_ERROR",
      message: "Request validation failed.",
      details,
    });

    expect(error).toBeInstanceOf(Error);
    expect(error).toMatchObject({
      name: "ApiError",
      status: 422,
      code: "VALIDATION_ERROR",
      message: "Request validation failed.",
      details,
    });
  });
});
