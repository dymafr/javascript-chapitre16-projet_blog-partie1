import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "./src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        index: resolve(import.meta.dirname, "src/index.html"),
        form: resolve(import.meta.dirname, "src/form/form.html"),
      },
    },
  },
});
