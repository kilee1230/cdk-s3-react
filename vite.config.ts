import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "vite-plugin-babel";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/jotai-todo/",
  plugins: [
    react(),
    babel({
      babelConfig: {
        presets: ["@babel/preset-react"],
        plugins: ["jotai/babel/plugin-debug-label"],
      },
    }),
  ],
});
