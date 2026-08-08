import { test, expect } from "@playwright/test";

test("homepage renders hero, trust bar, and navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Your Escape, Our Elite Services" })).toBeVisible();
  await expect(page.getByText("Destinations").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Plan your escape with AI" })).toBeVisible();
});

test("primary navigation links are present", async ({ page }) => {
  await page.goto("/");
  const nav = page.locator("header nav");
  await expect(nav.getByRole("link", { name: "Holidays" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "Visa" })).toBeVisible();
  await expect(nav.getByRole("link", { name: "AI Travel Planner" })).toBeVisible();
});

test("security headers are present on every response", async ({ page }) => {
  const response = await page.goto("/");
  const headers = response?.headers() ?? {};
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
});
