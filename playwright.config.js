import { defineConfig } from "@playwright/test";

export default defineConfig({
    testDir: "tests",
    timeout: 30_000,
    reporter: [["html", { open: "never" }]],
    use: {
        headless: true,
        screenshot: "only-on-failure",
        video: "retain-on-failure"
    },
});