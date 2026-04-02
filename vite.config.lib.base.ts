import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  publicDir: false,
  build: {
    outDir: "dist/base",
    emptyOutDir: true,
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/base/index.ts"),
      formats: ["es", "umd"],
      name: "DateRangePickerCNBase",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: (id) => {
        return (
          id === "react" ||
          id === "react-dom" ||
          id === "@base-ui/react" ||
          id.startsWith("@base-ui/react") ||
          id === "react-day-picker"
        );
      },
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@base-ui/react/popover": "BaseUIPopover",
          "@base-ui/react/select": "BaseUISelect",
          "react-day-picker": "ReactDayPicker",
        },
      },
    },
  },
});
