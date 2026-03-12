import { build } from "esbuild";
import { execSync } from "child_process";
import path from "path";

const rootDir = path.resolve(import.meta.dirname, "..");

console.log("Building frontend...");
execSync("npx vite build", { stdio: "inherit", cwd: rootDir });

console.log("Building server...");
await build({
  entryPoints: [path.join(rootDir, "server/index.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  outfile: path.join(rootDir, "dist/index.js"),
  packages: "external",
  alias: {
    "@shared": path.join(rootDir, "shared"),
  },
});

console.log("Build complete!");
