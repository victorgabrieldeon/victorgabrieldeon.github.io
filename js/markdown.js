// README (markdown do GitHub) → HTML semântico para a página do projeto.
// Cobre o que os READMEs usam: títulos, parágrafos, listas, código, tabelas, citações e inline.
(() => {
  const PICTO = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;
  // (url) com um nível de parênteses dentro, ex.: badges com "label=pypi%20(stable)"
  const PAREN_URL = String.raw`\((?:[^()\s]|\([^()]*\))*\)`;
  const BADGE = new RegExp(String.raw`\[!\[[^\]]*\]${PAREN_URL}\]${PAREN_URL}`, "g");
  const IMAGE = new RegExp(String.raw`!\[[^\]]*\]${PAREN_URL}`, "g");
  const LINK = /\[([^\]]+)\]\(((?:[^()\s]|\([^()]*\))+)(?:\s+&quot;[^&]*&quot;)?\)/g;
  const TASK = /^\[([ xX])\]\s+(.*)$/;

  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function resolveUrl(href, base) {
    if (/^(https?:|mailto:)/i.test(href)) return href;
    if (href.startsWith("#")) return null;
    return `${base}/blob/HEAD/${href.replace(/^\.?\//, "")}`;
  }

  function inline(text, base) {
    const codes = [];
    let s = text.replace(/`([^`]+)`/g, (_, c) => {
      codes.push(c);
      return `\u0000${codes.length - 1}\u0000`;
    });
    s = esc(s);
    s = s.replace(LINK, (_, label, href) => {
      const url = resolveUrl(href.replace(/&amp;/g, "&"), base);
      return url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${label}</a>` : label;
    });
    s = s.replace(/\*\*([^*]+)\*\*|__([^_]+)__/g, (_, a, b) => `<b>${a ?? b}</b>`);
    s = s.replace(/(^|[\s(])\*([^*\s][^*]*)\*(?=[\s).,:;!?]|$)/g, "$1<i>$2</i>");
    s = s.replace(/(^|[\s(])_([^_\s][^_]*)_(?=[\s).,:;!?]|$)/g, "$1<i>$2</i>");
    s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => `<code>${esc(codes[+i])}</code>`);
    return s;
  }

  function clean(md) {
    return md
      .replace(/\r\n?/g, "\n")
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<(div|p|table|picture|details|summary)[^>]*>|<\/(div|p|table|picture|details|summary)>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<img[^>]*>/gi, "")
      .replace(/<\/?(a|tr|td|th|strong|em|sub|sup|span)[^>]*>/gi, "")
      .replace(BADGE, "") // badges com link
      .replace(IMAGE, ""); // imagens
  }

  const heading = (s) => s.replace(PICTO, "").replace(/\s+/g, " ").trim();

  function table(rows, base) {
    const cells = (r) => r.replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    const head = cells(rows[0]);
    const body = rows.slice(2).map(cells);
    return `<div class="table-wrap"><table><thead><tr>${head.map((h) => `<th>${inline(h, base)}</th>`).join("")}</tr></thead><tbody>${body
      .map((r) => `<tr>${r.map((c) => `<td>${inline(c, base)}</td>`).join("")}</tr>`)
      .join("")}</tbody></table></div>`;
  }

  const checkbox = (done) =>
    `<svg class="task-box" viewBox="0 0 16 16" role="img" aria-label="${done ? "feito" : "pendente"}"><rect x="1.5" y="1.5" width="13" height="13" rx="3.5" />${
      done ? '<path d="M4.6 8.3 7 10.6l4.4-5" />' : ""
    }</svg>`;

  /** @returns {string} */
  function render(md, base, { skipTitle = true } = {}) {
    const lines = clean(md).split("\n");
    const out = [];
    let para = [];
    let stack = []; // listas abertas, da raiz à mais interna: { ordered, indent, items: { text, children }[] }
    let pending = []; // títulos à espera de conteúdo: { level, html }[]; título sem conteúdo some
    let sawTitle = false;

    const emit = (html) => {
      for (const p of pending) out.push(p.html);
      pending = [];
      out.push(html);
    };
    const renderList = (l) => {
      const tag = l.ordered ? "ol" : "ul";
      const items = l.items.map((it) => {
        const task = it.text.match(TASK);
        const body = task ? `${checkbox(task[1] !== " ")}${inline(task[2], base)}` : inline(it.text, base);
        return `<li${task ? ' class="task"' : ""}>${body}${it.children.map(renderList).join("")}</li>`;
      });
      return `<${tag}>${items.join("")}</${tag}>`;
    };
    const flushPara = () => {
      if (para.length) emit(`<p>${inline(para.join(" "), base)}</p>`);
      para = [];
    };
    const flushList = () => {
      if (stack.length) emit(renderList(stack[0]));
      stack = [];
    };
    const flush = () => {
      flushPara();
      flushList();
    };
    const lastItem = () => stack.at(-1).items.at(-1);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const fence = line.match(/^\s*(```|~~~)\s*([\w+-]*)/);
      if (fence) {
        flush();
        const buf = [];
        for (i++; i < lines.length && !lines[i].trim().startsWith(fence[1]); i++) buf.push(lines[i]);
        const lang = fence[2] ? ` data-lang="${esc(fence[2])}"` : "";
        emit(`<pre class="code"${lang}><code>${esc(buf.join("\n").replace(/\s+$/, ""))}</code></pre>`);
        continue;
      }
      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        flush();
        const text = heading(h[2]);
        if (!text) continue;
        if (h[1].length === 1 && skipTitle && !sawTitle) {
          sawTitle = true;
          continue;
        }
        const level = Math.min(h[1].length, 3);
        pending = pending.filter((p) => p.level < level);
        pending.push({ level, html: level <= 2 ? `<h3>${inline(text, base)}</h3>` : `<h4>${inline(text, base)}</h4>` });
        continue;
      }
      if (/^\s*\|.*\|\s*$/.test(line) && /^\s*\|?\s*:?-{2,}/.test(lines[i + 1] ?? "")) {
        flush();
        const rows = [];
        for (; i < lines.length && /^\s*\|/.test(lines[i]); i++) rows.push(lines[i].trim());
        i--;
        emit(table(rows, base));
        continue;
      }
      if (/^\s*([-*_])(\s*\1){2,}\s*$/.test(line)) {
        flush();
        continue;
      }
      const li = line.match(/^(\s*)([-*+]|\d+[.)])\s+(.*)$/);
      if (li) {
        flushPara();
        const indent = li[1].replace(/\t/g, "    ").length;
        const ordered = /\d/.test(li[2]);
        while (stack.length > 1 && indent < stack.at(-1).indent) stack.pop();
        const top = stack.at(-1);
        if (top && indent >= top.indent + 2 && top.items.length) {
          const child = { ordered, indent, items: [] };
          lastItem().children.push(child);
          stack.push(child);
        } else if (!top || (stack.length === 1 && top.ordered !== ordered)) {
          flushList();
          stack = [{ ordered, indent, items: [] }];
        }
        stack.at(-1).items.push({ text: li[3], children: [] });
        continue;
      }
      const quote = line.match(/^>\s?(.*)$/);
      if (quote) {
        flush();
        if (quote[1].trim()) emit(`<blockquote>${inline(quote[1], base)}</blockquote>`);
        continue;
      }
      if (!line.trim()) {
        // linha em branco: fecha parágrafo; a lista continua se o próximo item vier
        flushPara();
        continue;
      }
      if (stack.length && /^\s{2,}\S/.test(line)) {
        lastItem().text += ` ${line.trim()}`;
        continue;
      }
      flushList();
      para.push(line.trim());
    }
    flush();
    return out.join("\n");
  }

  window.Markdown = { render, inline, esc };
})();
