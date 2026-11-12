import { expect, test } from "@playwright/test";
import { appPath, LOCALE_HOME } from "./helpers";

test("home page loads with main navigation", async ({ page }) => {
  await page.goto(LOCALE_HOME);
  await expect(page).toHaveTitle(/WorthWorld/i);
  const nav = page.getByRole("navigation");
  await expect(nav.getByRole("link", { name: /^products$/i })).toBeVisible();
  await expect(nav.getByRole("link", { name: /^services$/i })).toBeVisible();
});

test("shop and services listing pages render", async ({ page }) => {
  await page.goto(appPath("/shop"));
  await expect(page.getByRole("button", { name: /add to cart/i }).first()).toBeVisible({
    timeout: 30_000,
  });

  await page.goto(appPath("/services"));
  await expect(page).toHaveTitle(/services/i);
});

test("payment status pages are reachable", async ({ page }) => {
  await page.goto(appPath("/order/success"));
  await expect(page.getByRole("heading", { name: /payment successful/i })).toBeVisible();

  await page.goto(appPath("/order/failed"));
  await expect(page.getByRole("heading", { name: /payment failed/i })).toBeVisible();
});
