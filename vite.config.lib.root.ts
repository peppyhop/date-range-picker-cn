import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [react()],
	build: {
		outDir: "dist",
		emptyOutDir: true,
		lib: {
			entry: resolve(__dirname, "src/index.ts"),
			formats: ["es", "umd"],
			name: "DateRangePickerCN",
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external: (id) => {
				return (
					id === "react" ||
					id === "react-dom" ||
					id === "radix-ui" ||
					id === "react-day-picker" ||
					id.startsWith("@base-ui/react")
				);
			},
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
					"@base-ui/react/popover": "BaseUIPopover",
					"@base-ui/react/select": "BaseUISelect",
					"react-day-picker": "ReactDayPicker",
					"radix-ui": "RadixUI",
				},
			},
		},
	},
});
