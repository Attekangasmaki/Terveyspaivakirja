// vite.config.js
import { userInfo } from 'os';
import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // List your html files here, e.g:
        main: resolve(__dirname, 'index.html'),
        frontpage: resolve(__dirname, 'src/pages/frontpage.html'),
        userfrontpage: resolve(__dirname, 'src/pages/userfrontpage.html'),
        userInfo: resolve(__dirname, 'src/pages/userinfo.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        register: resolve(__dirname, 'src/pages/register.html'),
      },
    },
  },
  base: './',
});
