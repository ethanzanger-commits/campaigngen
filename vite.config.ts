import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const root = import.meta.dirname;

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(root, "client", "src"),
      "@shared": path.resolve(root, "shared"),
    },
  },
  root: path.resolve(root, "client"),
  // Read VITE_* variables from the repo root .env files
  envDir: root,
  build: {
    outDir: path.resolve(root, "dist"),
    emptyOutDir: true,
  },
});
