# VeriDex One — Portal Skeleton

Boilerplate for every VeriDex One portal page. Vanilla HTML/CSS/JS. No build step. Runs from `file://` or any static host.

- **Brand:** VeriDex Brand Guidelines v1.0 (colour, type, 10 px radius, gradient, halftone)
- **Domain model:** Veridex One Platform L3 v4.20 Physical ERD (Foundation and sellable modules, multi-tenant, entitlements, OPA authorization)
- **Standards:** WCAG 2.2 AA, Section 508, USWDS form and error patterns, NIST SP 800-63B session and MFA, NIST 800-53 AC-8 system-use notice, CCPA/CPRA privacy links

## Run

Open `index.html` in a browser. Open `auth/login.html` to see the sign-in flow.

## Structure

```
index.html                  App shell: top bar, sidebar, main, footer, dialogs, script order
auth/login.html             Sign in: email, then password, then MFA. SSO entry point
assets/
  css/
    tokens.css              Brand tokens (--vx-*) and semantic tokens (--color-*, --space-*). Light and dark
    base.css                Reset, type scale, focus, sr-only, skip link, forced-colors, print
    layout.css              Shell grid, page header, layout grids, action bar, breakpoints
    primitives.css          Generic blocks: button, field, card, badge, tabs, table, skeleton…
    auth.css                Auth screens
    modules/                One CSS file per module (empty)
  js/
    core/utils.js           html`` (escapes by default), VX.fmt (en-US), mask(), store, announce
    core/config.js          Environment, locale, time zone, session, API, support, legal links
    core/auth.js            Session, tenants, entitlements, permissions. can(), hasModule(), gate()
    core/registry.js        Module catalogue (from the ERD) and nav groups
    core/router.js          Hash router, params, query, leave guards. VX.pages API
    core/templates.js       Page templates and named slots
    core/shell.js           Nav, tenant switch, menus, command palette, theme, toasts, tabs, tables,
                            form validation, unsaved-changes guard, session timeout
    pages/_page-template.js Starter file for a new module's pages
    pages/examples.pages.js Example overrides (safe to delete)
    modules/                Module components (empty)
    app.js                  Boot: platform routes, conventional routes, page files, start
  img/                      PLACEHOLDER logomark and favicon. Replace with official brand SVGs
```

## How a page is built

**Page = route + template + slots.**

1. Add a module to `registry.js`. It gets four routes automatically:

   | Path | Template | Purpose |
   |---|---|---|
   | `/claims` | dashboard | Module overview |
   | `/claims/list` | list | Work queue or register |
   | `/claims/new` | form | Create |
   | `/claims/:id` | detail | Record view |

2. To change a page, register a route with the same path in `pages/<module>.pages.js` and add the script tag above `app.js`.
3. Fill slots with real content. A slot you don't fill keeps its skeleton.

```js
(window.VX.pageQueue = window.VX.pageQueue || []).push(function (VX) {
  const { html } = VX.utils;
  VX.pages.register({
    path: '/claims/:id',
    template: 'detail',
    module: 'claims',
    permission: 'claims.read',
    title: (ctx) => `Claim ${ctx.params.id}`,
    options: { tabs: ['Overview', 'Exposures', 'Reserves', 'Payments', 'Documents'] },
    slots: { status: () => html`<span class="vx-badge vx-badge--warning">Open</span>` },
    async onMount(ctx, el) { /* fetch data, fill [data-slot="…"] */ },
    onLeave(ctx) { /* abort fetches */ },
  });
});
```

## Templates and slots

Slot names are a contract. Keep them stable.

| Template | Use for | Slots |
|---|---|---|
| `dashboard` | Home, module overview | actions, filters, kpis, primary, side, panel-1…3, activity |
| `list` | Work queues, search, registers | actions, views, toolbar, filters, bulk-actions, table, pagination |
| `detail` | Policy, claim, submission, account | actions, status, meta, tab-`<slug>`, overview-main, overview-secondary, rail-tasks, rail-timeline, audit |
| `form` | Create and edit | actions, intro, section-`<n>`, help, footer |
| `wizard` | FNOL, new business, endorsements | Same as form, plus a stepper (`?step=n`) |
| `settings` | Profile, tenant and admin config | actions, section-`<slug>` |
| `report` | Analytics, bordereaux, regulatory | actions, filters, kpis, canvas, table |
| `blank` | Anything else | actions, content |
| `system` | 403, 404, 500, not-licensed, maintenance, offline | — |

To see slot outlines, open the user menu and choose **Show slot labels (dev)**. Turn it off in PROD with `config.dev.slotLabels`.

## Rules

**Tokens**
- Components use semantic tokens only (`--color-primary`), never brand tokens (`--vx-rust`).
- Colour ratio: 60% neutral, 25% rust, 10% coral, 5% secondary.
- Never use coral as text on light backgrounds (2.5:1).
- Errors use `--color-danger`, never rust.

**Type**
- Manrope for headings, buttons, overlines and KPIs. Source Sans 3 for everything else.
- Use the app scale (`--fs-page-title` and below) on working screens. The brand scale is for auth and empty states.

**Alignment**
- One control height everywhere: `--control-h` (40), `--control-h-sm` (32) for dense bars, `--topbar-control-h` (36). Never mix sizes in one row.
- Page header row: H1, status, then actions pushed right and vertically centred. Button order is secondary, primary, then overflow (⋯).
- Form action bar spans the form column: Cancel on the left, then Back, Save draft, and primary on the far right.
- Cards in the same grid row stretch to equal height. Card headers are 56 px minimum.
- A slot inside a flex row uses `vx-slot--row` / `vx-slot--inline` so the wrapper never breaks the row.
- No inline styles for layout. Add a class.

**Accessibility**
- Each page has one H1 (`#vx-page-title`). It gets focus and is announced on every route change.
- Status always has text, never colour alone.
- Inputs follow label, control, error, hint (Carbon/Material order), so controls in the same row always line up. Mark required fields with `*` and optional ones with "(optional)".
- Validation shows an error summary at the top that links to each field.
- Tabs, menus, combobox and dialogs follow WAI-ARIA keyboard patterns.

**Security**
- Client checks only hide UI. Every API call must be authorized server-side: OPA plus Postgres RLS on `tenant_id`.
- `html`` escapes all values. Use `raw()` only for trusted markup.
- No tokens, PII or PHI in localStorage. Use `VX.fmt.mask()` for SSN, FEIN, DL and bank numbers.
- Recommended response headers: `Content-Security-Policy` (`script-src 'self'`, `frame-ancestors 'none'`), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`.

**US formatting**
- Format everything through `VX.fmt`: `currency`, `date` (MM/DD/YYYY), `dateTime` (with zone), `phone`, `zip`, `term`.
- Amounts come as numeric(19,4) with `currency_code`, per the ERD.

**Session**
- Idle timeout is 15 minutes. A warning dialog appears 2 minutes before sign-out and offers to extend.
- Leaving a page with unsaved changes prompts the user, for both in-app route changes and browser unload.

**Multi-tenant**
- The tenant switcher re-runs entitlement gating and re-renders.
- A module the tenant hasn't licensed shows the `not-licensed` page instead of 403.

## Swap points before production

1. `assets/img/logomark.svg` and `favicon.svg`: replace with official assets.
2. `auth.js` mock session: replace with `GET /api/v1/me` (user, tenants, entitlements, permissions, features).
3. `login.js`: replace with OIDC Authorization Code + PKCE against the tenant IdP.
4. `config.js`: inject per environment from the server.
5. Hash router: switch to the History API once the server rewrites to `index.html`.
