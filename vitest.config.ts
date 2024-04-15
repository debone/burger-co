import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    includeSource: ["**/*.test.ts", "src/**/*.ts"],
    environment: "happy-dom",
    globals: true,
    /*browser: {
      enabled: true,
      name: "chromium",
      provider: "playwright",
      headless: true,
    },*/
    server: {},
  },
  define: {
    // Edited directly into phaser code
    "typeof WEBGL_DEBUG": false,
  },
});
