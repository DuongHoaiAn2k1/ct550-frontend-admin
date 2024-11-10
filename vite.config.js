import { fileURLToPath, URL } from "node:url";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: 'admin.luanvantotnghiep.io.vn',
    port: 3002,
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/luanvantotnghiep.io.vn/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/luanvantotnghiep.io.vn/fullchain.pem'),
    },
    proxy: {
      "/api": {
        target: "https://luanvantotnghiep.io.vn:8443",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
