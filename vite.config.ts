import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import mkcert from "vite-plugin-mkcert";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
      server: { https: true },
    },
    plugins: [
      react(),
      //  mkcert()
    ],
  };
});
