import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// Custom plugin so manifest.json, sw.js, and PNG icons in the root folder are automatically copied into dist/ on Vercel build
function copyPwaAssetsPlugin() {
  return {
    name: "copy-pwa-assets",
    writeBundle() {
      const files = ["manifest.json", "sw.js", "icon-192.png", "icon-512.png", "icon.svg"];
      for (const f of files) {
        if (fs.existsSync(f)) {
          fs.copyFileSync(f, path.join("dist", f));
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyPwaAssetsPlugin()]
});
