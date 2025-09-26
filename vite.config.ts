import { defineConfig } from "vite";
import { resolve } from "path";
import { copy } from "fs-extra";

// Path to your FoundryVTT data folder
const FOUNDRY_DATA = process.env.FOUNDRY_DATA || "/Users/jarred/Library/Application Support/FoundryVTT/Data/";
const MODULE_ID = "dnd5e-better-item-properties";

export default defineConfig({
  build: {
    outDir: resolve(__dirname, "dist"),
    emptyOutDir: true,
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: MODULE_ID,
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "module.js",
      },
    },
  },
  plugins: [
    {
      name: "foundry-copy",
      async writeBundle() {
        const dest = resolve(FOUNDRY_DATA, "modules", MODULE_ID);
        await copy("dist", dest, { overwrite: true });
        await copy("public", dest, { overwrite: true });
        console.log(`✅ Copied build to Foundry modules/${MODULE_ID}`);
      },
    },
  ],
});
