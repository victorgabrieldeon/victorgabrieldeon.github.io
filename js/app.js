// Portfólio: home (#/), página de projetos em cards (#/projetos) e página de cada projeto (#/projeto/<nome>).
(() => {
  const G = window.GITHUB;
  const CAT = window.CATALOG;
  const KINDS = window.KINDS;
  const AREAS = window.AREAS;
  const STACK = window.STACK;
  const STACK_ITEMS = STACK.flatMap((g) => g.items);
  const ARCH = window.ARCH;
  const HIDDEN = new Set(window.HIDDEN.map((n) => n.toLowerCase()));
  const BRAND = window.BRANDS;
  const FIGURE = window.FIGURES;
  const { esc, render: renderMd } = window.Markdown;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const root = document.documentElement;
  const DAY = 864e5;
  const TITLE = document.title;
  const INTRO_MS = 2800;

  const VIEWS = { home: $("#home"), projects: $("#projects"), project: $("#project") };
  const projectBody = $("#project-body");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

  const KIND_ICON = { app: "app", lib: "package", dist: "download", tool: "wrench", service: "server", profile: "user" };

  /** @type {any[]} */
  let repos = [];
  let area = "all";
  /** item da stack que filtra a página de projetos (#/projetos?tec=<slug>), ou null */
  let tech = null;
  let booted = false;
  let view = "home";
  /** visão de onde se chegou na atual (null em carga direta): decide se "voltar" usa o histórico */
  let cameFrom = null;
  const scrollMem = { home: 0, projects: 0 };
  /** @type {any} */
  let current = null;
  /** link de projeto clicado por último: origem da transição do nome */
  let pending = null;
  /** destaques abertos (o primeiro começa aberto) */
  const openFeatured = new Set();
  let contrib = G.contributions ?? null;

  // ── dados ────────────────────────────────────────────────────────────────
  function merge(list) {
    repos = list
      .filter((r) => !HIDDEN.has(r.name.toLowerCase()))
      .map((r) => {
        const c = CAT[r.name] ?? {};
        const kind = c.kind ?? "app";
        return {
          ...r,
          kind,
          kindLabel: KINDS[kind],
          featured: c.featured ?? 0,
          areas: c.areas ?? [],
          summary: c.summary ?? (r.description || "Sem descrição."),
          run: c.run ?? "",
          stack: c.stack ?? [],
          highlights: c.highlights ?? [],
          example: c.example,
          where: c.where ?? "",
          readmeNote: c.readmeNote ?? "",
          related: c.related ?? [],
          docs: c.docs ?? (r.homepage && !/^https?:\/\/(www\.)?github\.com\//.test(r.homepage) ? r.homepage : ""),
        };
      });
  }

  const find = (name) => repos.find((r) => r.name.toLowerCase() === String(name).toLowerCase());
  const byPushed = (a, b) => b.pushed.localeCompare(a.pushed);
  const featuredList = () => repos.filter((r) => r.featured).sort((a, b) => a.featured - b.featured);
  const ordered = () => [...featuredList(), ...repos.filter((r) => !r.featured).sort(byPushed)];
  const ageDays = (iso) => Math.max(0, Math.floor((Date.now() - Date.parse(iso)) / DAY));
  function ago(iso) {
    const d = ageDays(iso);
    if (d === 0) return "hoje";
    if (d === 1) return "ontem";
    if (d < 30) return `há ${d} dias`;
    if (d < 365) {
      const m = Math.round(d / 30);
      return m === 1 ? "há 1 mês" : `há ${m} meses`;
    }
    const y = Math.floor(d / 365);
    return y === 1 ? "há 1 ano" : `há ${y} anos`;
  }
  const fmtDate = (iso) => new Date(iso).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
  const fmtShort = (d) => d.toLocaleDateString("pt-BR", { day: "numeric", month: "short", year: "numeric" });
  const monthYear = (iso) => {
    const d = new Date(iso);
    return `${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
  };
  const fmtInt = (n) => n.toLocaleString("pt-BR");
  const href = (r) => `#/projeto/${encodeURIComponent(r.name)}`;
  const icon = (id, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="#i-${id}" /></svg>`;
  /** ícone de marca monocromático (linguagem ou ferramenta), ou "" quando não há */
  const brand = (name, cls = "bico") => {
    const d = BRAND(name);
    return d ? `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" /></svg>` : "";
  };
  const pct = (p) => (p * 100 < 0.1 ? "<0,1%" : `${(p * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`);
  const plural = (n, one, many) => `${fmtInt(n)} ${n === 1 ? one : many}`;
  const isNew = (r) => ageDays(r.pushed) <= 7;
  const fresh = (r) => (ageDays(r.pushed) <= 30 ? "fresh" : "");
  const kindBox = (r, cls = "ibox") =>
    `<span class="${cls}">${icon(KIND_ICON[r.kind] ?? "app")}${isNew(r) ? '<span class="new-dot" aria-hidden="true"></span>' : ""}</span>`;
  const tags = (list, label = "Pilha") =>
    list.length ? `<ul class="tags" aria-label="${label}">${list.map((s) => `<li>${brand(s)}${esc(s)}</li>`).join("")}</ul>` : "";
  const bullets = (list) => (list.length ? `<ul class="bullets">${list.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : "");
  const figNumber = (r) => ordered().indexOf(r) + 1;
  const slug = (s) =>
    s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  const techBySlug = (s) => STACK_ITEMS.find((i) => slug(i.name) === s) ?? null;
  /** repos que comprovam o uso de um item da stack: bytes da linguagem ou lista curada no catálogo */
  const techRepos = (item) => {
    if (item.lang) return ordered().filter((r) => (r.languages[item.lang] ?? 0) > 0);
    const names = new Set((item.projects ?? []).map((n) => n.toLowerCase()));
    return ordered().filter((r) => names.has(r.name.toLowerCase()));
  };

  function shares(languages) {
    const total = Object.values(languages).reduce((a, b) => a + b, 0);
    return Object.entries(languages)
      .sort((a, b) => b[1] - a[1])
      .map(([name, bytes]) => [name, total ? bytes / total : 0]);
  }
  function languageTotals() {
    const totals = {};
    for (const r of repos) for (const [k, v] of Object.entries(r.languages)) totals[k] = (totals[k] ?? 0) + v;
    return totals;
  }
  const mainLang = (r) => shares(r.languages)[0]?.[0] ?? r.language;

  /** linhas de linguagem: ícone, nome, barra proporcional e porcentagem, tudo em tinta */
  const langRows = (entries, id = "") =>
    `<ul class="lang-rows"${id ? ` id="${id}"` : ""}>${entries
      .map(
        ([name, share]) =>
          `<li><span class="lang-ico">${brand(name) || icon("code")}</span><span class="lang-name">${esc(name)}</span><span class="lang-track" aria-hidden="true"><span style="--p:${share.toFixed(4)}"></span></span><span class="lang-pct">${pct(share)}</span></li>`,
      )
      .join("")}</ul>`;

  // ── home: resumo ────────────────────────────────────────────────────────
  function renderInfo() {
    const top = shares(languageTotals())
      .slice(0, 2)
      .map(([n]) => n);
    const latest = [...repos].sort(byPushed)[0];
    $("#info-repos").textContent = plural(repos.length, "projeto público", "projetos públicos");
    $("#info-langs").textContent = top.length ? `Principalmente ${top.join(" e ")}` : "";
    $("#info-since").textContent = `No GitHub desde ${new Date(G.user.created).toLocaleDateString("pt-BR", { month: "short", year: "numeric" })}`;
    $("#info-push").innerHTML = latest
      ? `Último push ${ago(latest.pushed)} em <a href="${href(latest)}"><span class="nm">${esc(latest.name)}</span></a>`
      : "";
    $("#followers").textContent = G.user.followers ? plural(G.user.followers, "seguidor", "seguidores") : "";
    $("#all-count").textContent = `(${repos.length})`;
    $("#more-count").textContent = `(${repos.length})`;
    const h = new Date().getHours();
    $("#greet").textContent = h >= 5 && h < 12 ? "Bom dia" : h >= 12 && h < 18 ? "Boa tarde" : "Boa noite";
  }

  // ── home: stack agrupada e arquitetura ──────────────────────────────────
  const techGlyph = (item) =>
    brand(item.name) || (item.icon ? icon(item.icon) : `<span class="mono-glyph">${esc(item.glyph ?? item.name[0])}</span>`);

  /** bloco da stack; com projetos que o comprovam, vira link (um projeto: a página dele; vários: a lista filtrada) */
  function techTile(item) {
    const used = techRepos(item);
    const body = `<span class="tech-ico">${techGlyph(item)}</span><span class="tech-name">${esc(item.name)}</span>`;
    if (!used.length) return `<li><span class="tech">${body}</span></li>`;
    const one = used.length === 1;
    const to = one ? href(used[0]) : `#/projetos?tec=${slug(item.name)}`;
    const label = one ? `em ${esc(used[0].name)}` : `em ${used.length} projetos`;
    return `<li><a class="tech is-link" href="${to}" title="${esc(used.map((r) => r.name).join(", "))}">${body}<span class="tech-meta"><span class="tech-where">${label}</span>${icon("arrow")}</span></a></li>`;
  }

  function renderStack() {
    $("#stack-count").textContent = `(${STACK_ITEMS.length})`;
    $("#stack-groups").innerHTML = STACK.map(
      ({ group, items }) =>
        `<div class="stack-row"><h3 class="stack-group">${esc(group)}<span>${items.length}</span></h3><ul class="tech-grid">${items.map(techTile).join("")}</ul></div>`,
    ).join("");
  }

  function renderArch() {
    // Fig. 1 é a capa e Fig. 2 o calendário; os diagramas seguem a numeração da home
    const cells = ARCH.map(
      (a, i) =>
        `<li class="arch-cell"><span class="card-fig">${FIGURE.concept(a.id)}<span class="card-cap" aria-hidden="true">Fig. ${i + 3}</span></span><h3 class="arch-name">${esc(a.name)}</h3><p class="arch-text">${esc(a.text)}</p></li>`,
    );
    while (cells.length % 2) cells.push('<li class="arch-fill" aria-hidden="true"></li>');
    $("#arch-grid").innerHTML = cells.join("");
  }

  // ── home: calendário de contribuições ───────────────────────────────────
  const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  let calStart = new Date();

  function renderCalendar(c) {
    const panel = $(".contrib");
    if (!c?.counts?.length) {
      panel.hidden = true;
      return;
    }
    panel.hidden = false;
    const [y, m, d] = c.start.split("-").map(Number);
    const start = new Date(y, m - 1, d);
    calStart = start;
    const days = c.counts.length;
    const offset = start.getDay(); // semanas começam no domingo, como no GitHub
    const weeks = Math.ceil((offset + days) / 7);
    const cells = [];
    for (let k = 0; k < offset; k++) cells.push('<i class="pad"></i>');
    for (let k = 0; k < days; k++) cells.push(`<i data-l="${c.levels[k] ?? 0}" data-k="${k}" style="--w:${Math.floor((offset + k) / 7)}"></i>`);

    // rótulo do mês na primeira coluna em que ele aparece no topo; a primeira coluna só ganha rótulo se couber
    const labels = [];
    let last = -1;
    for (let w = 0; w < weeks; w++) {
      const first = addDays(start, Math.max(0, w * 7 - offset));
      if (first.getMonth() === last) continue;
      last = first.getMonth();
      labels.push({ w, text: first.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "") });
    }
    if (labels.length > 1 && labels[1].w - labels[0].w < 3) labels.shift();

    const cal = $("#cal");
    cal.style.setProperty("--weeks", String(weeks));
    cal.setAttribute("role", "img");
    cal.setAttribute("aria-label", `Calendário de contribuições no GitHub: ${plural(c.total, "contribuição", "contribuições")} no último ano.`);
    cal.innerHTML =
      `<div class="cal-months" aria-hidden="true">${labels.map((l) => `<span style="grid-column:${l.w + 1}">${l.text}</span>`).join("")}</div>` +
      `<div class="cal-days" aria-hidden="true">${cells.join("")}</div>`;
    const end = addDays(start, days - 1);
    $("#contrib-text").innerHTML = `${plural(c.total, "contribuição", "contribuições")} de ${fmtShort(start)} a ${fmtShort(end)}. Fonte: <a href="https://github.com/${esc(G.user.login)}" target="_blank" rel="noopener">GitHub</a>.`;
    // em telas estreitas o calendário rola: começa mostrando as semanas mais recentes
    const scroller = $("#cal-scroll");
    scroller.scrollLeft = scroller.scrollWidth;
  }

  const tip = $("#cal-tip");
  const hideTip = () => (tip.hidden = true);
  $("#cal").addEventListener("pointerover", (e) => {
    const cell = e.target.closest("i[data-k]");
    if (!cell || !contrib) return hideTip();
    const k = Number(cell.dataset.k);
    const n = contrib.counts[k];
    const when = addDays(calStart, k).toLocaleDateString("pt-BR", { day: "numeric", month: "short" });
    tip.textContent = `${n ? plural(n, "contribuição", "contribuições") : "Nenhuma contribuição"} em ${when}`;
    tip.hidden = false;
    const panel = $(".contrib").getBoundingClientRect();
    const b = cell.getBoundingClientRect();
    const half = tip.offsetWidth / 2;
    const x = Math.min(Math.max(b.left + b.width / 2 - panel.left, half + 4), panel.width - half - 4);
    tip.style.left = `${x}px`;
    tip.style.top = `${b.top - panel.top}px`;
  });
  $("#cal").addEventListener("pointerleave", hideTip);
  $("#cal-scroll").addEventListener("scroll", hideTip, { passive: true });

  // ── home: destaques ─────────────────────────────────────────────────────
  function renderFeatured() {
    const list = featuredList();
    if (!booted && list[0]) openFeatured.add(list[0].name);
    $("#featured-count").textContent = `(${list.length})`;
    $("#featured").innerHTML = list
      .map((r) => {
        const open = openFeatured.has(r.name);
        const id = `feat-${r.name.replace(/[^\w-]/g, "")}`;
        return `<li class="feat-item${open ? " open" : ""}" data-repo="${esc(r.name)}">
          <div class="feat-row">
            ${kindBox(r)}
            <div>
              <h3 class="feat-title"><a href="${href(r)}"><span class="nm">${esc(r.name)}</span></a></h3>
              <p class="meta"><span>${esc(r.kindLabel)}</span><span class="m-date" title="Criado em ${fmtDate(r.created)}">${monthYear(r.created)}</span><span class="${fresh(r)}" title="Último push em ${fmtDate(r.pushed)}">atualizado ${ago(r.pushed)}</span></p>
            </div>
            <div class="feat-act">
              <a class="icon-btn" href="${esc(r.url)}" target="_blank" rel="noopener" aria-label="${esc(r.name)} no GitHub" title="Abrir no GitHub">${icon("github")}</a>
              <button type="button" class="icon-btn feat-toggle" aria-expanded="${open}" aria-controls="${id}" aria-label="Detalhes de ${esc(r.name)}">${icon("chevron")}</button>
            </div>
          </div>
          <div class="feat-body" id="${id}"${open ? "" : " inert"}>
            <div class="feat-inner"><div class="feat-content">
              <p class="feat-sum">${esc(r.summary)}</p>
              ${bullets(r.highlights)}
              ${tags(r.stack)}
              <a class="more" href="${href(r)}">Abrir projeto${icon("arrow")}</a>
            </div></div>
          </div>
        </li>`;
      })
      .join("");
  }

  $("#featured").addEventListener("click", (e) => {
    const btn = e.target.closest(".feat-toggle");
    if (!btn) return;
    const item = btn.closest(".feat-item");
    const open = !item.classList.contains("open");
    item.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    $(".feat-body", item).inert = !open;
    if (open) openFeatured.add(item.dataset.repo);
    else openFeatured.delete(item.dataset.repo);
  });

  function renderLanguages() {
    const all = shares(languageTotals());
    const top = all.slice(0, 7);
    const rest = all.slice(7).reduce((a, [, p]) => a + p, 0);
    if (rest) top.push([`Outras (${all.length - 7})`, rest]);
    $("#lang-note").textContent = `Bytes de código por linguagem, somados nos ${repos.length} projetos segundo o GitHub.`;
    $("#lang-rows").outerHTML = langRows(top, "lang-rows");
  }

  // ── página de projetos: cards com figura ────────────────────────────────
  const card = (r) => {
    const main = mainLang(r);
    return `<li class="card-cell" data-repo="${esc(r.name)}"><a class="card" href="${href(r)}">
      <span class="card-fig">${FIGURE(r)}<span class="card-cap" aria-hidden="true">Fig. ${figNumber(r)}</span></span>
      <span class="card-body">
        <span class="card-title"><span class="nm">${esc(r.name)}</span>${isNew(r) ? '<span class="dot-new" title="Push nos últimos 7 dias"></span>' : ""}${icon("arrow", "icon card-arrow")}</span>
        <span class="card-sum">${esc(r.summary)}</span>
        <span class="meta"><span>${esc(r.kindLabel)}</span>${main ? `<span class="lang">${brand(main)}${esc(main)}</span>` : ""}<span class="${fresh(r)}" title="Último push em ${fmtDate(r.pushed)}">${ago(r.pushed)}</span></span>
      </span>
    </a></li>`;
  };

  function renderFilters() {
    const chips = [{ id: "all", label: "Todos", n: repos.length }]
      .concat(AREAS.map((a) => ({ ...a, n: repos.filter((r) => r.areas.includes(a.id)).length })))
      .filter((c) => c.n > 0);
    if (!chips.some((c) => c.id === area)) area = "all";
    $("#filters").innerHTML =
      '<span class="chip-pill no-anim" aria-hidden="true"></span>' +
      chips
        .map(
          (c) =>
            `<button type="button" class="chip" data-area="${c.id}" aria-pressed="${c.id === area}">${esc(c.label)}<span class="chip-count">${c.n}</span></button>`,
        )
        .join("");
    placePill(false);
  }

  function placePill(animate) {
    const pill = $(".chip-pill");
    const chip = $('.chip[aria-pressed="true"]');
    if (!pill || !chip || VIEWS.projects.hidden) return;
    pill.classList.toggle("no-anim", !animate || reduce.matches);
    // offset* ignora o scale do :active; o arredondamento pode passar 1px da caixa, daí o clamp
    const right = Math.max(0, pill.offsetWidth - chip.offsetLeft - chip.offsetWidth);
    const bottom = Math.max(0, pill.offsetHeight - chip.offsetTop - chip.offsetHeight);
    pill.style.clipPath = `inset(${chip.offsetTop}px ${right}px ${bottom}px ${chip.offsetLeft}px round 8px)`;
  }

  function renderCards() {
    const used = tech ? new Set(techRepos(tech)) : null;
    const list = repos.filter((r) => (area === "all" || r.areas.includes(area)) && (!used || used.has(r)));
    const sorted = area === "all" && !used ? ordered() : list.sort(byPushed);
    const label = AREAS.find((a) => a.id === area)?.label;
    const status = $("#filter-status");
    if (used) status.innerHTML = `${plural(list.length, "projeto", "projetos")} com ${esc(tech.name)}, do mais recente ao mais antigo. <a href="#/projetos">Ver todos</a>`;
    else
      status.textContent = label
        ? `${list.length} de ${repos.length} em ${label}, do mais recente ao mais antigo.`
        : `${plural(repos.length, "projeto", "projetos")}: destaques primeiro, depois do mais recente ao mais antigo.`;
    $("#cards").innerHTML = sorted.map(card).join("");
  }

  // FLIP: cards que continuam deslizam até a nova posição, os que chegam sobem suaves
  function flipCards(update) {
    const keyed = () => $$("[data-repo]", $("#cards"));
    const box = (el) => el.getBoundingClientRect();
    const before = new Map(keyed().map((el) => [el.dataset.repo, box(el)]));
    const tail = [$("#projects > .sep:last-child"), $(".site-foot"), $(".wordmark")];
    const tailBefore = tail.map((el) => box(el).top);
    update();
    const move = !reduce.matches;
    let n = 0;
    for (const el of keyed()) {
      const now = box(el);
      const was = before.get(el.dataset.repo);
      if (!was) {
        el.animate([{ opacity: 0, transform: move ? "translateY(12px)" : "none" }, { opacity: 1, transform: "none" }], {
          duration: 450,
          delay: Math.min(n++, 8) * 40,
          easing: EASE,
          fill: "backwards",
        });
      } else if (move && (was.top !== now.top || was.left !== now.left)) {
        el.animate([{ transform: `translate(${was.left - now.left}px, ${was.top - now.top}px)` }, { transform: "none" }], { duration: 550, easing: EASE });
      }
    }
    if (!move) return;
    tail.forEach((el, i) => {
      const dy = tailBefore[i] - box(el).top;
      if (dy) el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], { duration: 550, easing: EASE });
    });
  }

  $("#filters").addEventListener("click", (e) => {
    const chip = e.target.closest("[data-area]");
    if (!chip || (chip.dataset.area === area && !tech)) return;
    area = chip.dataset.area;
    // escolher uma área desfaz o filtro de tecnologia vindo da stack
    if (tech) {
      tech = null;
      history.replaceState(null, "", "#/projetos");
    }
    for (const c of $$(".chip")) c.setAttribute("aria-pressed", String(c === chip));
    placePill(true);
    flipCards(renderCards);
  });
  new ResizeObserver(() => placePill(false)).observe($("#filters"));
  document.fonts?.ready.then(() => placePill(false));

  /** aplica o filtro de tecnologia da página de projetos; vindo da stack, a área volta para "Todos" */
  function setTech(next) {
    tech = next ?? null;
    if (tech && area !== "all") {
      area = "all";
      renderFilters();
    }
    renderCards();
  }

  function renderAll() {
    renderInfo();
    renderStack();
    renderFeatured();
    renderLanguages();
    renderFilters();
    renderCards();
  }

  // seção ativa no cabeçalho: na home, a última cujo topo passou de 35% da tela; fora dela, a rota atual
  const navLinks = $$("[data-nav]");
  const navTargets = navLinks.map((a) => document.getElementById(a.dataset.nav));
  const routeLinks = $$("[data-route]");
  let navFrame = 0;
  function syncNav() {
    navFrame = 0;
    for (const a of routeLinks) a.setAttribute("aria-current", String(view === a.dataset.route || (view === "project" && a.dataset.route === "projetos")));
    if (view !== "home") {
      navLinks.forEach((a) => a.setAttribute("aria-current", "false"));
      return;
    }
    const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    let active = -1;
    navTargets.forEach((el, i) => {
      if (el.getBoundingClientRect().top <= window.innerHeight * 0.35) active = i;
    });
    if (atEnd) active = navTargets.length - 1;
    navLinks.forEach((a, i) => a.setAttribute("aria-current", String(i === active)));
  }
  window.addEventListener("scroll", () => (navFrame ||= requestAnimationFrame(syncNav)), { passive: true });
  window.addEventListener("resize", syncNav);

  // ── página do projeto ───────────────────────────────────────────────────
  const codeBlock = (code, label, lang = "") =>
    `<div class="code-block"><pre class="code"${lang ? ` data-lang="${esc(lang)}"` : ""}><code>${esc(code)}</code></pre><button type="button" class="icon-btn copy" data-copy="${esc(code)}" aria-label="${label}">${icon("copy", "icon i-idle")}${icon("check", "icon i-done")}</button></div>`;
  const section = (title, body) => `<section class="panel"><div class="panel-head sm"><h2>${title}</h2></div>${body}</section>`;
  const SEP = '<div class="sep" aria-hidden="true"></div>';

  function renderProject(r) {
    const langs = shares(r.languages);
    const main = langs[0]?.[0] ?? r.language;
    const list = ordered();
    const i = list.indexOf(r);
    const prev = list[(i - 1 + list.length) % list.length];
    const next = list[(i + 1) % list.length];
    const related = r.related.map(find).filter(Boolean);
    const back = cameFrom === "home" ? ["home", "#/", "Início"] : ["projects", "#/projetos", "Projetos"];

    const meta = [
      ["Tipo", esc(r.kindLabel)],
      main ? ["Linguagem", `${brand(main)}${esc(main)}`] : null,
      ["Criado", `<span title="${fmtDate(r.created)}">${monthYear(r.created)}</span>`],
      ["Atualizado", `<span title="${fmtDate(r.pushed)}">${ago(r.pushed)}</span>`],
      r.stars ? ["Estrelas", `${icon("star")}${fmtInt(r.stars)}`] : null,
    ]
      .filter(Boolean)
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
      .join("");

    const details = [
      r.highlights.length ? section("Destaques", `<div class="p-body">${bullets(r.highlights)}</div>`) : "",
      r.run ? section(`Comando${r.where ? ` ${esc(r.where)}` : ""}`, `<div class="p-body">${codeBlock(r.run, "Copiar comando")}</div>`) : "",
      r.example ? section("Exemplo", `<div class="p-body">${codeBlock(r.example.code, "Copiar exemplo", r.example.lang)}</div>`) : "",
      r.stack.length ? section("Pilha", `<div class="p-body">${tags(r.stack)}</div>`) : "",
      langs.length ? section("Linguagens", langRows(langs.slice(0, 6))) : "",
    ].join("");

    const readme = r.readmeNote
      ? `<p class="empty">${esc(r.readmeNote)}</p>`
      : r.readme.trim()
        ? `<div class="readme">${renderMd(r.readme, r.url)}</div>`
        : `<p class="empty">Este repositório ainda não tem README. O código está no GitHub.</p>`;

    return `
      <div class="panel p-back"><a class="back" href="${back[1]}" data-back="${back[0]}">${icon("back")}${back[2]}</a></div>
      <div class="panel p-cover">${FIGURE(r)}<span class="fig-cap" aria-hidden="true">Fig. ${i + 1}.</span></div>
      <header class="panel p-head">
        <div class="p-title-row">${kindBox(r, "ibox ibox-lg")}<h1 class="p-title">${esc(r.name)}</h1></div>
        <p class="p-summary">${esc(r.summary)}</p>
      </header>
      <div class="panel"><dl class="p-meta">${meta}</dl></div>
      <div class="panel p-actions">
        <a class="btn btn-primary" href="${esc(r.url)}" target="_blank" rel="noopener">${icon("github")}Ver no GitHub</a>
        ${r.docs ? `<a class="btn btn-secondary" href="${esc(r.docs)}" target="_blank" rel="noopener">${icon("book")}Documentação</a>` : ""}
      </div>
      ${details ? SEP + details : ""}
      ${SEP}
      ${section("README", readme)}
      ${related.length ? section("Relacionados", `<ul class="cards">${related.map(card).join("")}</ul>`) : ""}
      ${SEP}
      <nav class="panel p-next" aria-label="Outros projetos">
        <a href="${href(prev)}"><small>Anterior</small><strong class="nm">${esc(prev.name)}</strong></a>
        <a href="${href(next)}"><small>Próximo</small><strong class="nm">${esc(next.name)}</strong></a>
      </nav>
      ${SEP}`;
  }

  // copiar comando/exemplo
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-copy]");
    if (!btn) return;
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
    } catch {
      return;
    }
    const label = btn.getAttribute("aria-label");
    btn.classList.add("done");
    btn.setAttribute("aria-label", "Copiado");
    setTimeout(() => {
      btn.classList.remove("done");
      btn.setAttribute("aria-label", label);
    }, 1600);
  });

  // ── transições ──────────────────────────────────────────────────────────
  let activeVT = null;
  /** Roda `update` dentro de uma View Transition (`kind` escolhe o CSS em [data-vt]); sem suporte, só atualiza. */
  function viewTransition(kind, update) {
    if (!document.startViewTransition) {
      update();
      return null;
    }
    root.dataset.vt = kind;
    const t = document.startViewTransition(update);
    activeVT = t;
    const done = () => {
      if (activeVT !== t) return;
      delete root.dataset.vt;
      activeVT = null;
    };
    t.finished.then(done, done);
    return t;
  }

  // nome do projeto visível na visão de destino (destaque, card ou "último push"), alvo da volta
  function visibleName(scope, name) {
    if (!name) return null;
    return (
      $$(`[data-repo="${CSS.escape(name)}"] .nm`, scope).find((el) => {
        const b = el.getBoundingClientRect();
        return b.width > 0 && b.bottom > 0 && b.top < window.innerHeight;
      }) ?? null
    );
  }

  // ── rotas ───────────────────────────────────────────────────────────────
  function parse() {
    const pm = location.hash.match(/^#\/projetos(?:\?tec=([\w-]+))?$/);
    if (pm) return { view: "projects", tech: pm[1] ? techBySlug(pm[1]) : null };
    const m = location.hash.match(/^#\/projeto\/(.+)$/);
    const r = m && find(decodeURIComponent(m[1]));
    return r ? { view: "project", repo: r } : { view: "home" };
  }

  function show(next, entrance) {
    if (view !== "project") scrollMem[view] = window.scrollY;
    cameFrom = booted ? view : null;
    if (next.view !== "home") root.classList.remove("intro");
    view = next.view;
    for (const [k, el] of Object.entries(VIEWS)) el.hidden = k !== view;

    if (view === "project") {
      current = next.repo;
      projectBody.classList.toggle("is-entering", entrance);
      projectBody.innerHTML = renderProject(current);
      document.title = `${current.name} — Victor Gabriel`;
      window.scrollTo({ top: 0, behavior: "instant" });
      projectBody.focus({ preventScroll: true });
    } else {
      current = null;
      projectBody.innerHTML = "";
      if (view === "projects") {
        document.title = `Projetos — Victor Gabriel`;
        setTech(next.tech);
        placePill(false);
        window.scrollTo({ top: cameFrom === "project" ? scrollMem.projects : 0, behavior: "instant" });
        if (booted) $("#h-projetos").focus({ preventScroll: true });
      } else {
        document.title = TITLE;
        const id = location.hash.slice(1);
        const target = id && !id.startsWith("/") ? document.getElementById(id) : null;
        if (target) target.scrollIntoView({ behavior: "instant" });
        else window.scrollTo({ top: booted ? scrollMem.home : 0, behavior: "instant" });
      }
    }
    syncNav();
  }

  function route() {
    const next = parse();
    const src = pending?.hash === location.hash ? pending.el : null;
    pending = null;
    // âncora de seção dentro da própria home: o navegador já rolou
    if (booted && next.view === "home" && view === "home") return syncNav();
    // troca de filtro de tecnologia dentro da página de projetos: os cards deslizam
    if (booted && next.view === "projects" && view === "projects") return flipCards(() => setTech(next.tech));
    if (!booted || !document.startViewTransition) {
      show(next, next.view === "project");
      return;
    }
    // o nome clicado vira o título da página do projeto (e volta para o destaque/card ao sair)
    const morph = !reduce.matches;
    const named = [];
    const tag = (el) => {
      if (!morph || !el) return;
      el.style.viewTransitionName = "project-title";
      named.push(el);
    };
    const leaving = view === "project" ? current?.name : null;
    const from = next.view === "project" ? src : view === "project" ? $(".p-title", projectBody) : null;
    tag(from);
    const t = viewTransition(morph ? "route" : "fade", () => {
      show(next, false);
      if (!from) return;
      if (next.view === "project") tag($(".p-title", projectBody));
      else tag(visibleName(VIEWS[next.view], leaving));
    });
    const clear = () => named.forEach((el) => (el.style.viewTransitionName = ""));
    t.finished.then(clear, clear);
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#/projeto/"]');
    if (!a) return;
    const nm = a.querySelector(".nm") ?? a.closest("[data-repo]")?.querySelector(".nm");
    // o nome só serve de origem se estiver visível (destaque fechado esconde o corpo)
    pending = { hash: a.getAttribute("href"), el: nm && nm.getBoundingClientRect().width ? nm : null };
  });
  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-back]");
    if (!a || cameFrom !== a.dataset.back) return;
    e.preventDefault();
    history.back();
  });
  window.addEventListener("hashchange", route);

  // ── tema ────────────────────────────────────────────────────────────────
  const themeMeta = $('meta[name="theme-color"]');
  function applyTheme(theme) {
    root.dataset.theme = theme;
    themeMeta.content = theme === "dark" ? "#09090b" : "#ffffff";
    for (const b of $$("[data-theme-toggle]")) b.title = theme === "dark" ? "Usar tema claro" : "Usar tema escuro";
  }
  // troca de tema: o novo tema se abre em círculo a partir do botão
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    const commit = () => {
      applyTheme(next);
      try {
        localStorage.setItem("theme", next);
      } catch {}
    };
    if (reduce.matches) return void viewTransition("fade", commit);
    const b = btn.getBoundingClientRect();
    const x = b.left + b.width / 2;
    const y = b.top + b.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    viewTransition("theme", commit)
      ?.ready.then(() =>
        root.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 650, easing: EASE, pseudoElement: "::view-transition-new(root)" },
        ),
      )
      .catch(() => {});
  });
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    let saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch {}
    if (!saved) applyTheme(e.matches ? "dark" : "light");
  });

  // ── atualização ao vivo (opcional) ──────────────────────────────────────
  async function getJSON(url, headers = {}) {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 6000);
    try {
      const res = await fetch(url, { signal: ctl.signal, headers });
      return res.ok ? await res.json() : null;
    } finally {
      clearTimeout(t);
    }
  }
  const afterIntro = (fn) => (root.classList.contains("intro") ? setTimeout(fn, INTRO_MS) : fn());

  async function refreshRepos() {
    try {
      const live = await getJSON(`https://api.github.com/users/${G.user.login}/repos?per_page=100&type=owner`, {
        Accept: "application/vnd.github+json",
      });
      if (!Array.isArray(live)) return;
      const known = new Map(G.repos.map((r) => [r.name, r]));
      const next = live
        .filter((l) => !l.fork && !l.private)
        .map((l) => {
          const old = known.get(l.name);
          if (old) return { ...old, description: l.description ?? old.description, stars: l.stargazers_count, forks: l.forks_count, pushed: l.pushed_at };
          return {
            name: l.name,
            description: l.description ?? "",
            url: l.html_url,
            homepage: l.homepage || "",
            language: l.language ?? "",
            languages: l.language ? { [l.language]: 1 } : {},
            topics: l.topics ?? [],
            stars: l.stargazers_count,
            forks: l.forks_count,
            created: l.created_at,
            pushed: l.pushed_at,
            readme: "",
          };
        });
      if (!next.length) return;
      merge(next);
      renderAll();
    } catch {
      // offline ou limite da API: segue com o snapshot
    }
  }

  async function refreshContributions() {
    try {
      const live = await getJSON(`https://github-contributions-api.jogruber.de/v4/${G.user.login}?y=last`);
      const days = live?.contributions;
      if (!days?.length) return;
      const next = { total: live.total.lastYear, start: days[0].date, counts: days.map((d) => d.count), levels: days.map((d) => d.level).join("") };
      if (contrib && next.start === contrib.start && next.levels === contrib.levels && next.total === contrib.total) return;
      contrib = next;
      afterIntro(() => renderCalendar(contrib));
    } catch {
      // segue com o snapshot
    }
  }

  // ── boot ────────────────────────────────────────────────────────────────
  merge(G.repos);
  renderArch();
  renderAll();
  renderCalendar(contrib);
  applyTheme(root.dataset.theme === "dark" ? "dark" : "light");
  route();
  booted = true;
  setTimeout(() => root.classList.remove("intro"), INTRO_MS);
  refreshRepos();
  refreshContributions();
})();
