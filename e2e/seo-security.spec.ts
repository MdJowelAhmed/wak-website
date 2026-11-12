import { expect, test } from "@playwright/test";
import { appPath } from "./helpers";

test("robots.txt blocks localized private routes", async ({ request }) => {
  const res = await request.get("/robots.txt");
  expect(res.ok()).toBeTruthy();
  const body = await res.text();
  expect(body).toContain("Disallow: /*/profile/");
  expect(body).toContain("Disallow: /*/check-out$");
  expect(body).toContain("Sitemap:");
});

test("responses include baseline security headers", async ({ request }) => {
  const res = await request.get(appPath("/about-us"));
  expect(res.ok()).toBeTruthy();
  expect(res.headers()["x-content-type-options"]).toBe("nosniff");
  expect(res.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(res.headers()["strict-transport-security"]).toContain("max-age=");
});

test("product detail page exposes metadata when catalog has items", async ({ page, request }) => {
  await page.goto(appPath("/shop"));
  const productLink = page.locator(`a[href*="${appPath("/shop/")}"]`).first();
  const count = await productLink.count();
  test.skip(count === 0, "No products in catalog to test detail metadata");

  const href = await productLink.getAttribute("href");
  expect(href).toBeTruthy();

  const res = await request.get(href!);
  expect(res.ok()).toBeTruthy();
  const html = await res.text();
  expect(html).toContain("<title>");
  expect(html).toMatch(/<meta[^>]+name="description"/i);
});
