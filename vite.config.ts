import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/football-stats-api3/",

  build: {
    sourcemap: true,
  },
});
