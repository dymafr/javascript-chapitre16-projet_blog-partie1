import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  root: fileURLToPath(new URL('./src', import.meta.url)),
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        index: fileURLToPath(new URL('./src/index.html', import.meta.url)),
        form: fileURLToPath(new URL('./src/form/form.html', import.meta.url)),
      },
    },
  },
});
