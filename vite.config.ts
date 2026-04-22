import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/movie/", // ← ВОТ ЭТО ГЛАВНОЕ! Говорит Vite, что сайт будет в подпапке /movie
});
