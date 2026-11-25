#!/usr/bin/env node
// Builds a web theme's stylesheets from its folder. Used by the Nix theme
// packages and by packages/react, so both ship byte-identical CSS.
//
//   node scripts/build-theme-css.mjs <theme-dir> <out-dir>
//
// Writes to <out-dir>:
//   tokens.css    --<prefix>-* variables on .fw (dark/light/system modes)
//   <name>.css    fonts + tokens + every component, @imports inlined
//   fonts/        the woff2 files the bundle references
//   tokens.json   a copy of the source tokens
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";

const [themeDir, outDir] = process.argv.slice(2).map((p) => p && resolve(p));
if (!themeDir || !outDir) {
  console.error("usage: build-theme-css.mjs <theme-dir> <out-dir>");
  process.exit(1);
}

const tokens = JSON.parse(readFileSync(join(themeDir, "tokens.json"), "utf8"));
const prefix = tokens.prefix ?? "fw";
const decls = (vars, indent = "  ") =>
  Object.entries(vars).map(([k, v]) => `${indent}--${prefix}-${k}: ${v};`).join("\n");

const modes = tokens.modes;
const fallback = tokens.defaultMode ?? Object.keys(modes)[0];
const shared = { ...tokens.font, ...tokens.radius, ...tokens.space, ...tokens.motion };

let tokensCss = `/* Generated from ${tokens.name}/tokens.json — do not edit. */\n`;
tokensCss += `.fw {\n${decls(shared)}\n  color-scheme: ${fallback};\n${decls(modes[fallback])}\n}\n`;
for (const [mode, vars] of Object.entries(modes)) {
  if (mode === fallback) continue;
  tokensCss += `.fw[data-theme="${mode}"] {\n  color-scheme: ${mode};\n${decls(vars)}\n}\n`;
}
if (modes.light && modes.dark) {
  const other = fallback === "dark" ? "light" : "dark";
  tokensCss += `@media (prefers-color-scheme: ${other}) {\n  .fw[data-theme="system"] {\n    color-scheme: ${other};\n${decls(modes[other], "    ")}\n  }\n}\n`;
}

const fontCss = (tokens.fontFaces ?? [])
  .map((f) => `@font-face { font-family: "${f.family}"; font-weight: ${f.weight}; font-style: normal; font-display: ${f.display ?? "swap"}; src: url("./${f.file}") format("woff2"); }`)
  .join("\n");

// Inline local @import "x.css" statements, recursively.
const inline = (file) =>
  readFileSync(file, "utf8").replace(/^@import\s+"([^"]+)";\s*$/gm, (_, rel) => inline(join(dirname(file), rel)));

const components = inline(join(themeDir, "components", "index.css"));

mkdirSync(join(outDir, "fonts"), { recursive: true });
for (const f of tokens.fontFaces ?? []) copyFileSync(join(themeDir, f.file), join(outDir, f.file));
writeFileSync(join(outDir, "tokens.css"), tokensCss);
writeFileSync(join(outDir, "tokens.json"), JSON.stringify(tokens, null, 2) + "\n");
writeFileSync(join(outDir, `${tokens.name}.css`), [fontCss, tokensCss, components].join("\n"));
console.log(`built ${tokens.name} -> ${outDir}`);
