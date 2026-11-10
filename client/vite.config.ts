import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The browser calls relative /api/...; Vite forwards it to the Nest server.
const proxy = { "/api": process.env.SERVER_URL || "http://localhost:3001" };

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    // Folders named _lib inside routes/ hold a route's api and components, not routes.
    tanstackStart({ router: { routeFileIgnorePattern: "^_lib$" } }),
    viteReact(),
  ],
  server: { port: 3000, proxy },
  preview: { port: 3000, host: true, proxy },
});

export default config;
