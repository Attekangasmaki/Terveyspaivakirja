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
        frontpage: resolve(__dirname, 'src/pages/frontpage.html'),
        userfrontpage: resolve(__dirname, 'src/pages/userfrontpage.html'),
        entries: resolve(__dirname, 'src/pages/entries.html'),
        activities: resolve(__dirname, 'src/pages/activities.html'),
        healthmetrics: resolve(__dirname, 'src/pages/healthmetrics.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        register: resolve(__dirname, 'src/pages/register.html'),
      },
    },
  },
  base: './',
});
