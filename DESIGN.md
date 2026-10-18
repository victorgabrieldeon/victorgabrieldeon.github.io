---
name: Victor Gabriel — Portfólio
description: A single railed column of hairline-ruled panels, monochrome zinc ink, with a hand in the margins.
colors:
  ink: "#09090b"
  ink-soft: "#3f3f46"
  muted: "#71717a"
  paper: "#ffffff"
  paper-raised: "#fafafa"
  surface: "#f4f4f5"
  border: "#e4e4e7"
  hairline: "#ececef"
  fig-ink: "#27272a"
  fig-soft: "#a1a1aa"
  fig-hatch: "#b4b4bb"
  cover-ink: "#a1a1aa"
  cover-lit: "#52525b"
  cover-hatch: "#d9d9de"
  fresh-blue: "#2563eb"
  cal-0: "#ededef"
  cal-1: "#c8c8cd"
  cal-2: "#94949b"
  cal-3: "#55555d"
  cal-4: "#09090b"
  night-paper: "#09090b"
  night-paper-raised: "#101012"
  night-surface: "#18181b"
  night-border: "#2a2a2f"
  night-hairline: "#1e1e22"
  night-ink: "#fafafa"
  night-ink-soft: "#d4d4d8"
  night-muted: "#a1a1aa"
  night-fig-ink: "#d4d4d8"
  night-fig-soft: "#5c5c66"
  night-fig-hatch: "#4a4a52"
  night-cover-ink: "#4f4f58"
  night-cover-lit: "#a1a1aa"
  night-cover-hatch: "#2c2c32"
  night-fresh-blue: "#3b82f6"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
  data:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.25
  data-key:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.08em"
  hand:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "2.125rem"
    fontWeight: 500
    lineHeight: 1.1
  hand-note:
    fontFamily: "Caveat, Segoe Print, cursive"
    fontSize: "1.3125rem"
    fontWeight: 500
    lineHeight: 1
rounded:
  cell: "2px"
  xs: "0.25rem"
  sm: "0.375rem"
  md: "0.5rem"
  plate: "12px"
  full: "50%"
spacing:
  hairline: "1px"
  xs: "0.375rem"
  sm: "0.625rem"
  md: "0.75rem"
  gutter: "1rem"
  sep: "2rem"
  column: "48rem"
  header: "3.5rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: "0 0.875rem"
    height: "2.25rem"
    typography: "{typography.label}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 0.875rem"
    height: "2.25rem"
  button-secondary-hover:
    backgroundColor: "{colors.surface}"
  icon-button:
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.md}"
    size: "2rem"
  icon-button-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
  chip:
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.md}"
    padding: "0 0.75rem"
    height: "2rem"
  chip-pressed:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  tag:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.sm}"
    padding: "0.25rem 0.5rem"
    typography: "{typography.data}"
  list-row:
    padding: "0.75rem 1rem"
  list-row-hover:
    backgroundColor: "{colors.paper-raised}"
  nav-link:
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "0.375rem 0.625rem"
  nav-link-active:
    textColor: "{colors.ink}"
  project-card-plate:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.plate}"
  stack-group:
    textColor: "{colors.ink}"
    padding: "0.875rem 1rem"
  tech-tile:
    textColor: "{colors.ink}"
    padding: "0.875rem 1rem 0.75rem"
  tech-tile-hover:
    backgroundColor: "{colors.paper-raised}"
  mono-glyph:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0 0.3125rem"
    height: "1.5rem"
  arch-cell:
    padding: "0.5rem 0.5rem 1.125rem"
  lang-track:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.cell}"
    height: "0.5rem"
  lang-bar:
    backgroundColor: "{colors.ink}"
    rounded: "{rounded.cell}"
  calendar-cell:
    backgroundColor: "{colors.cal-0}"
    rounded: "{rounded.cell}"
---

# Design System: Victor Gabriel — Portfólio

## Overview

**Creative North Star: "The Ruled Notebook"**

One column, 48rem wide, framed by two vertical rails that run the full height of the page. Every block inside it draws its own foot: a single hairline that runs past the rails to both edges of the window, so the page reads as a ruled sheet. Between sections the ruling breaks into a 2rem band of fine diagonal hatching that also runs full-bleed. The ink is monochrome zinc, light and dark. The drawn marks are figures: an isometric VG cover (Fig. 1), a contribution calendar (Fig. 2), and an authored monochrome diagram per project, set on a dotted drafting plate. A few handwritten notes hang in the margin.

Density is high and quiet: tight 1rem gutters, 0.75rem row padding, 0.8125–0.9375rem body sizes, data set in mono. Hierarchy comes from weight 500 against 400, negative tracking on headings, and the muted grey, never from hue or shadow. Languages and tools are marked with monochrome Simple Icons in current ink; a tool without a brand mark gets a line icon or an ink monogram chip. The page ends in a slim foot (monogram + GitHub) and a giant outline wordmark.

