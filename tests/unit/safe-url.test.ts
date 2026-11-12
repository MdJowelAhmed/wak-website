import { describe, expect, it } from "vitest";
import { toInternalPath, toSafeExternalUrl } from "../../helpers/safe-url";

describe("toInternalPath", () => {
  it("accepts same-site relative paths", () => {
    expect(toInternalPath("/shop/foo")).toBe("/shop/foo");
    expect(toInternalPath("/services?x=1")).toBe("/services?x=1");
  });

  it("rejects open redirects and unsafe values", () => {
    expect(toInternalPath(null)).toBeNull();
    expect(toInternalPath("")).toBeNull();
    expect(toInternalPath("//evil.com")).toBeNull();
    expect(toInternalPath("https://evil.com")).toBeNull();
    expect(toInternalPath("/shop\\evil")).toBeNull();
    expect(toInternalPath("javascript:alert(1)")).toBeNull();
  });
});

describe("toSafeExternalUrl", () => {
  it("allows http(s) and blocks other schemes", () => {
    expect(toSafeExternalUrl("https://checkout.stripe.com/pay/cs_test_abc")).toMatch(/^https:/);
    expect(toSafeExternalUrl("http://pay.example.com/ok")).toMatch(/^http:/);
    expect(toSafeExternalUrl("javascript:alert(1)")).toBeNull();
    expect(toSafeExternalUrl("data:text/html,hi")).toBeNull();
  });

  it("can require https for payment redirects", () => {
    expect(
      toSafeExternalUrl("http://pay.example.com/", { requireHttps: true }),
    ).toBeNull();
    expect(
      toSafeExternalUrl("https://pay.example.com/", { requireHttps: true }),
    ).not.toBeNull();
  });
});
