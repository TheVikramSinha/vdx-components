# VeriDex One Portal — Build Instructions · Theme v1 "Rust"

**Applies to:** the `veridex-portal/` skeleton (Rust theme, the official VeriDex brand palette).
**Audience:** engineers and AI coding assistants building portal pages on this skeleton.
**Status:** mandatory. Every rule marked **MUST** is required. A page that breaks a MUST rule fails review.

> **AI assistants:** Read [§0 Rules for AI assistants](#0-rules-for-ai-assistants) first, and follow it exactly. When this document and your own preferences disagree, this document wins. Do not improvise outside it.

---

## Contents

0. [Rules for AI assistants](#0-rules-for-ai-assistants)
1. [What this skeleton is](#1-what-this-skeleton-is)
2. [Theme: v1 Rust](#2-theme-v1-rust)
3. [File structure and ownership](#3-file-structure-and-ownership)
4. [Core concept: page = route + template + slots](#4-core-concept-page--route--template--slots)
5. [Procedure A — Add a new module](#5-procedure-a--add-a-new-module)
6. [Procedure B — Add or change a page](#6-procedure-b--add-or-change-a-page)
7. [Procedure C — Fill a slot with real content](#7-procedure-c--fill-a-slot-with-real-content)
8. [Procedure D — Add module components and styles](#8-procedure-d--add-module-components-and-styles)
9. [Template reference](#9-template-reference)
10. [API reference](#10-api-reference)
11. [Class reference](#11-class-reference)
12. [Alignment rules](#12-alignment-rules)
13. [Accessibility rules](#13-accessibility-rules)
14. [Security and data rules](#14-security-and-data-rules)
15. [US formatting rules](#15-us-formatting-rules)
16. [Prohibited actions](#16-prohibited-actions)
17. [Definition of done checklist](#17-definition-of-done-checklist)

---

## 0. Rules for AI assistants

Follow these steps in order for every task.

1. **Identify the task type.** It is exactly one of:
   - Add a module → [Procedure A](#5-procedure-a--add-a-new-module)
   - Add or change a page → [Procedure B](#6-procedure-b--add-or-change-a-page)
   - Put real content into a page → [Procedure C](#7-procedure-c--fill-a-slot-with-real-content)
   - Build a module-specific component → [Procedure D](#8-procedure-d--add-module-components-and-styles)

   If the task fits none of these, stop and ask the human. Do not invent a new pattern.
2. **Read before writing.** Before editing, read these files in full: `index.html`, `assets/js/core/registry.js`, `assets/js/core/templates.js`, `assets/css/tokens.css`, and any page file you will touch.
3. **Edit only the files the procedure names.** The files under `assets/js/core/` and the files `tokens.css`, `base.css`, `layout.css` and `primitives.css` are **locked**. Do not edit them unless the human explicitly says "change the core". If a task seems to need a core change, stop and explain why, and do not make the change.
4. **Use only names that exist.** Use only the templates, slot names, options, classes, tokens, icons and APIs listed in this document. If you need something that is not listed, stop and ask.
5. **Never hard-code a colour, size, spacing value or font.** Use the tokens in [§2](#2-theme-v1-rust) and [§11](#11-class-reference).
6. **Keep this theme.** Do not add or link any theme file. This skeleton uses `tokens.css` only. (The Harbor theme lives in a different skeleton.)
7. **Run the checklist.** When done, go through [§17](#17-definition-of-done-checklist) item by item, and report each result as pass or fail.
8. **Report what you changed:** list every file you created or edited, and give a one-line reason for each.

---

## 1. What this skeleton is

- A vanilla HTML/CSS/JS portal shell. There is no framework and no build step. It runs from `file://` or any static host.
- It is built on:
  - the VeriDex Brand Guidelines v1.0
  - the Veridex One Platform L3 v4.20 Physical ERD: multi-tenant, Foundation plus sellable modules, entitlements, OPA authorization
- **Standards it targets:**
  - WCAG 2.2 AA and Section 508
  - USWDS error-summary pattern
  - NIST SP 800-63B sessions and MFA
  - NIST 800-53 AC-8 system-use notice
  - CCPA/CPRA privacy links
  - US formats for dates, currency, phone and ZIP
- **The shell already provides:** top bar, tenant switcher, sidebar navigation, breadcrumbs, page header, command palette (Ctrl/⌘+K), notifications, user menu, theme and density switches, toasts, session timeout, unsaved-changes guard, error pages and footer. **Do not rebuild any of these.**

To run it, open `index.html` in a browser. The sign-in screens are at `auth/login.html`.

---

## 2. Theme: v1 "Rust"

### 2.1 Theme files

| File | Role |
|---|---|
| `assets/css/tokens.css` | The **only** colour source for this skeleton. It holds the brand palette (`--vx-*`) and the semantic tokens (`--color-*`). |

There is **no** theme override file in this skeleton. Do **not** add `theme-harbor.css` or any other theme file.

### 2.2 Semantic colour tokens (light mode)

Components **MUST** use these `--color-*` names. Never use `--vx-*` brand tokens or hex values in components.

| Token | Value | Use for |
|---|---|---|
| `--color-bg` | `#FDF9EE` Warm Ivory | Page background |
| `--color-surface` | `#FFFFFF` | Cards, inputs, top bar, sidebar |
| `--color-surface-alt` | `#F9ECDE` Soft Beige | Table headers, hover, alt panels |
| `--color-surface-sunken` | `#F6EFE2` | Read-only and disabled inputs |
| `--color-border` | `#E4DCD3` Warm Grey | Default borders and dividers |
| `--color-border-strong` | `#CBBFB2` | Input borders, secondary button border |
| `--color-text` | `#3F1C09` Ink | All body text (14.5:1) |
| `--color-text-muted` | `#6B5243` | Secondary text, captions, hints |
| `--color-text-heading` | `#903018` Rust | Headings (7.6:1) |
| `--color-text-overline` | `#C54A1E` Ember | Overline labels |
| `--color-link` / `--color-link-hover` | `#903018` / `#C54A1E` | Links |
| `--color-primary` | `#903018` Rust | Primary buttons, active states |
| `--color-primary-hover` / `-active` | `#7A2814` / `#64200F` | Primary button states |
| `--color-on-primary` | `#FFFFFF` | Text on primary (8.0:1) |
| `--color-primary-subtle` | `#E9D6D1` | Active nav, selected rows, brand badge |
| `--color-accent` | `#EB854A` Coral | Highlights, chart emphasis. **Never text on light backgrounds** |
| `--color-accent-subtle` | `#FBE7DB` | Soft highlight backgrounds |
| `--color-on-accent` | `#3F1C09` | Text on coral (5.8:1) |
| `--color-focus` | `#44768C` Steel | Focus ring |
| `--color-success` / `-subtle` | `#367467` / `#D7E3E1` | Success |
| `--color-info` / `-subtle` | `#44768C` / `#DAE4E8` | Info |
| `--color-warning` / `-subtle` | `#8A5510` / `#F1E4D3` | Warning |
| `--color-danger` / `-subtle` | `#B42318` / `#FBE4E1` | Errors, destructive actions |
| `--color-series-1…6` | Rust, Teal, Steel, Ochre, Coral, Rust-60 | Chart series, in this order |
| `--color-gradient-brand` | Rust → Ember → Coral | Footer bar, auth panel, 404 numerals only |
| `--color-gradient-accent` | Ember → Coral | Avatar only |
| `--color-inverse-bg` / `-text` | Ink / White | Toasts |
| `--color-overlay` | Ink at 45% | Dialog and drawer backdrops |
| `--color-wordmark-veri` / `-dex` | Ink / Ember | Wordmark (dark mode: Ivory / Ember) |

Dark mode values live in `[data-theme="dark"]` in `tokens.css`. Do not redefine them anywhere else.

### 2.3 Colour usage rules (from the brand guide)

1. **Ratio:** 60% neutral (Ivory, Beige, White), 25% Rust and Ink, 10% Coral and Ember, 5% secondary (Teal, Steel, Ochre).
2. **One primary button per view region**, in Rust.
3. Coral **MUST NOT** be used as text on light backgrounds (2.5:1 fails). White on Coral also fails (2.6:1).
4. Neutral Grey `#A4A7AB` is for icons and large text only (2.3:1).
5. Errors **MUST** use `--color-danger`. Never use Rust for errors: Rust means "primary action".
6. Gradients are for big brand moments only. Never put them behind body text.
7. The logo and wordmark are never recoloured, stretched, rotated or given effects (brand p.19).

### 2.4 Typography (shared by both themes)

| Token | Value |
|---|---|
| `--font-display` | Manrope: headings, buttons, overlines, KPIs, tabs |
| `--font-body` | Source Sans 3: body, UI, tables, forms |
| `--font-mono` | JetBrains Mono: IDs, codes, references |
| App scale | `--fs-page-title` 28 · `--fs-section` 20 · `--fs-card-title` 16 · `--fs-ui` 15 · `--fs-small` 14 · `--fs-caption` 13 · `--fs-kpi` 32 |
| Brand scale | `--fs-display` 56 · `--fs-h1` 40 · `--fs-h2` 32 · `--fs-h3` 24. Use these only on auth, empty and system pages |

---

## 3. File structure and ownership

```
veridex-portal/
├── index.html                       SHELL — edit only to add <script>/<link> tags and icons (§5, §8)
├── auth/login.html                  Auth screens — do not edit for module work
├── assets/
│   ├── css/
│   │   ├── tokens.css               LOCKED (theme source)
│   │   ├── base.css                 LOCKED
│   │   ├── layout.css               LOCKED
│   │   ├── primitives.css           LOCKED
│   │   ├── auth.css                 LOCKED
│   │   └── modules/<module>.css     YOURS — one file per module
│   ├── js/
│   │   ├── core/*.js                LOCKED except registry.js (Procedure A only)
│   │   ├── modules/<module>/*.js    YOURS — module components
│   │   ├── pages/<module>.pages.js  YOURS — one file per module
│   │   ├── pages/_page-template.js  Reference — copy, do not edit
│   │   ├── pages/examples.pages.js  Examples — delete once real pages exist
│   │   └── app.js                   LOCKED
│   └── img/                         Brand assets (logomark.svg and favicon.svg are PLACEHOLDERS)
└── README.md
```

**Script load order in `index.html`** (MUST be preserved):

```
core/utils → core/config → core/auth → core/registry → core/router → core/templates → core/shell
→ modules/<module>/*.js → pages/*.js → app.js
```

**Stylesheet order** (MUST be preserved): `tokens.css → base.css → layout.css → primitives.css → modules/*.css`.

---

## 4. Core concept: page = route + template + slots

- **Route:** a URL pattern such as `/claims/:id`, plus metadata: title, gate, options.
- **Template:** one of `dashboard`, `list`, `detail`, `form`, `wizard`, `settings`, `report`, `blank` or `system`. The template fixes the layout.
- **Slots:** named regions inside a template. A slot you don't fill shows a skeleton placeholder. Filling a slot replaces only that region.

You never write page layout from scratch. Pick a template and fill its slots.

**Conventional routes.** Each module in `registry.js` gets four routes automatically:

| Path | Template | Title | Permission |
|---|---|---|---|
| `<base>` | `dashboard` | `<label>` | `<id>.read` |
| `<base>/list` | `list` | `All <label>` | `<id>.read` |
| `<base>/new` | `form` | `New <record>` | `<id>.create` |
| `<base>/:id` | `detail` | `<record> <id>` | `<id>.read` |

To customise one of these, register a route with **the same path** in your page file. The later registration merges over the conventional one.

To see every slot name on screen, open the user menu and turn on **Show slot labels (dev)**.

---

## 5. Procedure A — Add a new module

**Files you may edit:** `assets/js/core/registry.js` (the `modules` array only) and `index.html` (script tags and icon sprite only).

1. Open `assets/js/core/registry.js`.
2. Add **one** object to the `modules` array, placed in its nav group order. Fill **every** field:

   ```js
   { id: 'fleet', group: 'core', label: 'Fleet', long: 'Fleet & Telematics', schema: 'fleet', base: '/fleet', record: 'Vehicle', icon: 'card' },
   ```

   | Field | Rule |
   |---|---|
   | `id` | Lowercase, no spaces. It is used as the entitlement key and permission prefix (`fleet.read`). Must be unique. |
   | `group` | One of `workspace`, `core`, `product`, `distribution`, `finance`, `insight`, `admin` |
   | `label` | 1–2 words, shown in the sidebar |
   | `long` | Full module name. It appears as the page overline |
   | `schema` | The owning DB schema name from the ERD |
   | `base` | URL base: lowercase, starts with `/`, no trailing slash, unique |
   | `record` | Singular noun in Title Case (`Vehicle`), used in "New vehicle" and "Vehicle 123" |
   | `icon` | An existing icon id from [§10.6](#106-icons). To add a new one, see step 4 |

3. Add the module `id` to `VX.session.entitlements` in `assets/js/core/auth.js` **only** for local testing. In production, entitlements come from the API.
4. **New icon (optional):** in `index.html`, inside the hidden `<svg>` sprite, add `<symbol id="i-<name>" viewBox="0 0 24 24">…</symbol>`. The symbol must be a 24×24, stroke-only path with no `fill` and no colour attributes.
5. Create `assets/js/pages/<id>.pages.js` from `_page-template.js` (see [Procedure B](#6-procedure-b--add-or-change-a-page)).
6. Add `<script src="assets/js/pages/<id>.pages.js"></script>` to `index.html`, **above** `app.js` and below the other page files.
7. Verify that the sidebar shows the module, and that `<base>`, `<base>/list`, `<base>/new` and `<base>/ABC-1` all render.

---

## 6. Procedure B — Add or change a page

**Files you may edit:** `assets/js/pages/<module>.pages.js` only.

1. If the file doesn't exist, create it with this exact wrapper:

   ```js
   /* <Module long name> — pages */
   (window.VX.pageQueue = window.VX.pageQueue || []).push(function (VX) {
     'use strict';
     const { html, raw, icon, fmt } = VX.utils;
     const { card, empty, field } = VX.ui;

     // VX.pages.register({ ... }) calls go here

   });
   ```

2. Choose the template by intent. **Do not choose by appearance.**

   | The page's job | Template |
   |---|---|
   | Overview of a module, or a landing page with KPIs | `dashboard` |
   | Many records: queue, search results, register | `list` |
   | One record with sections | `detail` |
   | Create or edit in one screen (≤ 3 sections) | `form` |
   | Create in steps (≥ 4 sections, or steps that depend on each other) | `wizard` |
   | Configuration and preferences | `settings` |
   | Analytics, bordereaux, regulatory output | `report` |
   | Anything else (legal text, help) | `blank` |

3. Register the route. Use only the fields below.

   ```js
   VX.pages.register({
     path: '/fleet/:id',                         // REQUIRED. ':name' becomes ctx.params.name
     template: 'detail',                         // REQUIRED. See §9
     module: 'fleet',                            // REQUIRED for module pages (entitlement gate)
     permission: 'fleet.read',                   // REQUIRED. '<module>.<action>'
     title: (ctx) => `Vehicle ${ctx.params.id}`, // REQUIRED. String or function
     description: 'One sentence, plain language.', // optional, ≤ 140 chars
     overline: 'Workspace',                      // optional; only for non-module pages
     crumbs: [{ label: 'Home', path: '/' }],     // optional; omit for automatic breadcrumbs
     options: { /* template options, §9 */ },    // optional
     actions: (ctx) => html`…`,                  // optional; replaces the template's header buttons
     slots: { /* 'slot-name': (ctx) => html`…` */ }, // optional, §7
     async onMount(ctx, el) { /* load data */ }, // optional, §7
     onLeave(ctx) { /* cleanup */ },             // optional
   });
   ```

4. **Permission naming** MUST be `<moduleId>.<action>`, where the action is one of `read`, `create`, `update`, `delete`, `approve`, `export`, or a documented sub-resource (`claims.reserve.update`).
5. **Title rules:**
   - Use sentence case ("New vehicle", not "New Vehicle").
   - A record title is `<Record> <identifier>`.
   - Never put the status in the title. Use the `status` slot instead.
6. **Header actions rules** (when you supply `actions`):
   - Use at most 3 visible buttons, plus one overflow `⋯` button.
   - Order them left to right: secondary buttons, **then the single primary button**, then overflow.
   - All buttons use the same size, with no `vx-btn--sm` in the page header.
   - Return the buttons directly (siblings). **Do not wrap them in a `div`.**

   ```js
   actions: () => html`
     <button class="vx-btn vx-btn--secondary" type="button">${icon('download')} Export</button>
     <a class="vx-btn vx-btn--primary" href="#/fleet/new">${icon('plus')} Add vehicle</a>
     <button class="vx-btn vx-btn--secondary vx-btn--icon" type="button" aria-label="More actions">${icon('more')}</button>`,
   ```

7. Open the route in the browser and confirm it renders with no console errors.

---

## 7. Procedure C — Fill a slot with real content

You can fill a slot in two ways. Use **(a)** for static content and **(b)** for loaded data.

**(a) Static — via `slots`:**

```js
slots: {
  status: () => html`<span class="vx-badge vx-badge--success">Active</span>`,
  'tab-documents': () => card({ title: 'Documents', body: empty({ icon: 'folder', title: 'No documents yet', body: 'Uploaded files appear here.' }) }),
},
```

**(b) Loaded data — via `onMount`:**

```js
async onMount(ctx, el) {
  const target = el.querySelector('[data-slot="overview-main"]');
  const data = await fetch(`/api/v1/fleet/vehicles/${encodeURIComponent(ctx.params.id)}`, { credentials: 'include' }).then((r) => r.json());
  target.innerHTML = String(card({ title: 'Vehicle', body: html`
    <dl class="vx-grid vx-grid--3">
      <div class="vx-kv"><dt>VIN</dt><dd class="vx-mono">${fmt.mask(data.vin, 6)}</dd></div>
      <div class="vx-kv"><dt>Garaging ZIP</dt><dd>${fmt.zip(data.zip)}</dd></div>
      <div class="vx-kv"><dt>Stated value</dt><dd class="vx-num">${fmt.currency(data.value, data.currency_code)}</dd></div>
    </dl>` }));
},
```

**Rules:**
1. Always build HTML with `` html`…` ``. It escapes every value. Use `raw()` only for markup you wrote yourself, never for API data.
2. Always assign `String(html`…`)` to `innerHTML`.
3. **Keep the slot wrapper.** Replace the slot's *content*, never the `[data-slot]` element itself.
4. Until data arrives, leave the skeleton in place. Don't add your own spinner.
5. **On load failure:**
   - Put a `vx-alert vx-alert--danger` inside the slot, with a retry button.
   - Don't break the whole page.
   - Never show raw error text from the server.
6. **On empty results,** use `VX.ui.empty({...})` inside the slot.
7. **List events:** listen with `el.addEventListener('vx:search', …)` (`e.detail.q`) and `el.addEventListener('vx:sort', …)` (`e.detail.column`, `e.detail.direction`).
8. **Form submit:** listen to `vx:submit` on the page element (`e.detail.data` is a plain object). Validation has already passed when this fires.
9. Clean up timers and `AbortController`s in `onLeave`.

---

## 8. Procedure D — Add module components and styles

**Files you may create:** `assets/js/modules/<module>/<component>.js` and `assets/css/modules/<module>.css`.

1. A component is a function that returns `` html`…` ``. Attach it to `VX.<module>`:

   ```js
   (function (VX) {
     'use strict';
     const { html, fmt } = VX.utils;
     VX.fleet = VX.fleet || {};
     VX.fleet.vehicleRow = (v) => html`<tr><td class="vx-mono">${v.unit}</td><td>${v.make}</td><td class="is-num">${fmt.currency(v.value)}</td></tr>`;
   })(window.VX);
   ```

2. Load it in `index.html` **after** `core/shell.js` and **before** the page files.
3. **Module CSS rules:**
   - Prefix every class `vx-<module>-` (for example `.vx-fleet-map`).
   - Use only `var(--color-*)`, `var(--space-*)`, `var(--radius*)`, `var(--fs-*)`, `var(--font-*)` and `var(--shadow-*)` tokens.
   - **No hex, rgb or named colours, and no px for spacing or colour.** The only px allowed are borders (1px or 2px) and fixed media sizes.
   - Never override `.vx-*` core classes. Never use `!important`.
   - Link the file in `index.html` after `primitives.css`.
4. Before you create a component, check [§11](#11-class-reference). If a core class already does the job, use it.

---

## 9. Template reference

Slot names are a contract. Spell them exactly.

### 9.1 `dashboard`
- **Options:** `kpis: ['Label', …]`, up to 4 KPI labels.
- **Slots:** `actions`, `filters`, `kpis`, `primary`, `side`, `panel-1`, `panel-2`, `panel-3`, `activity`
- **Layout:**
  - filter row
  - KPI row (auto-fit tiles)
  - 2:1 row (`primary` | `side`)
  - 3-column row (`panel-1..3`)
  - full-width `activity`

### 9.2 `list`
- **Options:**
  - `views: ['All', …]`: saved-view tabs
  - `columns: [{ label, sort?: true, num?: true }]`: `num` right-aligns with tabular figures
  - `selectable: true|false`: row checkboxes and bulk bar
  - `createLabel: 'New vehicle'`
- **Slots:** `actions`, `views`, `toolbar`, `filters`, `bulk-actions`, `table`, `pagination`
- **Rules:**
  - Money and number columns **MUST** set `num: true`.
  - The **first** column holds the record identifier, and it links to the detail page.
  - Use 4–8 columns.

### 9.3 `detail`
- **Options:**
  - `tabs: ['Overview', …]`: Overview must be first
  - `summary: ['Label', …]`: 4–6 key facts
- **Slots:**
  - `actions`, `status`, `meta`
  - `tab-<slug>` for every tab
  - `overview-main`, `overview-secondary`, `rail-tasks`, `rail-timeline`, `audit` (all inside Overview)
- `<slug>` is the tab label in lowercase, with non-alphanumerics replaced by `-`. For example, "Locations & vehicles" becomes `tab-locations-vehicles`.
- The **audit** card shows created and updated info, `row_version` and tenant. Every record page **MUST** keep it (ERD standard columns).
- `?tab=<slug>` in the URL deep-links to a tab.

### 9.4 `form`
- **Options:**
  - `sections: ['General information', …]`: 1–3 sections
  - `submitLabel: 'Save'`
- **Slots:** `actions`, `intro`, `section-1`, `section-2`, … (numbered from 1), `help`, `footer`
- Section 1's default content is the **reference field pattern**. Replace it with real fields that use `VX.ui.field()`.

### 9.5 `wizard`
- Same as `form`, but uses `steps: [...]` instead of `sections`. Use 4–7 steps.
- The current step comes from `?step=n`. Only that step's section renders.
- Continue moves to `?step=n+1` after validation passes.
- The last step's button reads `submitLabel` (default "Submit").

### 9.6 `settings`
- **Options:** `sections: ['Profile', …]`
- **Slots:** `actions`, `section-<slug>` for each section
- The left navigation scrolls to each section.

### 9.7 `report`
- **Slots:** `actions`, `filters` (left rail), `kpis`, `canvas` (chart), `table`
- The page is full width.

### 9.8 `blank`
- **Slots:** `actions`, `content`

### 9.9 `system`
- **Options:** `code: '404' | '403' | '500' | 'not-licensed' | 'maintenance' | 'offline'`
- **Do not register new system pages.** The router and gates pick them automatically.

---

## 10. API reference

### 10.1 `VX.pages`
| Call | Purpose |
|---|---|
| `VX.pages.register(def)` | Register or override one route |
| `VX.pages.registerAll([def, …])` | Register several |

### 10.2 `VX.router`
| Call | Purpose |
|---|---|
| `VX.router.go('/path', { replace })` | Navigate in code. **Use `<a href="#/path">` for links instead** |
| `VX.router.current` | `{ route, params, query, path }` |

### 10.3 `VX.utils`
| Name | Purpose |
|---|---|
| `` html`…` `` | Escaping template literal. Returns safe HTML |
| `raw(str)` | Marks trusted markup. **Never use it on API data** |
| `icon(name, cls?)` | An inline SVG icon from the sprite |
| `$`, `$$`, `on(root, evt, sel, fn)` | DOM query and delegation |
| `debounce(fn, ms)` | Debounce |
| `store.get/set/remove(key)` | UI preferences only. **Never tokens or PII** |
| `announce(msg, 'polite'|'assertive')` | Screen-reader announcement |

### 10.4 `VX.ui`
| Name | Purpose |
|---|---|
| `card({ title, body, h, flush, actions })` | Standard card. `body` defaults to a skeleton block of height `h` |
| `empty({ icon, title, body, action })` | Empty state |
| `field({ id, label, type, required, hint, cols, attrs, options })` | Form field in the standard pattern. `cols` is 3, 4, 6, 8 or 12. `options` (an array) makes it a `<select>` |
| `toast(message, { type: 'info'|'success'|'danger', timeout, action })` | Notification. `danger` toasts stay until dismissed |
| `sk(cls, h)`, `skw(width)`, `lines(n)` | Skeleton pieces |
| `slug(text)` | Slug used for tab and section slot names |

### 10.5 `VX.auth`
| Name | Purpose |
|---|---|
| `VX.auth.can('fleet.update')` | Permission check. **It only hides UI** |
| `VX.auth.hasModule('fleet')` | Entitlement check |
| `VX.auth.tenant` | `{ id, name, type }` for the active tenant |

**Events:** `vx:search`, `vx:sort`, `vx:submit`, `vx:tab-change` (detail: `{ tab }`), `vx:tenant-changed` (on `document`).

### 10.6 Icons

The available ids:

> `menu home inbox search bell help info alert check x plus edit more filter download columns sort chevron-left chevron-right chevron-down calendar clock sliders lock wifi-off sidebar logout user file-in clipboard file-text card shield layers calculator briefcase store landmark repeat scale chart building users key workflow folder plug database history`

Icons are decorative (`aria-hidden`). An icon-only button **MUST** have an `aria-label`.

---

## 11. Class reference

Use these classes. Do not create look-alikes.

| Need | Class |
|---|---|
| Buttons | `vx-btn` plus `vx-btn--primary` / `--secondary` / `--ghost` / `--danger` / `--link`; size `--sm` (dense bars only); `--icon` (square icon-only) |
| Toggle group | `vx-btn-group` with `aria-pressed` on its buttons |
| Card | `vx-card` › `vx-card__header` › `vx-card__title`; `vx-card__body` (`--flush` for tables); `vx-card__footer`; modifiers `vx-card--flat`, `vx-card--alt` |
| Status | `vx-badge` plus `--success` / `--info` / `--warning` / `--danger` / `--brand` |
| Alert | `vx-alert` plus `--success` / `--warning` / `--danger` (default is info), with `vx-alert__title` |
| Form | `vx-form-grid` › `vx-field vx-col-{3,4,6,8,12}` › `vx-label` (with `vx-req` or `vx-opt`), `vx-input` / `vx-select` / `vx-textarea`, `vx-error-msg`, `vx-hint`; group with `fieldset.vx-fieldset` › `legend` |
| Table | `vx-table-wrap` › `table.vx-table`; cells `is-num`, `is-check`; sortable header `th[aria-sort] > button[data-vx-sort]` |
| Key facts | `dl` › `div.vx-kv` › `dt` + `dd`; strip: `dl.vx-summary` |
| Layout | `vx-stack` (`--sm`), `vx-row` (`--between`, `--center`), `vx-spacer`, `vx-grid` (`--kpi`, `--2`, `--3`, `--2-1`, `--main-rail`, `--rail-main`), `vx-sticky` |
| Tabs | `div.vx-tabs[role=tablist]` › `button.vx-tab[role=tab]`, panels `div.vx-tabpanel[role=tabpanel]` |
| Text | `vx-overline`, `vx-caption`, `vx-muted`, `vx-num`, `vx-mono`, `vx-measure`, `sr-only` |
| Slot inside a flex row | `vx-slot--row`, `vx-slot--inline`, `vx-slot--fill` |

---

## 12. Alignment rules

These are **MUST** rules. Reviewers check them first.

1. **One control height per row.**
   - `--control-h` (40px) for page controls.
   - `--control-h-sm` (32px) **only** in dense bars: bulk bar, pagination, card headers.
   - `--topbar-control-h` (36px) in the top bar only.
   - Never mix sizes in one row.
2. **Page header row:** H1, then status badge, then actions pushed to the right and vertically centred.
   - The breadcrumb, overline and description sit on their own lines.
   - Never put buttons above or below the title row.
3. **Button order** in every action group, left to right: secondary, then **primary**, then overflow `⋯`. There is exactly **one** primary per group.
4. **Form action bar:**
   - Cancel (ghost) on the far left.
   - `vx-spacer`.
   - Then Back, Save draft and the primary on the far right.
   - The bar spans the form column only.
5. **Form fields:**
   - Order: label → control → error → hint.
   - Fields in one row share the grid (`vx-col-*`) so their controls line up.
   - Never put a hint above the control.
6. **Grids:**
   - Cards in one grid row stretch to equal height. Don't set fixed card heights.
   - Card headers have a minimum height of 56px. Don't override it.
7. **Spacing:**
   - Use only `--space-*` tokens.
   - Gaps: `--space-2` (8) between buttons, the `vx-form-grid` built-in gap between fields, `--space-6` (24) between page sections (`vx-stack`).
8. **Alignment within tables:**
   - Text left.
   - Numbers and money right (`is-num`).
   - Checkbox column `is-check`.
   - Headers match their column alignment.
9. **No inline `style=""` for layout or colour.** Add a module class instead. The only inline styles allowed are skeleton widths (`--h`, `width`) produced by `VX.ui`.
10. **A slot inside a flex row** must carry `vx-slot--row` or `vx-slot--inline`. Template slots already do; don't remove those classes.
11. **Icons in buttons:**
    - The icon goes first, then the text.
    - Use 20px icons in normal buttons and 16px icons in `--sm` buttons (this is automatic).
    - Never put an icon after the text, except `chevron-right` on "Continue".

---

## 13. Accessibility rules

1. **One H1 per page.** It is always `#vx-page-title`, rendered by the template. Never add another H1.
2. **Heading order:**
   - Card titles are H2.
   - Subsections inside a card are H3.
   - Never skip a level.
3. **Every input has a visible `<label for>`.**
   - Placeholders are never labels.
   - Required fields: `required` attribute plus `vx-req` asterisk.
   - Optional fields: `(optional)`.
4. **Errors:**
   - Use the built-in validation. It sets `aria-invalid`, links the error with `aria-describedby`, and fills the error summary.
   - Error text format: "Enter …" or "Enter a valid …".
5. **Status never uses colour alone.** Badges always have text.
6. **Icon-only buttons** need an `aria-label`. Decorative icons stay `aria-hidden`.
7. **Use real elements:**
   - `<a href>` for navigation.
   - `<button type="button">` for actions.
   - Never `div` with a click handler.
8. **Keyboard:**
   - Everything must be reachable and operable by keyboard.
   - Don't add a `tabindex` above 0.
   - Don't trap focus outside dialogs.
9. **Target size:** at least 24×24px (all `vx-btn` sizes comply).
10. **Live updates:** announce async results with `VX.utils.announce()`, for example "12 results".
11. **Tables:** use a `<caption>` (it may be `sr-only`) and `scope="col"` on headers.
12. **Contrast:** use only the token pairs in [§2.2](#22-semantic-colour-tokens-light-mode). Never place `--color-accent` text on a light surface.

---

## 14. Security and data rules

1. **Client checks only hide UI.** The server enforces authorization (OPA) and tenant isolation (Postgres RLS on `tenant_id`). Never rely on `VX.auth.can()` for security.
2. **Never store** tokens, PII, PHI or policy or claim data in `localStorage` or `sessionStorage`. `VX.utils.store` is for UI preferences only.
3. **Mask sensitive identifiers** with `fmt.mask()`: SSN, FEIN, driver's license, bank or account numbers, full VIN in list views.
4. **Never put** PII or record IDs that reveal PII into URLs or query strings.
5. **API calls:**
   - Use `credentials: 'include'`, relative `/api/v1/…` paths, and `encodeURIComponent` on every path parameter.
   - Send `row_version` back on updates, for optimistic concurrency.
6. **Display money** from the `amount` plus `currency_code` pair. Never do float arithmetic in the UI.
7. **Never use** `eval`, `new Function`, inline event handlers (`onclick=""`), or third-party scripts that aren't approved.

---

## 15. US formatting rules

Format every displayed value through `VX.fmt`. Never format by hand.

| Value | Function | Output |
|---|---|---|
| Money | `fmt.currency(n, code)` | `$1,234.56` |
| Large money | `fmt.compactCurrency(n)` | `$1.2M` |
| Date (business date) | `fmt.date('2026-11-19')` | `11/19/2026` |
| Date (readable) | `fmt.dateLong(d)` | `Nov 19, 2026` |
| Timestamp | `fmt.dateTime(d)` | `11/19/2026, 8:58 AM CST` |
| Policy term | `fmt.term(from, to)` | `01/01/2026 – 01/01/2027` |
| Relative | `fmt.relative(d)` | `3 days ago` |
| Phone | `fmt.phone(s)` | `(555) 123-4567` |
| ZIP | `fmt.zip(s)` | `60601` or `60601-1234` |
| Percent | `fmt.percent(0.125)` | `12.5%` |
| Masked ID | `fmt.mask(s, 4)` | `•••• 6789` |

**Other rules:**
- Use US English spelling in UI copy (color, organization).
- Use sentence case for all labels and buttons.
- Use a state `<select>` with two-letter codes.
- ZIP inputs use `inputmode="numeric"` and `autocomplete="postal-code"`.

---

## 16. Prohibited actions

| ❌ Don't | ✅ Do |
|---|---|
| Edit core files (`core/*.js`, `tokens.css`, `base.css`, `layout.css`, `primitives.css`, `app.js`) | Use slots, options, module files |
| Add a theme file or change token values | Keep `tokens.css` as is (Rust theme) |
| Hard-code hex, rgb or px colours and spacing | Use `var(--color-*)` and `var(--space-*)` |
| Write your own page layout, header or breadcrumb | Pick a template |
| Wrap header action buttons in a `div` | Return sibling buttons |
| Use more than one primary button per group | One primary, rightmost before overflow |
| Mix `vx-btn--sm` with normal buttons in a row | One size per row |
| Put hints above inputs | label → control → error → hint |
| Put inline `style=""` for layout | Add a `vx-<module>-*` class |
| Build HTML with string concatenation or `innerHTML = data` | `` html`…` `` |
| Add frameworks, bundlers or npm packages | Vanilla JS only |
| Recolour or redraw the logo | Use the official asset in `assets/img/` |
| Use Coral as text, or Rust for errors | `--color-accent` for fills only; `--color-danger` for errors |
| Store anything sensitive in web storage | Server session only |

---

## 17. Definition of done checklist

Report each item as **pass** or **fail**. Every item must pass.

**Structure**
- [ ] The page uses one of the 9 templates, and only documented slot names.
- [ ] Only allowed files changed (§3). No core file was edited.
- [ ] The new page file is loaded in `index.html`, above `app.js`.
- [ ] Route has `path`, `template`, `module` (if a module page), `permission` and `title`.

**Theme (v1 Rust)**
- [ ] No theme override file is linked. `tokens.css` is unchanged.
- [ ] Searching module CSS and JS for `#`, `rgb(` or `hsl(` colour values finds nothing.
- [ ] One primary button per group. No Coral text. Errors use the danger colour.

**Alignment**
- [ ] Header: title, status and actions are on one row. Actions are right-aligned and vertically centred.
- [ ] Every row of controls shares one height.
- [ ] Button order is secondary, primary, then overflow.
- [ ] Form controls line up across each row. The action bar has Cancel on the left and the primary on the right.
- [ ] Cards in a row have equal height. Numbers are right-aligned.
- [ ] No inline layout styles.

**Accessibility**
- [ ] One H1. Headings in order. All inputs labelled. Icon-only buttons have `aria-label`.
- [ ] Keyboard only: every control is reachable, focus is visible, tabs work with the arrow keys.
- [ ] Submitting the form empty shows the error summary, focuses it, and each link jumps to its field.

**Data and security**
- [ ] All values go through `VX.fmt`. Sensitive IDs are masked.
- [ ] HTML built with `` html`…` ``. No `raw()` on API data.
- [ ] Nothing sensitive in web storage or URLs.

**Behaviour**
- [ ] The page renders at 1440px, 1024px and 390px widths with no horizontal page scroll.
- [ ] Light and dark modes are both readable. Compact density works.
- [ ] No console errors. Empty, loading (skeleton) and error states all handled.
- [ ] Unfilled slots still show skeletons, not blank space.
