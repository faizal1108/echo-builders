import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const proxy = {
  "/api/soilgrids": {
    target: "https://rest.isric.org",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/soilgrids/, "/soilgrids/v2.0/properties/query"),
  },
  "/api/gemini": {
    target: "https://generativelanguage.googleapis.com",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/gemini/, ""),
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy,
  },
  preview: {
    proxy,
  },
});
