# victorgabrieldeon.github.io

Portfólio de Victor Gabriel, engenheiro backend: <https://victorgabrieldeon.github.io/>

HTML, CSS e JavaScript sem framework e sem build. Os projetos vêm de um snapshot dos repositórios públicos do GitHub, atualizado ao vivo pela API quando ela responde.

## Rodar localmente

Qualquer servidor estático na raiz do repositório:

```bash
python3 -m http.server 4173
```

e abra <http://127.0.0.1:4173/>.

## Estrutura

| Caminho | O que é |
| --- | --- |
| `index.html` | Página única: home, `#/projetos` e `#/projeto/<nome>` |
| `css/` | Estilos e fontes (Geist, Geist Mono, Caveat, auto-hospedadas em `fonts/`) |
| `js/app.js` | Renderização, rotas, filtros, tema e atualização ao vivo |
| `js/catalog.js` | Curadoria: resumo, áreas e pilha de cada repo, stack, arquitetura, repos ocultos |
| `js/figures.js` | Diagramas monocromáticos de cada projeto e dos conceitos de arquitetura |
| `js/brands.js` | Ícones de marca (gerado) |
| `data/github.js` | Snapshot do GitHub (gerado) |

## Atualizar dados

```bash
node scripts/sync-github.mjs   # repos, READMEs, linguagens, contribuições e avatar
node scripts/sync-brands.mjs   # ícones do Simple Icons usados no site
```

`sync-github` usa `GITHUB_TOKEN` ou `gh auth token` quando disponível, para não esbarrar no limite da API.

## Deploy

O workflow `.github/workflows/pages.yml` publica no GitHub Pages a cada push na `main`, todo dia às 06:17 UTC (com o snapshot atualizado) e sob demanda. Só `index.html`, `css`, `js`, `fonts`, `img` e `data` vão para o site.
