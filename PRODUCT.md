# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Delegated: static HTML/CSS/JS with no build step (same as the previous site), deployable on GitHub Pages or any static host. Project data is a committed snapshot of the public GitHub repos, refreshed at runtime from the public GitHub API when reachable.

## Users

Developers, recruiters and collaborators who land on Victor Gabriel's personal portfolio, usually from GitHub or a shared link, wanting to know in a minute what he builds and whether the work is real.

## Product Purpose

Personal portfolio of Victor Gabriel (GitHub `victorgabrieldeon`). Shows his public, non-fork GitHub projects and lets the visitor explore them interactively. Success: the visitor opens at least one project and leaves knowing his range (backend, realtime, desktop tools, dev tooling, Python libs).

## Positioning

Self-described "Backend Engineer — Systems · Performance · Observability" (GitHub profile README). The work spans realtime streaming (HypeMeet), monorepo platforms (FutHub, Dreamfut), desktop DB tooling (Nexo DB), editor/TUI plugins (Paseo, OpenCode) and Python libraries (flowcast, code-craft, fv-api, fastapi-RBAc).

## Capabilities and Constraints

- Language: PT-BR UI (repo READMEs are mostly PT-BR).
- Must list every public non-fork repo except `dreamfut` (hidden on request via `window.HIDDEN` in `js/catalog.js`): 17 today. Highlight HypeMeet, FutHub, Nexo DB, the Paseo/OpenCode plugins and the Python libs.
- Forks (`hive`, `gh-ai-pull-request`) are excluded. The Paseo plugins are developer tools, never games.
- Contact: GitHub only (github.com/victorgabrieldeon). No email or social links.
- Brand commitment: a single ruled column in the vibe of chanhdai.com (rails, full-bleed hairlines, hatched separators, monochrome, Geist + Geist Mono, handwritten margin notes). Projects live on their own page as cards, each with a monochrome diagram of what the project does; languages and tools are shown with monochrome brand icons. No colophon. Replaced the earlier two-column brittanychiang.com layout on request. No terminal, command palette, themed metaphors or easter eggs; the user rejected the earlier man-page/terminal version.
- Stack and architecture (home): the technologies and concepts are as stated by Victor (2026-10-18). A stack item links to projects only when the catalog stack, GitHub languages or a README prove the use; items without evidence show no project. Architecture concepts (design patterns, Clean Architecture, hexagonal, microservices, event-driven) carry generic diagrams and definitional copy, never claims about specific systems.

## Evidence on Hand

- Repo READMEs, languages, dates and stars from the GitHub API, plus the last-year contribution calendar (github-contributions-api.jogruber.de), snapshotted in `data/github.js` by `node scripts/sync-github.mjs`.
- No screenshots, testimonials, employers or metrics beyond GitHub stats. Do not invent any.

## Product Principles

- Every project claim comes from its README or GitHub metadata.
- Every project is one click away and has its own in-site page with the rendered README.
- Fast: no framework, no build, works offline from the snapshot.
