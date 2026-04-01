import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [react(), tailwindcss()],
	base: "/date-range-picker-cn/",
	build: {
		outDir: "dist",
		emptyOutDir: true,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (!id.includes("node_modules")) return;
					if (id.includes("react-day-picker")) return "day-picker";
					if (id.includes("lucide-react")) return "icons";
					if (id.includes("@base-ui") || id.includes("radix-ui")) return "ui";
					if (id.includes("/react/") || id.includes("/react-dom/"))
						return "react";
					return "vendor";
				},
			},
		},
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
	},
	test: {
		include: ["src/**/*.browser.test.{ts,tsx}"],
		browser: {
			enabled: true,
			provider: playwright(),
			instances: [{ browser: "chromium" }],
		},
	},
});
