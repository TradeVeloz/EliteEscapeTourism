import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// This sandbox ships a pre-installed Chromium at a fixed path (see
// CLAUDE-code-on-the-web docs) instead of letting Playwright download one.
// CI environments won't have that path, so fall back to Playwright's normal
// browser resolution (after `playwright install`) when it's absent.
const SANDBOX_CHROMIUM = "/opt/pw-browsers/chromium";
const executablePath = existsSync(SANDBOX_CHROMIUM) ? SANDBOX_CHROMIUM : undefined;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3100",
    trace: "on-first-retry",
    launchOptions: {
      executablePath,
      args: executablePath ? ["--headless=new"] : [],
    },
  },
  webServer: {
    command: "npm run start -- -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
