import { test, expect } from "@playwright/test";

test("holidays page lists packages and filters by type", async ({ page }) => {
  await page.goto("/holidays");
  await expect(page.getByRole("heading", { name: "Bespoke journeys, ready to book" })).toBeVisible();

  const cardsBefore = await page.locator("text=View details").count();
  expect(cardsBefore).toBeGreaterThan(1);

  await page.getByRole("button", { name: "Family" }).click();
  await expect(page.getByText("Swiss Alps Family Adventure")).toBeVisible();
  await expect(page.getByText("Maldives Overwater Honeymoon")).toHaveCount(0);
});

test("package detail page shows itinerary and a booking form", async ({ page }) => {
  await page.goto("/holidays/maldives-overwater-honeymoon");
  await expect(page.getByRole("heading", { name: "Maldives Overwater Honeymoon" })).toBeVisible();
  await expect(page.getByText("Itinerary")).toBeVisible();
  await expect(page.getByRole("heading", { name: "Enquire about this package" })).toBeVisible();
});
