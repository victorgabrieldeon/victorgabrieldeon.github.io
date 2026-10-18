#!/usr/bin/env node
// Regenerates data/github.js from the public GitHub API (+ the last-year contribution calendar).
// Usage: node scripts/sync-github.mjs [login]
// Auth (optional, avoids the 60 req/h limit): GITHUB_TOKEN env or `gh auth token`.
import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const LOGIN = process.argv[2] ?? "victorgabrieldeon";
const README_LIMIT = 24_000;
const OUT = fileURLToPath(new URL("../data/github.js", import.meta.url));
const AVATAR = fileURLToPath(new URL("../img/avatar.jpg", import.meta.url));

function token() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try {
    return execSync("gh auth token", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
  } catch {
    return "";
  }
}

const headers = { Accept: "application/vnd.github+json", "User-Agent": "portfolio-sync" };
const auth = token();
if (auth) headers.Authorization = `Bearer ${auth}`;

async function gh(path, { optional = false } = {}) {
  const res = await fetch(`https://api.github.com/${path}`, { headers });
  if (res.status === 404 && optional) return null;
  if (!res.ok) throw new Error(`GET ${path}: ${res.status} ${await res.text()}`);
  return res.json();
}

const user = await gh(`users/${LOGIN}`);
const repos = (await gh(`users/${LOGIN}/repos?per_page=100&type=owner`)).filter((r) => !r.fork && !r.private);

const entries = await Promise.all(
  repos.map(async (r) => {
    const [languages, readme] = await Promise.all([
      gh(`repos/${LOGIN}/${r.name}/languages`),
      gh(`repos/${LOGIN}/${r.name}/readme`, { optional: true }),
    ]);
    let text = readme ? Buffer.from(readme.content, "base64").toString("utf8") : "";
    if (text.length > README_LIMIT) text = `${text.slice(0, README_LIMIT)}\n\n…`;
    return {
      name: r.name,
      description: r.description ?? "",
      url: r.html_url,
      homepage: r.homepage || "",
      language: r.language ?? "",
      languages,
      topics: r.topics ?? [],
      stars: r.stargazers_count,
      forks: r.forks_count,
      created: r.created_at,
      pushed: r.pushed_at,
      readme: text,
    };
  }),
);

entries.sort((a, b) => b.pushed.localeCompare(a.pushed));

// Calendário de contribuições do último ano. A API do GitHub não expõe isso sem GraphQL autenticado;
// github-contributions-api lê a página pública do perfil (é a mesma fonte que o site consulta ao vivo).
async function contributions() {
  const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${LOGIN}?y=last`);
  if (!res.ok) throw new Error(`contributions: ${res.status} ${await res.text()}`);
  const { total, contributions: days } = await res.json();
  return {
    total: total.lastYear,
    start: days[0].date,
    counts: days.map((d) => d.count),
    levels: days.map((d) => d.level).join(""),
  };
}

const data = {
  syncedAt: new Date().toISOString(),
  user: {
    login: user.login,
    name: user.name,
    url: user.html_url,
    avatar: user.avatar_url,
    followers: user.followers,
    publicRepos: user.public_repos,
    created: user.created_at,
  },
  repos: entries,
  contributions: await contributions(),
};

writeFileSync(OUT, `// Gerado por scripts/sync-github.mjs — não editar à mão.\nwindow.GITHUB = ${JSON.stringify(data, null, 1)};\n`);
console.log(`data/github.js: ${entries.length} repos (${(JSON.stringify(data).length / 1024).toFixed(0)} KB)`);

// Avatar auto-hospedado (o site funciona offline a partir do snapshot).
const avatar = await fetch(`${user.avatar_url}${user.avatar_url.includes("?") ? "&" : "?"}s=256`);
if (!avatar.ok) throw new Error(`avatar: ${avatar.status}`);
writeFileSync(AVATAR, Buffer.from(await avatar.arrayBuffer()));
console.log("img/avatar.jpg atualizado");
