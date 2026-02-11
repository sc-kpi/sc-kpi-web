import { expect, test } from "@playwright/test";

test.describe("Home page", () => {
  test("should display the main heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });

  test("should stay on root URL (no locale prefix)", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL("/");
  });

  test("should display Ukrainian content by default", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Студентська Рада КПІ" })).toBeVisible();
  });
});
