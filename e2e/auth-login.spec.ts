import { expect, test } from "@playwright/test";
import { appPath, gotoHomeAndWaitForAuth, LOCALE_HOME, openLoginDialog } from "./helpers";

test.describe("login UI", () => {
  test.beforeEach(async ({ page }) => {
    await gotoHomeAndWaitForAuth(page);
  });

  test("shows validation when submitting empty credentials", async ({ page }) => {
    await openLoginDialog(page);

    await page.getByRole("button", { name: /^sign in$/i }).click();
    await expect(page.getByText(/please enter email and password/i)).toBeVisible();
  });

  test("shows an error for invalid credentials", async ({ page }) => {
    await openLoginDialog(page);
    await page.getByLabel(/^email$/i).fill("e2e-invalid@worthworld.test");
    await page.getByLabel(/^password$/i).fill("not-a-real-password");
    const submit = page.getByRole("button", { name: /^sign in$/i });
    await submit.click();

    await expect(submit).toBeEnabled({ timeout: 45_000 });

    const toast = page.locator("[data-sonner-toast]");
    await expect(toast.first()).toBeVisible({ timeout: 10_000 });
    await expect(toast.first()).toContainText(
      /invalid|failed|wrong|something went wrong|network error|credential|unauthorized|incorrect|doesn'?t exist/i,
    );
  });
});

const email = process.env.E2E_AUTH_EMAIL;
const password = process.env.E2E_AUTH_PASSWORD;

test.describe("login with real API", () => {
  test.skip(!email || !password, "Set E2E_AUTH_EMAIL and E2E_AUTH_PASSWORD to run");

  test("logs in and shows the account menu", async ({ page }) => {
    await gotoHomeAndWaitForAuth(page);
    await openLoginDialog(page);
    await page.getByLabel(/^email$/i).fill(email!);
    await page.getByLabel(/^password$/i).fill(password!);
    await page.getByRole("button", { name: /^sign in$/i }).click();

    await expect(page.getByText(/logged in successfully/i)).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("link", { name: /my profile/i })).toBeVisible({ timeout: 20_000 });
  });

  test("logged-in user can open profile", async ({ page, context }) => {
    await gotoHomeAndWaitForAuth(page);
    await openLoginDialog(page);
    await page.getByLabel(/^email$/i).fill(email!);
    await page.getByLabel(/^password$/i).fill(password!);
    await page.getByRole("button", { name: /^sign in$/i }).click();
    await expect(page.getByRole("link", { name: /my profile/i })).toBeVisible({
      timeout: 20_000,
    });

    await page.goto(appPath("/profile/personal-info"));
    await expect(page).toHaveURL(new RegExp(`${appPath("/profile")}`));
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const cookies = await context.cookies();
    expect(cookies.some((c) => c.name === "accessToken" && c.value.length > 0)).toBe(true);
  });
});
