// Figuras monocromáticas por projeto: um diagrama do que cada um faz, em 320×180, só com traço, hachura e tinta.
// Classes (estilo em css/style.css, .pfig): fg traço, fs traço suave, fd tracejado, fh/fh2 hachura com traço,
// fhn hachura sem traço, fq tinta leve, ff tinta cheia, fb fundo (tampa o que está atrás); texto: tm suave, ti invertido, ts menor, mid centrado.
// Valores de exemplo (nomes de coluna, rótulos) são ilustrativos; os do flowcast vêm do exemplo do README.
window.FIGURES = (() => {
  const n = (v) => Math.round(v * 10) / 10;
  const r = (x, y, w, h, cls = "fg", rx = 4) => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;
  const p = (d, cls = "fg") => `<path class="${cls}" d="${d}"/>`;
  const c = (cx, cy, rad, cls = "fg") => `<circle class="${cls}" cx="${cx}" cy="${cy}" r="${rad}"/>`;
  const t = (x, y, s, cls = "") => `<text${cls ? ` class="${cls}"` : ""} x="${x}" y="${y}">${s}</text>`;
  /** seta reta; a ponta sempre em traço cheio, mesmo quando a haste é tracejada */
  function arrow(x1, y1, x2, y2, cls = "fg") {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const h = 5;
    const head = `M${n(x2 - h * Math.cos(a - 0.5))} ${n(y2 - h * Math.sin(a - 0.5))}L${x2} ${y2}L${n(x2 - h * Math.cos(a + 0.5))} ${n(y2 - h * Math.sin(a + 0.5))}`;
    return p(`M${x1} ${y1}L${x2} ${y2}`, cls) + p(head);
  }
  /** caixa isométrica: losango do topo centrado em (cx, cy), lados com altura h */
  function cube(cx, cy, s, h) {
    const dx = n(s * 0.866);
    const dy = n(s * 0.5);
    const top = `M${cx} ${cy - dy}L${cx + dx} ${cy}L${cx} ${cy + dy}L${cx - dx} ${cy}Z`;
    const left = `M${cx - dx} ${cy}L${cx} ${cy + dy}L${cx} ${cy + dy + h}L${cx - dx} ${cy + h}Z`;
    const right = `M${cx} ${cy + dy}L${cx + dx} ${cy}L${cx + dx} ${cy + h}L${cx} ${cy + dy + h}Z`;
    return p(left, "fg fh") + p(right, "fg fh2") + p(top, "fg fb");
  }
  const hex = (cx, cy, rad, cls = "fg") =>
    p(
      `M${[0, 1, 2, 3, 4, 5].map((k) => `${n(cx + rad * Math.cos(((60 * k + 30) * Math.PI) / 180))} ${n(cy + rad * Math.sin(((60 * k + 30) * Math.PI) / 180))}`).join("L")}Z`,
      cls,
    );
  /** pseudoaleatório estável (o desenho é o mesmo a cada carga) */
  const rnd = (i, seed) => {
    const v = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  const doc = (x, y, w, h, cls = "fg") => p(`M${x} ${y}h${w - 12}l12 12v${h - 12}H${x}z`, cls) + p(`M${x + w - 12} ${y}v12h12`);

  const FIG = {
    hypemeet: () => {
      let wave = "";
      for (let i = 0, x = 34; x <= 238; x += 5, i++) {
        const h = n(2 + rnd(i, 3) * 11);
        wave += `M${x} ${n(165 - h / 2)}v${h}`;
      }
      return [
        r(34, 20, 98, 60),
        p("M77 41l14 9-14 9z", "ff"),
        r(140, 20, 98, 60, "fg fh"),
        r(146, 26, 27, 11, "ff", 2),
        t(150, 34, "LIVE", "ti ts"),
        r(34, 88, 98, 60),
        c(83, 109, 9),
        p("M65 142c2-12 9-18 18-18s16 6 18 18"),
        r(140, 88, 98, 60),
        p("M150 101h44M150 109h62M150 117h30", "fs"),
        p("M156 138c9-15 19 2 29-8s17-4 23 4"),
        p("M208 134l9 2-4 3-1 5z", "ff"),
        p("M268 24v124", "fs"),
        p("M264 24h8M264 86h8M264 148h8", "fs"),
        r(261, 52, 14, 8, "fg fb", 2),
        t(279, 27, "200%", "tm ts"),
        t(279, 89, "100%", "tm ts"),
        t(279, 151, "0", "tm ts"),
        p(wave),
      ].join("");
    },

    futhub: () => {
      let out = "";
      for (let i = 0; i < 8; i += 2) out += `<rect class="fhn" x="${30 + i * 25}" y="26" width="25" height="120"/>`;
      out += [
        r(30, 26, 200, 120, "fg", 2),
        p("M130 26v120"),
        c(130, 86, 16),
        c(130, 86, 1.8, "ff"),
        r(30, 56, 30, 60, "fg", 0),
        r(30, 72, 11, 28, "fg", 0),
        r(200, 56, 30, 60, "fg", 0),
        r(219, 72, 11, 28, "fg", 0),
        p("M60 78a10 10 0 0 1 0 16"),
        p("M200 78a10 10 0 0 0 0 16"),
        r(25, 78, 5, 16, "fg", 0),
        r(230, 78, 5, 16, "fg", 0),
        t(248, 32, "liga", "tm"),
      ].join("");
      for (let i = 0; i < 5; i++) {
        const y = 42 + i * 20;
        out += t(248, y + 9, String(i + 1), "tm ts") + r(260, y + 3, 38 - i * 6, 6, i === 0 ? "ff" : "fq", 1.5) + p(`M248 ${y + 17}h50`, "fs");
      }
      return out;
    },

    "nexo-db": () =>
      [
        p("M34 46v64a26 8 0 0 0 52 0V46", "fg fh"),
        `<ellipse class="fg fb" cx="60" cy="46" rx="26" ry="8"/>`,
        p("M34 68a26 8 0 0 0 52 0M34 90a26 8 0 0 0 52 0", "fs"),
        p("M90 78h24", "fs fd"),
        `<rect class="fhn" x="118" y="30" width="116" height="16"/>`,
        r(118, 62, 116, 16, "fq", 0),
        r(118, 30, 116, 96, "fg", 3),
        p("M118 46h116M118 62h116M118 78h116M118 94h116M118 110h116", "fs"),
        p("M146 30v96M190 30v96", "fs"),
        t(123, 41, "id"),
        t(151, 41, "name"),
        t(195, 41, "user_id"),
        p("M123 54h10M151 54h28M195 54h14M123 70h10M151 70h22M195 70h14M123 86h10M151 86h30M195 86h14M123 102h10M151 102h18M195 102h14M123 118h10M151 118h26M195 118h14", "fs"),
        p("M214 70c26 0 22 34 40 36"),
        p("M249 102l5 4-6 2"),
        `<rect class="fhn" x="256" y="92" width="46" height="16"/>`,
        r(256, 92, 46, 50, "fg", 3),
        p("M256 108h46M256 124h46", "fs"),
        t(261, 103, "users"),
        p("M262 116h20M262 132h26", "fs"),
      ].join(""),

    "opencode-devspace-manager": () => {
      let out = [r(22, 18, 276, 144, "fg", 5), p("M22 34h276", "fs"), t(30, 29, "devspace", "tm ts"), p("M132 34v128", "fs")].join("");
      const names = [44, 36, 50, 30, 40];
      for (let i = 0; i < 5; i++) {
        const y = 50 + i * 22;
        if (i === 1) out += r(23, y - 10, 109, 20, "fq", 0);
        out += hex(40, y, 6) + p(`M54 ${y}h${names[i]}`, "fs") + c(120, y, 3, i < 3 ? "ff" : "fg");
      }
      for (let i = 0; i < 7; i++) {
        const y = 48 + i * 12;
        out += (i % 3 === 0 ? p(`M142 ${y}h6`, "fg") : "") + p(`M${i % 3 === 0 ? 152 : 142} ${y}h${n(40 + rnd(i, 5) * 90)}`, "fs");
      }
      return out + p("M132 140h166", "fs") + t(142, 154, "/devspace") + r(190, 146, 5, 10, "ff", 1);
    },

    flowcast: () => {
      const nodes = [
        [96, "transform", p("M105 75h12M113 71l4 4-4 4")],
        [146, "parse_float", t(161, 78, "1,2", "mid")],
        [196, "after", p("M207 71l8 8M215 71l-8 8")],
      ];
      return [
        doc(22, 30, 52, 90),
        t(26, 52, "R$ 1.299,90", "ts"),
        p("M28 66h32M28 76h22M28 86h36M28 96h18M28 106h28", "fs"),
        t(48, 138, "raw", "tm mid"),
        arrow(78, 75, 92, 75),
        ...nodes.map(([x, label, glyph]) => r(x, 60, 30, 30, "fg fb", 6) + glyph + t(x + 15, 106, label, "tm ts mid")),
        arrow(126, 75, 142, 75),
        arrow(176, 75, 192, 75),
        arrow(226, 75, 236, 75),
        `<rect class="fhn" x="240" y="52" width="60" height="14"/>`,
        r(240, 52, 60, 48, "fg", 4),
        p("M240 66h60M240 83h60", "fs"),
        t(245, 62, "out", "ts"),
        t(245, 78, "price", "ts"),
        t(245, 95, "1299.9", "ts"),
      ].join("");
    },

    openapicmd: () => {
      const methods = ["GET", "POST", "GET", "PUT", "DEL"];
      const paths = [60, 48, 72, 52, 40];
      let out = r(22, 20, 160, 140, "fg", 5);
      methods.forEach((m, i) => {
        const y = 28 + i * 26;
        const sel = i === 1;
        if (sel) out += r(23, y, 158, 24, "fq", 0) + p(`M166 ${y + 7}l8 5-8 5z`, "ff");
        out += r(32, y + 5, 30, 14, sel ? "ff" : "fg", 3) + t(47, y + 14.5, m, `ts mid${sel ? " ti" : ""}`) + p(`M70 ${y + 12}h${paths[i]}`, "fs");
      });
      return (
        out +
        arrow(182, 46, 190, 46) +
        [
          r(192, 20, 106, 140, "fg", 5),
          r(202, 30, 28, 14, "fg", 3),
          t(216, 40, "200", "ts mid"),
          t(202, 64, "{"),
          p("M212 76h40M212 88h56M220 100h30M220 112h44M212 124h36", "fs"),
          t(202, 140, "}"),
        ].join("")
      );
    },

    "code-craft": () =>
      [
        r(36, 22, 248, 136, "fs", 8),
        r(58, 50, 214, 98, "fs", 7),
        r(80, 78, 180, 60, "fq", 6),
        p("M46 46v104M68 74v66", "fs fd"),
        t(46, 39, "with"),
        p("M74 36h70", "fg"),
        t(68, 67, "with"),
        p("M96 64h56", "fg"),
        t(90, 95, "with"),
        p("M118 92h44", "fg"),
        p("M100 110h90M100 122h64", "fs"),
        t(268, 39, ":", "tm"),
      ].join(""),

    "fv-api": () =>
      [
        r(22, 46, 78, 88, "fg", 6),
        t(30, 60, "sdk", "tm ts"),
        t(61, 94, "futverse", "mid"),
        r(220, 46, 78, 88, "fg fh", 6),
        r(232, 80, 54, 20, "fg fb", 4),
        t(259, 93.5, "Fv API", "mid ts"),
        t(160, 64, "sync", "tm ts mid"),
        arrow(100, 72, 216, 72),
        t(160, 100, "async", "tm ts mid"),
        arrow(100, 108, 216, 108, "fg fd"),
        arrow(100, 116, 216, 116, "fg fd"),
        arrow(100, 124, 216, 124, "fg fd"),
      ].join(""),

    "hypemeet-releases": () =>
      [
        [80, "windows"],
        [160, "macos"],
        [240, "linux"],
      ]
        .map(([x, label]) => arrow(x, 24, x, 50) + cube(x, 78, 30, 24) + t(x, 146, label, "tm ts mid"))
        .join(""),

    victorgabrieldeon: () => {
      let out = [
        `<path class="fhn" d="M64 26a8 8 0 0 1 8-8h176a8 8 0 0 1 8 8v34H64z"/>`,
        r(64, 18, 192, 144, "fg", 8),
        p("M64 60h192", "fs"),
        c(102, 62, 18, "fg fb"),
        c(102, 57, 6, "fs"),
        p("M91 74c3-5 7-7 11-7s8 2 11 7", "fs"),
        p("M128 72h64", "fg"),
        p("M128 82h44", "fs"),
      ].join("");
      for (let k = 0; k < 7; k++) out += r(84 + k * 18, 98, 12, 12, "fg", 3);
      out += r(84, 122, 74, 28, "fs", 4) + r(166, 122, 74, 28, "fs", 4);
      for (let k = 0; k < 8; k++) {
        const h = n(4 + rnd(k, 9) * 12);
        out += p(`M${92 + k * 7} ${144 - h}v${h}`, "fg");
      }
      return out + p("M174 132h40M174 140h28", "fs");
    },

    "paseo-unity-workspace": () => {
      let out = cube(84, 70, 40, 34) + c(84, 150, 9) + p("M81 145l8 5-8 5z", "ff");
      for (let k = 0; k < 3; k++) {
        const x = 156 + k * 14;
        const y = 26 + k * 14;
        out += r(x, y, 120, 86, "fg fb", 4) + p(`M${x} ${y + 12}h120`, "fs") + c(x + 8, y + 6, 1.6, "ff");
      }
      return out + t(192, 84, "/unity-play") + p("M192 98h60M192 108h40", "fs") + t(216, 156, "clones", "tm ts mid");
    },

    "paseo-devspace": () => {
      let out = p("M70 30h228", "fs") + p("M70 27v6M127 27v6M184 27v6M241 27v6M298 27v6", "fs");
      const lanes = [56, 88, 120];
      out += p("M35 50l10 6-10 6z", "ff") + r(35, 83, 10, 10, "ff", 1.5) + p("M35 114l10 6-10 6z", "ff");
      for (const y of lanes) out += p(`M70 ${y}h228`, "fs fd");
      out += [
        r(80, 51, 120, 10, "fg fh", 2),
        r(208, 51, 72, 10, "ff", 2),
        r(90, 83, 80, 10, "fg fh", 2),
        r(140, 115, 150, 10, "ff", 2),
        r(70, 138, 66, 18, "fg", 4),
        p("M78 143l7 4-7 4z", "ff"),
        t(90, 150.5, "iniciar", "ts"),
        r(144, 138, 56, 18, "fg", 4),
        r(152, 143, 8, 8, "ff", 1),
        t(165, 150.5, "parar", "ts"),
      ].join("");
      return out;
    },

    "typescript-lua-template": () =>
      [
        doc(32, 26, 54, 74),
        t(42, 56, ".ts"),
        p("M42 70h28M42 80h20M42 90h24", "fs"),
        doc(234, 26, 54, 74),
        t(244, 56, ".lua"),
        p("M244 70h28M244 80h20M244 90h24", "fs"),
        t(160, 54, "roblox-ts", "tm ts mid"),
        arrow(96, 62, 224, 62),
        cube(160, 112, 28, 18),
        `<ellipse class="fg fb" cx="151" cy="111" rx="5" ry="2.6"/>`,
        `<ellipse class="fg fb" cx="169" cy="111" rx="5" ry="2.6"/>`,
        t(160, 166, "rojo serve", "tm ts mid"),
      ].join(""),

    "fastapi-RBAc": () =>
      [
        p("M55 52L126 67M55 92L126 67M55 92L126 119M55 132L126 119M186 67L236 52M186 67L236 92M186 119L236 92M186 119L236 132", "fs"),
        t(46, 26, "user", "tm ts mid"),
        t(156, 26, "group", "tm ts mid"),
        t(262, 26, "role", "tm ts mid"),
        c(46, 52, 9, "fg fb"),
        c(46, 92, 9, "fg fb"),
        c(46, 132, 9, "fg fb"),
        r(126, 56, 60, 22, "fg fh", 4),
        r(126, 108, 60, 22, "fg fb", 4),
        r(236, 42, 52, 20, "fg fb", 4),
        r(236, 82, 52, 20, "fg fh", 4),
        r(236, 122, 52, 20, "fg fb", 4),
        p("M294 51l3 3 6-6M294 91l3 3 6-6M294 131l3 3 6-6"),
      ].join(""),

    "fastapi-service-auth": () =>
      [
        doc(28, 50, 46, 70),
        p("M36 76h26M36 86h30M36 96h20", "fs"),
        t(51, 138, "request", "tm ts mid"),
        arrow(84, 85, 116, 85),
        p("M142 70V58a18 18 0 0 1 36 0v12"),
        r(128, 70, 64, 52, "fg fh", 6),
        c(160, 92, 6, "fg fb"),
        p("M160 98v9"),
        t(160, 140, "auth", "tm ts mid"),
        arrow(204, 85, 236, 85),
        c(262, 85, 20),
        p("M252 85l7 7 13-14"),
      ].join(""),

    fastapi_template: () =>
      [
        [122, "settings"],
        [86, "models"],
        [50, "app"],
      ]
        .map(([y, label]) => cube(128, y, 50, 8) + p(`M171 ${y}h41`, "fs fd") + t(218, y + 3, label))
        .join(""),

    // o próprio portfólio: coluna com trilhos, linhas de ponta a ponta, capa isométrica, faixa hachurada e cards
    "victorgabrieldeon.github.io": () =>
      [
        r(40, 14, 240, 152, "fg fb", 6),
        p("M40 28h240", "fs"),
        c(50, 21, 1.6, "ff"),
        c(57, 21, 1.6, "fs"),
        c(64, 21, 1.6, "fs"),
        `<rect class="fhn" x="40.5" y="112" width="239" height="8"/>`,
        p("M40 44h240M40 76h240M40 112h240M40 120h240", "fs"),
        p("M112 28v138M208 28v138", "fs"),
        p("M120 36h12"),
        p("M168 36h12M186 36h14", "fs"),
        cube(160, 56, 12, 7),
        c(126, 92, 8, "fg fb"),
        p("M140 88h40"),
        p("M140 97h56", "fs"),
        r(116, 128, 42, 26, "fg", 3),
        r(162, 128, 42, 26, "fg fh", 3),
      ].join(""),

    "bot-create-guild-template": () =>
      [
        r(22, 62, 70, 30, "fg", 8),
        t(57, 81, "tema", "mid"),
        arrow(96, 77, 116, 77),
        p("M136 61c2 10 6 14 16 16-10 2-14 6-16 16-2-10-6-14-16-16 10-2 14-6 16-16z", "fg fh"),
        arrow(156, 77, 178, 77),
        r(186, 20, 24, 24, "ff", 7),
        p("M198 44v96M198 58h10M198 106h10", "fs"),
        p("M212 55l3 3 3-3M212 103l3 3 3-3"),
        p("M224 58h44M224 106h36"),
        p("M214 62v32M214 110v32", "fs"),
        t(220, 75, "#", "tm"),
        t(220, 91, "#", "tm"),
        t(220, 123, "#", "tm"),
        t(220, 139, "#", "tm"),
        p("M230 72h40M230 88h28M230 120h48M230 136h34", "fs"),
      ].join(""),
  };

  const cyl = (cx, top, rx, ry, h) =>
    p(`M${cx - rx} ${top}v${h}a${rx} ${ry} 0 0 0 ${2 * rx} 0V${top}`, "fg fh") + `<ellipse class="fg fb" cx="${cx}" cy="${top}" rx="${rx}" ry="${ry}"/>`;

  // Conceitos de arquitetura (window.ARCH): diagramas genéricos, sem nomes de sistema inventados.
  const CONCEPT = {
    patterns: () =>
      [
        p("M66 108V90H254V108M160 90V108M160 90V74", "fg fd"),
        p("M153 74h14l-7-12z", "fg fb"),
        r(112, 16, 96, 46, "fg fb", 3),
        t(160, 28, "«interface»", "tm ts mid"),
        p("M112 34h96", "fs"),
        p("M122 44h52M122 53h36", "fs"),
        ...[22, 116, 210].map((x) => r(x, 108, 88, 50, "fg fb", 3) + p(`M${x} 124h88`, "fs") + p(`M${x + 10} 116h34`) + p(`M${x + 10} 134h52M${x + 10} 144h40`, "fs")),
      ].join(""),

    clean: () => {
      const cx = 104;
      const cy = 90;
      let out = c(cx, cy, 70) + c(cx, cy, 52) + c(cx, cy, 34) + c(cx, cy, 16, "fg fh");
      for (const [rad, label, deg, ly] of [
        [70, "infra", -55, 34],
        [52, "adaptadores", -22, 66],
        [34, "casos de uso", 10, 98],
        [16, "domínio", 42, 130],
      ]) {
        const a = (deg * Math.PI) / 180;
        const px = n(cx + rad * Math.cos(a));
        const py = n(cy + rad * Math.sin(a));
        out += p(`M${px} ${py}L196 ${ly}H204`, "fs") + c(px, py, 1.8, "ff") + t(208, ly + 3, label);
      }
      return out + arrow(16, 90, 30, 90) + arrow(104, 176, 104, 164);
    },

    hexagonal: () => {
      const cx = 160;
      const cy = 90;
      const port = (deg) => [n(cx + 38.1 * Math.cos((deg * Math.PI) / 180)), n(cy + 38.1 * Math.sin((deg * Math.PI) / 180))];
      const links = [
        [240, 22, 34, "HTTP"],
        [120, 22, 126, "CLI"],
        [300, 248, 34, "banco"],
        [60, 248, 126, "fila"],
      ];
      let out = links.map(([deg, x, y]) => p(`M${x < cx ? x + 50 : x} ${y + 10}L${port(deg).join(" ")}`, "fs")).join("");
      out += hex(cx, cy, 44, "fg fb") + hex(cx, cy, 24, "fg fh");
      for (const [deg, x, y, label] of links) {
        const [px, py] = port(deg);
        out += r(n(px - 3.5), n(py - 3.5), 7, 7, "ff", 1) + r(x, y, 50, 20, "fg fb", 4) + t(x + 25, y + 13.5, label, "ts mid");
      }
      return out + r(137, 84, 46, 12, "fb", 2) + t(160, 93, "domínio", "ts mid") + t(47, 24, "entrada", "tm ts mid") + t(273, 24, "saída", "tm ts mid");
    },

    micro: () => {
      const ys = [22, 74, 126];
      let out = ys.map((y) => p(`M64 90L100 ${y + 16}`, "fs") + p(`M176 ${y + 16}H220`, "fs")).join("");
      out += r(18, 70, 46, 40, "fg fh", 4) + t(41, 124, "gateway", "tm ts mid");
      for (const y of ys) out += r(100, y, 76, 32, "fg fb", 4) + p(`M110 ${y + 12}h30`) + p(`M110 ${y + 21}h46`, "fs") + cyl(240, y + 6, 18, 5, 20);
      return out + t(240, 14, "dados próprios", "tm ts mid");
    },

    events: () => {
      let out = "";
      for (const x of [60, 150, 240]) out += r(x - 28, 20, 56, 26, "fg fb", 4) + p(`M${x - 18} 30h22`) + p(`M${x - 18} 38h30`, "fs") + arrow(x, 46, x, 80);
      out += r(16, 82, 288, 16, "fg fh", 3);
      for (const x of [104, 196, 282]) out += r(x - 6, 86, 12, 8, "fg fb", 1.5) + p(`M${x - 6} 86l6 4 6-4`, "fs");
      for (const x of [85, 175, 265]) out += arrow(x, 100, x, 132) + r(x - 28, 134, 56, 26, "fg fb", 4) + p(`M${x - 18} 144h22`) + p(`M${x - 18} 152h30`, "fs");
      return out + t(22, 76, "publica", "tm ts") + t(22, 118, "assina", "tm ts");
    },
  };

  const KIND_ICON = { app: "app", lib: "package", dist: "download", tool: "wrench", service: "server", profile: "user" };
  const fallback = (kind) => c(160, 90, 44, "fs fd") + `<use href="#i-${KIND_ICON[kind] ?? "app"}" x="136" y="66" width="48" height="48"/>`;
  const svg = (body, cls) => `<svg class="${cls}" viewBox="0 0 320 180" aria-hidden="true">${body}</svg>`;

  /** SVG completo da figura do repo (ou do tipo, para repos sem desenho próprio). */
  const figure = (repo, cls = "pfig") => svg((FIG[repo.name] ?? (() => fallback(repo.kind)))(), cls);
  /** SVG do diagrama de um conceito de arquitetura (id de window.ARCH). */
  figure.concept = (id, cls = "pfig") => svg(CONCEPT[id]?.() ?? "", cls);
  return figure;
})();
