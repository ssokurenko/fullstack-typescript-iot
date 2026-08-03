import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Explicit rather than relying on `test.globals` auto-detection, so
// rendered DOM never leaks between tests regardless of that setting.
afterEach(() => {
  cleanup();
});
