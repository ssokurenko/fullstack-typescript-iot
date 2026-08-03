import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const CLIENT_URL = "http://localhost:5173";
export const SERVER_URL = "http://localhost:4000";

export default defineConfig({
  testDir: "./tests",
  // `.e2e.ts`, not `.spec.ts` - Playwright's own default matches `.spec.`/
  // `.test.` files, which Bun's native `bun test` runner also auto-discovers
  // repo-wide and can't run (playwright's test.describe() needs to run under
  // its own runner). Matching a distinct pattern here keeps these out of
  // Bun's way entirely.
  testMatch: "**/*.e2e.ts",
  // Tests share one live server's in-memory state (readings/anomalies), so
  // they must run serially, not in parallel workers.
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: "list",
  use: {
    baseURL: CLIENT_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: [
    {
      command: "bun run dev",
      cwd: path.resolve(__dirname, "../server"),
      url: `${SERVER_URL}/graphql`,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
    {
      command: "bun run dev",
      cwd: path.resolve(__dirname, "../client"),
      url: CLIENT_URL,
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
    },
  ],
});
