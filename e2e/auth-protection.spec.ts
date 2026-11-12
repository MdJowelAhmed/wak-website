import { expect, test } from "@playwright/test";
import { appPath } from "./helpers";

const PROTECTED = ["/profile", "/profile/orders", "/check-out"] as const;

for (const path of PROTECTED) {
  test(`redirects unauthenticated users away from ${path}`, async ({ page }) => {
    await page.goto(appPath(path));
    await expect(page).toHaveURL(new RegExp(`${appPath("/")}$`));
  });
}

test("allows public account pages without forcing login via proxy", async ({ page }) => {
  await page.goto(appPath("/cart"));
  await expect(page).toHaveURL(new RegExp(`${appPath("/cart")}$`));
});
