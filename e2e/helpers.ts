import { expect, type Page } from "@playwright/test";

/** Default locale + shopping country used by the proxy rewrite. */
export const LOCALE_HOME = "/en/mw";

export function appPath(path: string): string {
  if (!path || path === "/") return LOCALE_HOME;
  return path.startsWith("/") ? `${LOCALE_HOME}${path}` : `${LOCALE_HOME}/${path}`;
}

export async function gotoHomeAndWaitForAuth(page: Page) {
  await page.goto(LOCALE_HOME);
  const loginButton = page.locator("header button").filter({ hasText: /login/i });
  const profileLink = page.getByRole("link", { name: /my profile/i });

  await expect(loginButton.or(profileLink).first()).toBeVisible({ timeout: 20_000 });
}

export async function openLoginDialog(page: Page) {
  await page.locator("header").getByRole("button", { name: /login/i }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible({ timeout: 10_000 });
  await expect(dialog.getByLabel(/^email$/i)).toBeVisible();
}
