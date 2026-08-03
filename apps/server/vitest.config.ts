import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // `.vitest.ts`, not `.test.ts` - Bun's own `bun test` runner auto-discovers
    // `.test.`/`.spec.` files repo-wide and can't run these (they use vi.*
    // APIs and jsdom that its Vitest-compat shim doesn't cover), so a bare
    // `bun test` would otherwise crash on them instead of leaving them to
    // this config's `vitest run`.
    include: ["src/**/*.vitest.ts"],
  },
});
