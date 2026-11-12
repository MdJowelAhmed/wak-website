import { expect, test } from "@playwright/test";
import { appPath, gotoHomeAndWaitForAuth, LOCALE_HOME } from "./helpers";

test("navbar navigates to shop from home", async ({ page }) => {
  await page.goto(LOCALE_HOME);
  await page.getByRole("link", { name: /^products$/i }).click();
  await expect(page).toHaveURL(new RegExp(`${appPath("/shop")}`));
});

test("mobile menu exposes close control when opened", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoHomeAndWaitForAuth(page);

  await page.getByRole("button", { name: /toggle mobile menu/i }).click();

  const mobileMenu = page.getByTestId("customer-mobile-menu");
  await expect(mobileMenu).toBeAttached({ timeout: 10_000 });
  await expect(mobileMenu.getByRole("button", { name: /^close menu$/i })).toBeVisible();
});
