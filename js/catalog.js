// Curadoria por repo. Fatos vêm dos READMEs/metadados do GitHub (data/github.js).
// Sem README, a fonte é o manifesto do repo (package.json / pyproject.toml): openapicmd, fastapi_template, fastapi-service-auth.
// Repos novos sem entrada aqui aparecem como "Aplicativo" com a descrição do GitHub.

// Repos públicos que ficam fora do portfólio, a pedido (os forks já são excluídos pelo filtro de fork).
window.HIDDEN = ["dreamfut"];

// Stack e arquitetura: o que o Victor declara conhecer. Ícone vem de js/brands.js pelo nome; sem marca, `icon`
// (símbolo do sprite) ou `glyph` (monograma). `projects` só lista repos com evidência de uso (pilha do catálogo,
// linguagens do GitHub ou README); `lang` liga pelos bytes da linguagem. Sem evidência, o item fica sem projeto.
window.STACK = [
  {
    group: "Linguagens",
    items: [
      { name: "Python", lang: "Python" },
      { name: "TypeScript", lang: "TypeScript" },
    ],
  },
  {
    group: "Frameworks",
    items: [{ name: "FastAPI", projects: ["fastapi-RBAc", "fastapi-service-auth", "fastapi_template"] }, { name: "NestJS" }],
  },
  {
    group: "Dados e storage",
    items: [
      { name: "PostgreSQL", projects: ["futhub", "nexo-db"] },
      { name: "MongoDB" },
      { name: "Redis" },
      // futhub sobe MinIO (API S3) em s3.futhub.localhost
      { name: "S3", projects: ["futhub"] },
    ],
  },
  {
    group: "Infra e cloud",
    items: [
      { name: "Docker", projects: ["futhub", "hypemeet", "fastapi-RBAc", "fv-api", "bot-create-guild-template"] },
      // hypemeet: cloudflared tunnel no desenvolvimento
      { name: "Cloudflare", projects: ["hypemeet"] },
      { name: "GCP" },
      { name: "AWS" },
      // hypemeet: deploy próprio com Dokploy
      { name: "VPS", icon: "server", projects: ["hypemeet"] },
      { name: "Linux" },
    ],
  },
  { group: "Mensageria", items: [{ name: "RabbitMQ" }, { name: "NATS" }] },
  { group: "Workflows", items: [{ name: "Inngest", glyph: "I" }, { name: "Temporal" }] },
  {
    group: "IA no dia a dia",
    items: [
      { name: "Claude Code" },
      // opencode-devspace-manager traz integração MCP para o Codex Desktop
      { name: "Codex", projects: ["opencode-devspace-manager"] },
      { name: "omp", glyph: "omp" },
    ],
  },
  { group: "Apps", items: [{ name: "Paseo", glyph: "P", projects: ["paseo-devspace", "paseo-unity-workspace"] }] },
];

// Conceitos de arquitetura (sem marca): cada um tem um diagrama em js/figures.js (FIGURES.concept).
window.ARCH = [
  { id: "patterns", name: "Design patterns", text: "Soluções nomeadas para problemas recorrentes, usadas onde deixam o código mais simples de mudar." },
  { id: "clean", name: "Clean Architecture", text: "Regras de negócio no centro, sem depender de framework, banco ou interface. As dependências apontam para dentro." },
  { id: "hexagonal", name: "Arquitetura hexagonal", text: "O domínio expõe portas; HTTP, filas, banco e CLI entram como adaptadores trocáveis." },
  { id: "micro", name: "Microsserviços", text: "Serviços pequenos com dados próprios, deploy independente e contratos explícitos entre eles." },
  { id: "events", name: "Orientada a eventos", text: "Serviços publicam fatos num barramento e reagem a eles, sem chamada direta entre si." },
];

window.KINDS = {
  app: "Aplicativo",
  lib: "Biblioteca",
  dist: "Distribuição",
  tool: "Ferramenta",
  service: "Serviço",
  profile: "Perfil",
};

