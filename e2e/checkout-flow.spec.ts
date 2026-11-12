import { expect, test } from "@playwright/test";
import { appPath, gotoHomeAndWaitForAuth } from "./helpers";

test("guest is redirected from checkout to home", async ({ page }) => {
  await gotoHomeAndWaitForAuth(page);
  await page.goto(appPath("/check-out"));
  await expect(page).toHaveURL(new RegExp(`${appPath("/")}$`));
});

test("payment callback pages render stable headings", async ({ page }) => {
  await page.goto(appPath("/order/success?orderId=e2e-test"));
  await expect(page.getByRole("heading", { name: /payment successful/i })).toBeVisible();

  await page.goto(appPath("/order/failed?orderId=e2e-test"));
  await expect(page.getByRole("heading", { name: /payment failed/i })).toBeVisible();
});
