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
    host: 'admin.dacsancamau.com',
    port: 3002, // Specify your desired port number
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'ssl/vite-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/vite-cert.pem')),
    },
    proxy: {
      "/api": {
        target: "https://dacsancamau.com/",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
