import { test, expect } from "@playwright/test";

test("question-carousel planner calls the recommendations API and shows a match", async ({ page }) => {
  await page.goto("/ai-travel-planner");

  await expect(page.getByText("Question 1 of 3")).toBeVisible();
  await page.getByRole("button", { name: "Family holiday" }).click();

  await expect(page.getByText("Question 2 of 3")).toBeVisible();
  await page.getByRole("button", { name: "10,000 – 20,000" }).click();

  await expect(page.getByText("Question 3 of 3")).toBeVisible();
  await page.getByRole("button", { name: "Relax & unwind" }).click();

  // The endpoint round-trips through the server (no ANTHROPIC_API_KEY in
  // this environment, so it resolves via the rule-based fallback), which
  // confirms the whole client -> API -> matcher path works end to end.
  await expect(page.getByText("Suggested package")).toBeVisible({ timeout: 10_000 });
  await expect(page.getByRole("link", { name: "View full itinerary" })).toBeVisible();
});

test("voice-brief mode falls back to a text field and matches on submit", async ({ page }) => {
  await page.goto("/ai-travel-planner");
  await page.getByRole("button", { name: "Voice input" }).click();

  const textarea = page.getByPlaceholder("Your spoken (or typed) trip brief will appear here…");
  await textarea.fill("We want a relaxed honeymoon somewhere with beaches");

  await page.getByRole("button", { name: "Match me to a package" }).click();
  await expect(page.getByRole("link", { name: "View full itinerary" })).toBeVisible({ timeout: 10_000 });
});