**Key Characteristics:**
- Single railed column (48rem) with full-bleed hairlines drawn by each block's foot.
- Full-bleed hatched 2rem separators between sections.
- Monochrome zinc palette in two themes; blue exists only as a freshness dot.
- Project figures are line diagrams in stroke, hatch and ink on a dotted plate.
- Geist for words, Geist Mono for data, Caveat only for the greeting and margin notes.
- Flat surfaces; depth is ruling, not shadow.

## Colors

Monochrome zinc ink on white (or near-black at night), with one functional blue.

### Primary
- **Ink** (`ink` / `night-ink`): headings, names, brand icons, language bars, the pressed chip and primary button fill, focus ring, selection background. Ink is the accent.

### Tertiary
- **Fresh Blue** (`fresh-blue` / `night-fresh-blue`): the 7px dot on a project icon box and the 6px dot beside a card's freshness meta, marking a push in the last 7 days. Nothing else.

### Neutral
- **Soft Ink** (`ink-soft`): bullets, tag text, card summaries, icon buttons at rest, secondary prose.
- **Muted Zinc** (`muted`): nav links at rest, meta lines, counts, captions, mono labels, muted figure text.
- **Paper** (`paper` / `night-paper`): page background; header is paper at 84% with a 12px blur; the project-page cover plate.
- **Raised Paper** (`paper-raised`): tag fills, list-row hover, and the card figure plate.
- **Surface** (`surface`): button and icon-button hover, row press, icon boxes, the language-bar track.
- **Border** (`border`): outlines of chips, tags, buttons and figure plates; the dashed split in the info panel; the wordmark stroke; hatch stroke at 75%.
- **Hairline** (`hairline` / `night-hairline`): rails, full-bleed panel feet, row dividers, lined-grid cells. Lighter than Border on purpose.
- **Figure Ink / Soft / Hatch** (`fig-ink`, `fig-soft`, `fig-hatch`): strokes, secondary strokes and hatching inside project diagrams.
- **Cover Ink / Lit / Hatch** (`cover-ink`, `cover-lit`, `cover-hatch`): the isometric VG cover only; light and dark swap which face reads lit.
- **Calendar Steps** (`cal-0`…`cal-4`): five grey steps for the contribution graph, inverted in dark mode (`#1a1a1d`, `#3a3a41`, `#6b6b74`, `#b0b0b8`, `#fafafa`).

### Named Rules
**The Seven-Day Blue Rule.** Blue marks recent activity and nothing else: no links, buttons, focus, hover or data in blue.

**The Ink-As-Accent Rule.** Emphasis is ink on paper (pressed chip, primary button, selection, language bars). If something needs to stand out, invert it; don't tint it.

**The Monochrome Brand Rule.** Language and tool marks render as single-colour Simple Icons in `currentColor`; brand or GitHub language colours never enter the page.

## Typography

**Body Font:** Geist (with ui-sans-serif, system-ui)
**Label/Mono Font:** Geist Mono (with ui-monospace, Menlo)
**Hand Font:** Caveat (with Segoe Print, cursive)

**Character:** a technical grotesque with its mono twin, interrupted by a pen. Weights stay at 400/500 (600 only for readme bold, the tool monogram chip and the wordmark).

### Hierarchy
- **Display** (500, 2rem, 1.15, -0.03em; 1.625rem under 40rem): the name in the identity block. The projects page head is 2.25rem, 1.1, -0.035em; project pages use clamp(1.75rem, 5vw, 2.25rem).
- **Headline** (500, 1.875rem, 1.2, -0.03em): panel heads, with a muted superscript count. Small heads: 1.25rem, -0.02em.
- **Title** (500, 1.0625rem, 1.3, -0.01em): card, featured project and architecture titles; list-row, stack group, tool and language names at 0.875–0.9375rem.
- **Body** (400, 0.9375rem, 1.7): about bullets, readme, page lede; card summaries and architecture notes 0.875rem/1.55; meta and captions at 0.8125rem.
- **Label** (500, 0.875rem): nav, buttons, social links, chips (0.8125rem).
- **Data** (Geist Mono 400, 0.75rem): tags, counts, tagline, filter status, Fig. labels, info rows, percentages, stack group counts and tool usage meta (0.6875rem), diagram text (8px / 7px), code (0.8125rem).
- **Data Key** (Geist Mono 500, 0.6875rem, 0.08em, uppercase): definition-list keys in the project meta grid only.
- **Hand** (Caveat 500, 2.125rem / 1.3125rem): the greeting line, and margin notes beside the column.

