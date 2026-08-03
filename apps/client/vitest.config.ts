import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // `.vitest.ts(x)`, not `.test.ts(x)` - Bun's own `bun test` runner
    // auto-discovers `.test.`/`.spec.` files repo-wide and can't run these
    // (no jsdom, no vi.* compat), so a bare `bun test` would otherwise crash
    // on them instead of leaving them to this config's `vitest run`.
    include: ["src/**/*.vitest.{ts,tsx}"],
  },
});
