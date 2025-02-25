// vite.config.js
import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // List your html files here, e.g:
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        api: resolve(__dirname, 'src/pages/apitest.html'),
        auth: resolve(__dirname, 'src/pages/authtest.html'),
      },
    },
  },
  base: './',
});
