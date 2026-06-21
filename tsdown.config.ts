import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm"],
  dts: {
    // enable sourcemap to jump to the original source code in IDE
    sourcemap: true,
  },
  // optimize for node.js environment
  platform: "node",
  // automatically export
  exports: true,

  // optimize building speed
  treeshake: true,
  outDir: "dist",
});
