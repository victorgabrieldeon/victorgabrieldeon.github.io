#!/usr/bin/env node
// Regenerates js/brands.js: monochrome brand icons (Simple Icons, CC0) for languages and tools shown on the site.
// Usage: node scripts/sync-brands.mjs   (add a [pattern, slug] pair below for a new name, then rerun)
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../js/brands.js", import.meta.url));

// Nome exibido no site (linguagem do GitHub ou item de pilha do catálogo) -> slug do Simple Icons.
const MATCH = [
  ["^typescript", "typescript"],
  ["^python", "python"],
  ["^javascript$", "javascript"],
  ["^css$", "css"],
  ["^html$", "html5"],
  ["^hcl$", "hcl"],
  ["^starlark$", "bazel"],
  ["^plpgsql$", "postgresql"],
  ["^(dockerfile|docker)$", "docker"],
  ["^shell$", "gnubash"],
  ["^ruby$", "ruby"],
  ["^fastapi", "fastapi"],
  ["^nestjs", "nestjs"],
  ["^postgres", "postgresql"],
  ["^mongodb", "mongodb"],
  ["^redis", "redis"],
  ["^linux", "linux"],
  ["^cloudflare", "cloudflare"],
  ["^livekit", "livekit"],
  ["^react", "react"],
  ["^vite$", "vite"],
  ["^bun$", "bun"],
  ["^sqlite", "sqlite"],
  ["^tailwind", "tailwindcss"],
  ["^node", "nodedotjs"],
  ["^fastify", "fastify"],
  ["^discord\\.js", "discorddotjs"],
  ["^discord\\.py", "discord"],
  ["^drizzle", "drizzle"],
  ["^turborepo", "turborepo"],
  ["^electron", "electron"],
  ["^codemirror", "codemirror"],
  ["^(kubectl|kubernetes)", "kubernetes"],
  ["^pydantic", "pydantic"],
  ["^next\\.js", "nextdotjs"],
  ["^swagger", "swagger"],
  ["^axios", "axios"],
  ["^unity", "unity"],
  ["^roblox", "roblox"],
  ["^sqlalchemy", "sqlalchemy"],
  ["^jwt$", "jsonwebtokens"],
  ["^pytest", "pytest"],
  ["^ruff$", "ruff"],
  ["^pre-commit$", "precommit"],
  ["^gemini$", "googlegemini"],
  ["^s3$", "amazons3"],
  ["^(gcp|google cloud)$", "googlecloud"],
  ["^aws$", "amazonwebservices"],
  ["^rabbitmq", "rabbitmq"],
  ["^nats$", "natsdotio"],
  ["^temporal$", "temporal"],
  ["^claude", "claude"],
  ["^codex$", "openai"],
  ["^github actions$", "githubactions"],
];

const slugs = [...new Set(MATCH.map(([, s]) => s))];
const icons = {};
await Promise.all(
  slugs.map(async (slug) => {
    const res = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`);
    if (!res.ok) throw new Error(`${slug}: ${res.status}`);
    const svg = await res.text();
    const d = svg.match(/<path d="([^"]+)"/)?.[1];
    if (!d) throw new Error(`${slug}: sem <path>`);
    icons[slug] = d;
  }),
);

const sorted = Object.fromEntries(slugs.sort().map((s) => [s, icons[s]]));
writeFileSync(
  OUT,
  `// Gerado por scripts/sync-brands.mjs — não editar à mão. Ícones: Simple Icons (CC0), viewBox 0 0 24 24.
window.BRANDS = (() => {
  const paths = ${JSON.stringify(sorted, null, 1)};
  const match = ${JSON.stringify(MATCH)}.map(([p, s]) => [new RegExp(p, "i"), s]);
  /** Caminho do ícone para um nome exibido (linguagem ou ferramenta), ou "" quando não há ícone. */
  return (name) => {
    const hit = match.find(([re]) => re.test(String(name).trim()));
    return hit ? paths[hit[1]] : "";
  };
})();
`,
);
console.log(`js/brands.js: ${slugs.length} ícones`);