window.AREAS = [
  { id: "backend", label: "Backend" },
  { id: "realtime", label: "Tempo real" },
  { id: "desktop", label: "Desktop" },
  { id: "tooling", label: "Ferramentas de dev" },
  { id: "python", label: "Python" },
  { id: "games", label: "Jogos" },
];

window.CATALOG = {
  hypemeet: {
    kind: "app",
    featured: 1,
    areas: ["realtime", "backend", "desktop"],
    summary: "Salas para transmitir várias telas e câmera com áudio, sem conta.",
    run: "bun run livekit && bun run dev",
    stack: ["LiveKit (SFU)", "React 19", "Vite", "Bun", "SQLite", "Tailwind v4"],
    highlights: [
      "Várias telas por pessoa, cada uma com o próprio áudio; volume de 0 a 200% por stream, só para você.",
      "Modo por tela: Jogo (60 fps, 6 Mbps) ou Nitidez (30 fps, 4 Mbps), trocado ao vivo sem reabrir o seletor.",
      "Desenho por cima da tela de quem transmite via data channel do LiveKit (tópico ink).",
      "Assistir junto sincronizado, chat sem servidor e Atividade do Discord.",
    ],
    related: ["hypemeet-releases"],
  },
  futhub: {
    kind: "app",
    featured: 2,
    areas: ["backend", "games"],
    summary: "Plataforma de futebol para criar times e disputar ligas.",
    run: "pnpm dev:tilt",
    stack: ["Node 22", "TypeScript strict", "Fastify", "React", "Discord.js", "PostgreSQL", "Drizzle", "Turborepo", "Tilt"],
    highlights: [
      "Monorepo com API HTTP, painel administrativo e bot do Discord.",
      "Ambiente local inteiro em Tilt: Postgres, migrations, API em watch, MinIO e Caddy só em loopback.",
      "Imagens de times, coleções e packs viram emojis da aplicação no Discord, sincronizados pela API.",
    ],
    docs: "https://victorgabrieldeon.github.io/futhub/",
  },
  "nexo-db": {
    kind: "app",
    featured: 3,
    areas: ["desktop"],
    summary: "Cliente PostgreSQL desktop, mais leve que o DBeaver.",
    run: "npm run install:linux",
    stack: ["Electron", "React", "CodeMirror 6", "zustand", "Tailwind v4"],
    highlights: [
      "Autocomplete por contexto: tabelas depois de FROM/JOIN, alias.coluna, funções do banco.",
      "Navegação por chave estrangeira: abre o registro referenciado ou lista quem aponta para ele.",
      "Uma conexão por aba: BEGIN, SET e tabelas temporárias funcionam; Commit/Rollback aparecem sozinhos.",
      "Senha cifrada pelo chaveiro do SO (safeStorage); valores chegam do Postgres como texto cru.",
    ],
  },
  "opencode-devspace-manager": {
    kind: "tool",
    featured: 4,
    areas: ["tooling", "backend"],
    summary: "Painel de DevSpace e Kubernetes dentro da TUI do OpenCode V2.",
    run: "/devspace",
    where: "na TUI do OpenCode",
    stack: ["TypeScript", "OpenCode TUI", "kubectl", "DevSpace"],
    related: ["paseo-devspace"],
  },
  flowcast: {
    kind: "lib",
    featured: 5,
    areas: ["python"],
    summary: "Pipelines declarativos de transformação pós-extração para scraping.",
    run: "pip install flowcast",
    stack: ["Python", "Pydantic (opcional)"],
    example: {
      lang: "python",
      code: `model = TransformingModel({
    "price": [
        transform(
            key="price_raw",
            transformer=NumberTransformer.parse_float(locale="pt_BR"),
        )
    ],
}).after(delete=["price_raw"])

Transformer({"price_raw": "R$ 1.299,90"}).transform(model)
# {"price": 1299.9}`,
    },
  },
  openapicmd: {
    kind: "tool",
    areas: ["tooling"],
    summary: "TUI para navegar e executar specs OpenAPI/Swagger.",
    run: "openapi",
    stack: ["Ink", "React", "swagger-parser", "axios"],
  },
  "code-craft": {
    kind: "lib",
    areas: ["python", "tooling"],
    summary: "Geração de código Python com context managers.",
    run: "pip install pycodecraft",
    stack: ["Python 3.8+", "Black (opcional)"],
  },
  "fv-api": {
    kind: "lib",
    areas: ["python", "backend"],
    summary: "SDK Python síncrono e assíncrono da API Fv (pacote futverse).",
    run: "pip install futverse",
    stack: ["httpx", "Stainless"],
  },
  "hypemeet-releases": {
    kind: "dist",
    areas: ["desktop"],
    summary: "Instaladores do HypeMeet para Windows, macOS e Linux.",
    related: ["hypemeet"],
  },
  victorgabrieldeon: {
    kind: "profile",
    areas: [],
    summary: "README do perfil no GitHub.",
    readmeNote: "O README do perfil é feito de imagens: banner, ícones da pilha e estatísticas. Veja no GitHub.",
  },
  "victorgabrieldeon.github.io": {
    kind: "app",
    areas: [],
    summary: "Este portfólio: HTML, CSS e JavaScript sem framework nem build, no GitHub Pages.",
    run: "python3 -m http.server 4173",
    stack: ["HTML", "CSS", "JavaScript", "GitHub Actions"],
    // o homepage do repo é o próprio site; não vira botão de documentação
    docs: "",
  },
  "paseo-unity-workspace": {
    kind: "tool",
    areas: ["tooling"],
    summary: "Painel Unity para o Paseo: projetos, builds, cenas e clones.",
    run: "/unity-play [jogadores]",
    where: "no Paseo",
    stack: ["TypeScript", "Unity batch mode", "ParrelSync"],
  },
  "paseo-devspace": {
    kind: "tool",
    areas: ["tooling"],
    summary: "Plugin do Paseo para iniciar, parar e acompanhar sessões DevSpace.",
    run: "paseo plugin install github:victorgabrieldeon/paseo-devspace",
    stack: ["TypeScript", "Bun"],
    related: ["opencode-devspace-manager"],
  },
  "typescript-lua-template": {
    kind: "tool",
    areas: ["games", "tooling"],
    summary: "Template Roblox em TypeScript compilado para Lua.",
    run: "npm run watch && rojo serve",
    stack: ["roblox-ts", "Rojo"],
  },
  "fastapi-RBAc": {
    kind: "service",
    areas: ["backend", "python"],
    summary: "API FastAPI com controle de acesso por roles e grupos.",
    run: "pdm start",
    stack: ["FastAPI", "SQLAlchemy 2.0", "JWT", "bcrypt", "Docker"],
  },
  "fastapi-service-auth": {
    kind: "service",
    areas: ["backend", "python"],
    summary: "Serviço de autenticação em FastAPI.",
    run: "pdm install",
    stack: ["FastAPI", "Pydantic", "pytest-asyncio", "commitizen"],
  },
  fastapi_template: {
    kind: "service",
    areas: ["backend", "python"],
    summary: "Template FastAPI com SQLModel e pydantic-settings.",
    run: "pdm install",
    stack: ["FastAPI", "SQLModel", "ruff", "pre-commit", "commitizen"],
  },
  "bot-create-guild-template": {
    kind: "service",
    areas: ["python", "backend"],
    summary: "Bot do Discord que monta um servidor inteiro a partir de um tema, com IA.",
    run: "/criar servidor",
    where: "no Discord",
    stack: ["discord.py", "pydantic-ai", "Gemini"],
  },
};
