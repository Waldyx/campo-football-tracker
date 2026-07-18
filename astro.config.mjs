import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // ⚠ DOMINIO CANÓNICO. De aquí salen los <link rel=canonical>, los og:url y el
  // sitemap. Si apunta a un dominio que no existe, Google no indexa el sitio.
  // (Estuvo en "https://campo.shoes" — marca antigua, dominio NO registrado.)
  // Cuando se compre el dominio definitivo, cambiar SOLO esta línea y desplegar.
  site: "https://campo-football-tracker.vercel.app",
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
