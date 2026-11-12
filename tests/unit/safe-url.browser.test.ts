/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { redirectToCheckout } from "../../helpers/safe-url";

describe("redirectToCheckout", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("navigates only to https checkout URLs", () => {
    const assign = vi.fn();
    vi.stubGlobal("location", { assign });

    expect(redirectToCheckout("https://checkout.stripe.com/pay/cs_test_abc")).toBe(true);
    expect(assign).toHaveBeenCalledWith("https://checkout.stripe.com/pay/cs_test_abc");

    assign.mockClear();
    expect(redirectToCheckout("http://insecure.example/checkout")).toBe(false);
    expect(assign).not.toHaveBeenCalled();

    expect(redirectToCheckout("javascript:alert(1)")).toBe(false);
    expect(redirectToCheckout(null)).toBe(false);
  });
});
