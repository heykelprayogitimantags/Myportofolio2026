import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  site: process.env.PUBLIC_SITE_URL || "https://myportofolio2026-pi.vercel.app",
  adapter: vercel({
    includeFiles: ["./dist/**"],
  }),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});