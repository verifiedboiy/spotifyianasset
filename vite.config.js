import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        accounts: resolve(__dirname, 'accounts.html'),
        transfers: resolve(__dirname, 'transfers.html'),
      },
    },
  },
});
