import { copyFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const src = resolve(root, "node_modules/@consenlabs/tcx-wasm/tcx_wasm_bg.wasm");
const dest = resolve(root, "public/tcx_wasm_bg.wasm");

if (!existsSync(resolve(root, "public"))) {
  mkdirSync(resolve(root, "public"), { recursive: true });
}

if (existsSync(src)) {
  copyFileSync(src, dest);
  console.log("[copy-wasm] Copied tcx_wasm_bg.wasm to public/");
} else {
  console.warn("[copy-wasm] Source WASM not found (skipping — run npm install first)");
}