### Named Rules
**The Mono-Is-Data Rule.** Geist Mono sets numbers, counts, identifiers, figure labels, diagram text and code. Prose and headings never use it.

**The One Pen Rule.** Caveat appears only in the greeting and in margin notes with their hand-drawn arrows. It never labels UI or carries information the page doesn't also state.

## Layout

The rail is `min(48rem, 100% - 1rem)` centered, with 1px Hairline borders left and right. Inside, blocks stack with no margins between them; each block's padding is its spacing (gutter 1rem horizontally, 0.5–1rem vertically). Each block's `::after` draws a 1px Hairline from -100vw to +100vw at its foot; each separator's `::before` paints its hatching from -100vw to +100vw behind the rails; `html` and `body` use `overflow-x: clip` to cut the excess. The header is sticky, 3.5rem tall.

Grids inside panels (stack tool grids, architecture cells, project cards, project meta) are lined: each cell draws `1px 0 0` and `0 1px 0` box-shadows in Hairline, so the grid reads as ruled without doubled borders. The stack is a set of group rows split by a 1px Hairline: a 10rem group column with a Hairline right rule, then a tool grid of `repeat(auto-fill, minmax(9rem, 1fr))` paper-filled tiles whose unfilled tracks show a faint 315° hatch (Hatch at 60%, 10px tile). Under 40rem each row stacks (group above a Hairline, 0.625rem 1rem) and tools run 2 columns. Architecture runs 2 columns, with a hatched fill cell closing an odd count; 1 column under 40rem, fill hidden. Project cards run 2 columns (1 under 36rem). Languages are rows: icon, name, bar, percentage (bar wraps below under 36rem). The info panel splits into two columns divided by a 1px dashed Border, stacking with a hairline under 40rem.

Breakpoints: from 40.0625rem up, the identity row rises 2.75rem over the cover's foot, its top hairline drawn only outside the figure. Under 40rem the nav becomes a horizontally scrolling strip with a faded right edge, and the name drops to 1.625rem. Margin notes appear only at 76rem and up, outside the rails.

### Named Rules
**The Ruled Foot Rule.** A block never gets a border-box. It draws only its bottom hairline, full-bleed to the window edges.

**The Hatched Break Rule.** Sections are separated by a full-bleed 2rem band of 315° hatching (1px stroke, 10px tile), never by whitespace alone.

## Elevation & Depth

Flat. No surface casts a shadow. Depth is conveyed by rails, hairlines, hatching, the dotted figure plate, and the frosted sticky header (paper at 84%, `blur(12px) saturate(1.3)`). `box-shadow` is used only as a drawing tool: 1px hairline cell rules and a 2px paper-coloured ring that lifts the blue dot off its icon box.

### Named Rules
**The Shadow-Is-A-Pen Rule.** box-shadow draws lines (1px rules, 2px knock-out rings), never blur or offset elevation.

## Shapes

Small, consistent radii: 0.5rem for interactive controls (buttons, chips, icon buttons, nav, code blocks), 0.375rem for tags, icon boxes, tool monogram chips and tooltips, 0.25rem for inline focus targets, 2px for calendar cells and language bars, 50% for the avatar, dots and bullets. The one larger curve is the figure plate (12px), which frames drawings, not content. Panels, rows, cards and the column itself are square; the ruling is rectilinear. Figures are drawn with strokes, hatch patterns and sparse ink fills.

## Components

### Buttons
- **Shape:** 0.5rem radius, 2.25rem tall, 0 0.875rem padding, label type.
- **Primary:** ink fill, paper text; hover mixes 84% ink into paper.
- **Secondary:** 1px Border outline; hover fills Surface.
- **Press:** every control scales to 0.95 in 60ms and eases back with `cubic-bezier(0.16, 1, 0.3, 1)`.

### Chips
- **Style:** 2rem tall, 1px Border, Soft Ink label, mono count.
- **State:** pressed chip is ink with paper text; the fill is a shared pill that grows from the center via `clip-path` over 0.45s.
- **Filter status:** a mono 0.75rem/1.5 muted line under the chips (0.5rem 1rem, Hairline foot). Its inline link is ink with a 1px Border underline at a 3px offset that turns `currentColor` on hover.

### Tags
- Raised Paper fill, 1px Border, 0.375rem radius, Data type, optional 0.8125rem monochrome brand icon.

### Lists
- **Rows:** square, 0.75rem 1rem padding, hairline between rows, Raised Paper on hover, Surface on press; icon box, name + summary, mono side meta.
- **Featured items:** expand in place with a `grid-template-rows` transition (0.45s); the chevron rotates.
- **More row:** a centered, hairline-topped row holding a secondary button with a mono count.

