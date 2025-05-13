import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Проксируем запросы к /api на продакшн Supabase Functions
      "/api": {
        target: "http://localhost:54321/functions/v1", // локальный Supabase Functions
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // удалить префикс /api
      },
      // Поддержка старого формата API-путей
      "/chat-api": {
        target: "https://xcheceveynzdugmgwrmi.supabase.co/functions/v1", 
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/chat-api/, ''),
        headers: {
          "X-Forwarded-For": "localhost",
        },
      },
      // Поддержка test-api путей
      "/test-api": {
        target: "https://xcheceveynzdugmgwrmi.supabase.co/functions/v1",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/test-api/, ''),
        headers: {
          "X-Forwarded-For": "localhost",
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
