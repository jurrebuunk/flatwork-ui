// Builds dist/styles/<theme>/ for every theme in ../../themes that has a
// tokens.json, using the same script as the Nix theme packages.
import { readdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const themes = join(root, "themes");
for (const name of readdirSync(themes)) {
  if (!existsSync(join(themes, name, "tokens.json"))) continue;
  execFileSync(process.execPath, [join(root, "scripts/build-theme-css.mjs"), join(themes, name), fileURLToPath(new URL(`../dist/styles/${name}`, import.meta.url))], { stdio: "inherit" });
}
