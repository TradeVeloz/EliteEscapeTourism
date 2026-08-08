import { test, expect } from "@playwright/test";

test("visa page lists requirements and renders the application form", async ({ page }) => {
  await page.goto("/visa");
  await expect(page.getByRole("heading", { name: "Requirements by destination" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Maldives" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Start a visa application" })).toBeVisible();
});

test("contact page shows a working (client-side) success state", async ({ page }) => {
  await page.goto("/contact");
  await page.fill('input[type="email"]', "traveler@example.com");
  await page.locator('input[required]:not([type="email"])').first().fill("Traveler Name");
  const phoneInput = page.locator('input[type="tel"]');
  await phoneInput.fill("+971501234567");
  await page.locator("textarea").fill("Interested in a honeymoon package.");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Message sent")).toBeVisible();
});

test("client portal shows the sign-in form when no session exists", async ({ page }) => {
  await page.goto("/client-portal");
  await expect(page.locator("form").getByRole("button", { name: "Sign in" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
});

test("attractions page lists curated experiences", async ({ page }) => {
  await page.goto("/attractions");
  await expect(page.getByText("House Reef Snorkelling")).toBeVisible();
});
