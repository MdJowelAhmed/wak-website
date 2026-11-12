import { describe, expect, it } from "vitest";
import { isServerActionBodyLimitError } from "../../helpers/server-action-errors";

describe("isServerActionBodyLimitError", () => {
  it("detects Next.js body size limit errors", () => {
    expect(
      isServerActionBodyLimitError(
        new Error(
          "Body exceeded 1 MB limit.\nTo configure the body size limit for Server Actions, see: https://nextjs.org/docs/...",
        ),
      ),
    ).toBe(true);
  });

  it("ignores unrelated errors", () => {
    expect(isServerActionBodyLimitError(new Error("Network error"))).toBe(false);
  });
});