### Project Cards
- Square cells in a lined 2-column grid, 0.5rem inset. On top, the figure plate: 16/9, 12px radius, 1px Border, Raised Paper dotted with a 14px grid of 1px dots at 10% ink, a mono caption at its lower right. Below: title, 0.875rem summary and mono meta (language icon, freshness with the blue dot).
- **Hover / Focus:** the plate border darkens to 30% ink, the diagram scales to 1.035 over 0.6s, dashed strokes start running, and a small arrow slides in beside the title.

### Project Figures
- 320×180 SVG diagrams of what each project does, in a closed vocabulary: stroke (1.25), soft stroke (1), dashed (3 3), two hatch fills with stroke, hatch without stroke, light ink wash (10%), solid ink, plate-coloured knock-out; text in mono 8px with muted, inverted, 7px-small and centered variants. Arrowheads stay solid even on dashed shafts. Architecture concept diagrams use the same vocabulary. New figures use only this vocabulary.
- On the project page the same figure becomes the cover: dotted plate on Paper, square, clamp(10.5rem, 36vw, 17rem) tall.

### Stack Rows & Language Rows
- **Stack group:** 0.875rem/500 name with a muted mono 0.6875rem count at its right (baseline-aligned), 0.875rem 1rem padding, a 1px Hairline right rule.
- **Tool tile:** a column at 0.875rem 1rem 0.75rem padding: a 1.5rem ink brand icon in a 1.75rem slot (0.5rem below), a 0.875rem/500 name and, when projects use the tool, a muted mono 0.6875rem/1.4 meta ("em N projetos", or "em <projeto>" for one) ending in a 0.75rem arrow, ellipsised on overflow.
- **Tool link:** a tile with projects links to that project, or to the projects page filtered by the tool. Hover fills Raised Paper (0.15s), lifts the icon 2px (0.35s ease), turns the meta ink and nudges the arrow 2px up-right; the focus ring sits inset (-2px).
- **Monogram chip:** a tool without a brand mark or line icon shows its glyph in a 1.5rem-tall ink chip (min 1.5rem wide, 0 0.3125rem padding, 0.375rem radius), paper text in Geist Mono 600 0.75rem, -0.02em.
- **Languages:** each row is icon, name, a 0.5rem Surface track with an ink bar (2px radius), and a tabular mono percentage.

### Architecture Grid
- A lined 2-column grid of concept cells (0.5rem 0.5rem 1.125rem padding, 0.375rem gap). Each cell reuses the dotted 16/9 figure plate with a concept diagram and a mono "Fig. N" caption (numbered after Fig. 2), then a 1.0625rem/500 name (-0.01em) and a 0.875rem/1.55 Soft Ink sentence, both inset 0.5rem. Cells are static: no hover.
- An odd count closes with a hatched fill cell (315°, Hatch, 10px tile). Under 40rem the grid is one column and the fill is hidden.

### Navigation
- Sticky frosted bar with the VG monogram at left, muted 0.875rem links that turn ink on hover/current, a 1px divider, then 2rem icon buttons. Under 40rem the links become a scroll strip.

### Contribution Calendar (Fig. 2)
- Week columns of 2px-radius cells in the five Calendar Steps, a mono "Fig. 2" label, a Less→More scale, and a small ink tooltip. Cells fade in by week on load.

### Foot & Wordmark
- A slim foot row: monogram at left, GitHub icon button at right. Below the column, the name set as a 176px Geist 600 outline wordmark in a 1px Border stroke.

### Margin Notes
- Caveat 1.3125rem notes with a hand-drawn SVG arrow, hung outside the rails left or right; shown only at 76rem+.

## Do's and Don'ts

### Do:
- **Do** let each block draw its own full-bleed foot hairline in Hairline; never box a panel.
- **Do** separate sections with the full-bleed 2rem hatched band.
- **Do** set counts, dates, identifiers and figure labels in Geist Mono at 0.6875–0.8125rem.
- **Do** emphasize by inverting to ink (pressed chip, primary button, language bar), and keep weights at 400/500.
- **Do** draw grid rules with 1px box-shadow cells so lines never double.
- **Do** render language and tool marks as monochrome Simple Icons in `currentColor`; a tool without a mark gets a line icon or the ink monogram chip.
- **Do** draw project figures only with the figure vocabulary, on the dotted plate.
- **Do** honor `prefers-reduced-motion`: intro animations collapse to a 0.4s fade.

### Don't:
- **Don't** use blue for anything except the 7-day freshness dot.
- **Don't** colour languages or brands; no per-language hues, dots or multicolour bars.
- **Don't** use Caveat for UI labels, headings or data.
- **Don't** use mono for prose or headings.
- **Don't** add drop shadows, gradient fills, or hover lifts on surfaces; they stay flat.
- **Don't** round panels, rows, cards or the column; only the figure plate takes the 12px curve.
- **Don't** introduce a second column or sidebar layout; the page is one railed column.
