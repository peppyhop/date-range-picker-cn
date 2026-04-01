import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  publicDir: false,
  build: {
    outDir: "dist/radix",
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/radix/index.ts"),
      formats: ["es", "umd"],
      name: "DateRangePickerCNRadix",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: (id) => {
        return (
          id === "react" || id === "react-dom" || id === "radix-ui" || id === "react-day-picker"
        );
      },
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-day-picker": "ReactDayPicker",
          "radix-ui": "RadixUI",
        },
      },
    },
  },
});
