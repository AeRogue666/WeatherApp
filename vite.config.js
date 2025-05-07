import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({include: [/\.vue$/]}),
  ],
  resolve: {alias: {'@': fileURLToPath(new URL('./src', import.meta.url))}},
  server: 5174,
  base: '/weatherapp',
})