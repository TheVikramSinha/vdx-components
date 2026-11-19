/* =============================================================================
   VX.templates — page skeleton templates
   Every portal page is ONE of these templates + slot content.
   A template renders the page structure with skeleton placeholders in named
   SLOTS. A page fills a slot by providing `slots: { name: (ctx) => html`…` }`.
   Unfilled slots stay as skeletons — that is the boilerplate.

   Templates:  dashboard · list · detail · form · wizard · settings · report · blank · system
   Slot names are listed above each template — keep them stable; they are the contract.
   ========================================================================== */
(function (VX) {
  'use strict';
  const { html, raw, icon, fmt } = VX.utils;

  /* ---------- skeleton atoms ---------- */
  const sk = (cls = '', h) => raw(`<div class="vx-sk ${cls}"${h ? ` style="--h:${h}px"` : ''} aria-hidden="true"></div>`);
  const skw = (w, cls = 'vx-sk--text') => raw(`<div class="vx-sk ${cls}" style="width:${w}" aria-hidden="true"></div>`);
  const lines = (n = 3) => html`<div class="vx-sk-lines">${Array.from({ length: n }, () => sk('vx-sk--text'))}</div>`;
  const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const titleOf = (ctx) => (typeof ctx.route.title === 'function' ? ctx.route.title(ctx) : ctx.route.title) || 'Untitled';
  const opt = (ctx, key, fallback) => (ctx.route.options && ctx.route.options[key]) || fallback;

  /** Render a slot: page-provided content or the fallback skeleton. */
  const slot = (ctx, name, fallback, cls = '') => {
    const fn = ctx.route.slots && ctx.route.slots[name];
    let content = fallback;
    if (typeof fn === 'function') content = fn(ctx);
    else if (fn != null) content = fn;
    return html`<div class="vx-slot ${cls}" data-slot="${name}">${content}</div>`;
  };

  /** Card with a skeleton body — the most common slot fallback. */
  const card = ({ title, body, h = 160, flush = false, actions } = {}) => html`
    <section class="vx-card">
      <header class="vx-card__header">
        ${title ? html`<h2 class="vx-card__title">${title}</h2>` : html`<div class="vx-card__title">${skw('38%', 'vx-sk--title')}</div>`}
        ${actions || ''}
      </header>
      <div class="vx-card__body${flush ? ' vx-card__body--flush' : ''}">${body || sk('vx-sk--block', h)}</div>
    </section>`;

  const kpiTile = (label) => html`
    <section class="vx-card"><div class="vx-card__body vx-stack vx-stack--sm">
      ${label ? html`<p class="vx-caption">${label}</p>` : skw('50%')}
      ${sk('', 32)}
      ${skw('35%')}
    </div></section>`;

  /* ---------- Breadcrumbs (auto-derived unless route.crumbs given) ---------- */
  const crumbs = (ctx, title) => {
    if (ctx.path === '/') return '';
    const mod = VX.registry.byPath(ctx.path);
    let items = ctx.route.crumbs;
    if (!items) {
      items = [{ label: 'Home', path: '/' }];
      if (mod && ctx.path !== mod.base && mod.label !== title) items.push({ label: mod.label, path: mod.base });
      if (mod && ctx.route.template === 'detail') items.push({ label: `All ${mod.label.toLowerCase()}`, path: `${mod.base}/list` });
    }
    return html`<nav class="vx-breadcrumb" aria-label="Breadcrumb"><ol>
      ${items.map((c) => html`<li><a href="#${c.path}">${c.label}</a></li>`)}
      <li><span aria-current="page">${title}</span></li>
    </ol></nav>`;
  };

  /* ---------- Page header — shared by every template ----------
     slots: actions, meta */
  const header = (ctx, { status, meta, actions } = {}) => {
    const r = ctx.route;
    const mod = VX.registry.byPath(ctx.path);
    const title = titleOf(ctx);
    const actionContent = r.actions ? r.actions(ctx) : actions;
    const overline = mod ? mod.long : r.overline;
    return html`
      <header class="vx-page-header">
        ${crumbs(ctx, title)}
        ${overline ? html`<p class="vx-overline">${overline}</p>` : ''}
        <div class="vx-page-header__row">
          <h1 class="vx-page-title" id="vx-page-title" tabindex="-1">${title}</h1>
          ${status ? slot(ctx, 'status', status, 'vx-slot--inline') : ''}
          ${actionContent || (ctx.route.slots && ctx.route.slots.actions) ? slot(ctx, 'actions', actionContent, 'vx-page-actions') : ''}
        </div>
        ${r.description ? html`<p class="vx-page-desc">${r.description}</p>` : ''}
        ${meta ? slot(ctx, 'meta', meta) : ''}
      </header>`;
  };

  const page = (ctx, inner, mod = '') => html`<div class="vx-page ${mod}" data-template="${ctx.route.template}">${inner}</div>`;

  const T = {};

  /* =========================================================================
     DASHBOARD — module overview / home
     slots: actions, filters, kpis, primary, side, panel-1, panel-2, panel-3, activity
     options: { kpis: ['Label', …] }
     ======================================================================= */
  T.dashboard = (ctx) => {
    const kpis = opt(ctx, 'kpis', [null, null, null, null]);
    return page(ctx, html`
      ${header(ctx, {
        actions: html`
          <button class="vx-btn vx-btn--secondary" type="button">${icon('calendar')} Last 30 days</button>
          <button class="vx-btn vx-btn--ghost" type="button">${icon('sliders')} Customize</button>` })}
      <div class="vx-stack">
        ${slot(ctx, 'filters', html`<div class="vx-row">${['120px', '140px', '110px'].map((w) => raw(`<div class="vx-sk vx-sk--control" style="width:${w}" aria-hidden="true"></div>`))}</div>`)}
        ${slot(ctx, 'kpis', html`<div class="vx-grid vx-grid--kpi">${kpis.map(kpiTile)}</div>`)}
        <div class="vx-grid vx-grid--2-1">
          ${slot(ctx, 'primary', card({ h: 300 }))}
          ${slot(ctx, 'side', card({ body: lines(8) }))}
        </div>
        <div class="vx-grid vx-grid--3">
          ${slot(ctx, 'panel-1', card({ h: 180 }))}
          ${slot(ctx, 'panel-2', card({ h: 180 }))}
          ${slot(ctx, 'panel-3', card({ h: 180 }))}
        </div>
        ${slot(ctx, 'activity', card({ title: 'Recent activity', body: lines(6) }))}
      </div>`);
  };

  /* =========================================================================
     LIST — work queues, search results, registers
     slots: actions, views, toolbar, filters, table, empty, pagination
     options: { views: [...], columns: [{label, num?, sort?}], selectable: true, createLabel }
     ======================================================================= */
  T.list = (ctx) => {
    const mod = VX.registry.byPath(ctx.path);
    const views = opt(ctx, 'views', ['All', 'Assigned to me', 'Needs attention', 'Recently viewed']);
    const cols = opt(ctx, 'columns', [
      { label: 'Reference', sort: true }, { label: 'Name', sort: true }, { label: 'Status' },
      { label: 'Owner' }, { label: 'Updated', sort: true }, { label: 'Amount', num: true, sort: true },
    ]);
    const selectable = opt(ctx, 'selectable', true);
    const canCreate = mod && VX.auth.can(`${mod.id}.create`);
    const createLabel = opt(ctx, 'createLabel', mod && mod.record ? `New ${mod.record.toLowerCase()}` : 'New');
    const tabsId = VX.utils.uid('views');
    const filterId = VX.utils.uid('filters');

    const row = () => html`<tr>
      ${selectable ? html`<td class="is-check"><input type="checkbox" aria-label="Select row" data-vx-select-row></td>` : ''}
      ${cols.map((c, i) => html`<td class="${c.num ? 'is-num' : ''}">${skw(c.num ? '64px' : `${60 + ((i * 17) % 35)}%`)}</td>`)}
    </tr>`;

    return page(ctx, html`
      ${header(ctx, {
        actions: html`
          <button class="vx-btn vx-btn--secondary" type="button">${icon('download')} Export</button>
          ${canCreate ? html`<a class="vx-btn vx-btn--primary" href="#${mod.base}/new">${icon('plus')} ${createLabel}</a>` : ''}` })}

      <section class="vx-card" aria-label="${titleOf(ctx)}">
        ${slot(ctx, 'views', html`
          <div class="vx-tabs" role="tablist" aria-label="Saved views" id="${tabsId}">
            ${views.map((v, i) => html`<button class="vx-tab" role="tab" type="button" id="${tabsId}-${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" aria-controls="${tabsId}-panel" data-view="${slug(v)}">${v}</button>`)}
          </div>`)}

        <div id="${tabsId}-panel" role="tabpanel" aria-labelledby="${tabsId}-0">
          ${slot(ctx, 'toolbar', html`
            <div class="vx-toolbar" role="toolbar" aria-label="Table controls">
              <div class="vx-input-wrap vx-toolbar__search">
                ${icon('search', 'vx-icon--sm')}
                <label class="sr-only" for="${tabsId}-q">Search this list</label>
                <input class="vx-input vx-input--search" id="${tabsId}-q" type="search" placeholder="Search by reference, name or owner" data-vx-list-search>
              </div>
              <button class="vx-btn vx-btn--secondary" type="button" aria-expanded="false" aria-controls="${filterId}" data-vx-toggle>${icon('filter')} Filters</button>
              <span class="vx-spacer"></span>
              <div class="vx-btn-group" role="group" aria-label="Row density">
                <button class="vx-btn vx-btn--secondary" type="button" data-vx-density="comfortable" aria-pressed="true">Comfortable</button>
                <button class="vx-btn vx-btn--secondary" type="button" data-vx-density="compact" aria-pressed="false">Compact</button>
              </div>
              <button class="vx-btn vx-btn--secondary" type="button">${icon('columns')} Columns</button>
            </div>`)}

          <div id="${filterId}" hidden>
            ${slot(ctx, 'filters', html`<div class="vx-toolbar vx-toolbar--filters">
              ${[1, 2, 3, 4].map(() => html`<div class="vx-toolbar__filter vx-stack vx-stack--sm">${skw('40%')}${sk('', 40)}</div>`)}
            </div>`)}
          </div>

          <div class="vx-bulkbar" hidden data-vx-bulkbar>
            <span data-vx-bulk-count>0 selected</span>
            <span class="vx-spacer"></span>
            ${slot(ctx, 'bulk-actions', html`<button class="vx-btn vx-btn--secondary vx-btn--sm" type="button">Assign</button><button class="vx-btn vx-btn--secondary vx-btn--sm" type="button">Export selected</button>`, 'vx-slot--row')}
          </div>

          ${slot(ctx, 'table', html`
            <div class="vx-table-wrap" tabindex="0" aria-label="Results, scrollable">
              <table class="vx-table" data-vx-table>
                <caption class="sr-only">${titleOf(ctx)}. Column headers with buttons are sortable.</caption>
                <thead><tr>
                  ${selectable ? html`<th scope="col" class="is-check"><input type="checkbox" aria-label="Select all rows on this page" data-vx-select-all></th>` : ''}
                  ${cols.map((c) => c.sort
                    ? html`<th scope="col" aria-sort="none" class="${c.num ? 'is-num' : ''}"><button type="button" data-vx-sort>${c.label} ${icon('sort', 'vx-icon--sm')}</button></th>`
                    : html`<th scope="col" class="${c.num ? 'is-num' : ''}">${c.label}</th>`)}
                </tr></thead>
                <tbody>
                  ${Array.from({ length: 8 }, row)}
                </tbody>
              </table>
            </div>`)}

          ${slot(ctx, 'pagination', html`
            <nav class="vx-pagination" aria-label="Pagination">
              <label for="${tabsId}-pp">Rows per page</label>
              <select class="vx-select vx-select--sm" id="${tabsId}-pp"><option>25</option><option>50</option><option>100</option></select>
              <span class="vx-spacer"></span>
              <span aria-live="polite">Showing 1–25 of —</span>
              <button class="vx-btn vx-btn--secondary vx-btn--icon vx-btn--sm" type="button" aria-label="Previous page" disabled>${icon('chevron-left')}</button>
              <button class="vx-btn vx-btn--secondary vx-btn--icon vx-btn--sm" type="button" aria-label="Next page">${icon('chevron-right')}</button>
            </nav>`)}
        </div>
      </section>`);
  };

  /* =========================================================================
     DETAIL — a single record (policy, claim, submission, account…)
     slots: actions, status, summary, tab-<slug> for every tab,
            overview-main, overview-secondary, rail-tasks, rail-timeline, audit
     options: { tabs: [...], summary: ['Label', …] }
     ERD: every row carries created_at/by, updated_at/by, row_version → audit card
     ======================================================================= */
  T.detail = (ctx) => {
    const tabs = opt(ctx, 'tabs', ['Overview', 'Details', 'Documents', 'Activity', 'Related']);
    const summary = opt(ctx, 'summary', [null, null, null, null, null]);
    const active = Math.max(0, tabs.findIndex((t) => slug(t) === ctx.query.tab));
    const tid = 'rec-tabs';
    const statusSlot = html`<span class="vx-badge vx-badge--brand">Status</span>`;

    const overview = html`
      <div class="vx-grid vx-grid--main-rail">
        <div class="vx-stack">
          ${slot(ctx, 'overview-main', card({ h: 220 }))}
          ${slot(ctx, 'overview-secondary', card({ body: lines(6) }))}
        </div>
        <aside class="vx-stack vx-sticky" aria-label="Record side panel">
          ${slot(ctx, 'rail-tasks', card({ title: 'Open tasks', body: lines(4) }))}
          ${slot(ctx, 'rail-timeline', card({ title: 'Timeline', body: lines(6) }))}
          ${slot(ctx, 'audit', card({ title: 'Record information', body: html`
            <dl class="vx-stack vx-stack--sm">
              <div class="vx-kv"><dt>Created</dt><dd>${skw('70%')}</dd></div>
              <div class="vx-kv"><dt>Last updated</dt><dd>${skw('60%')}</dd></div>
              <div class="vx-kv"><dt>Version</dt><dd>${skw('30%')}</dd></div>
              <div class="vx-kv"><dt>Tenant</dt><dd>${VX.auth.tenant.name}</dd></div>
            </dl>` }))}
        </aside>
      </div>`;

    return page(ctx, html`
      ${header(ctx, {
        status: statusSlot,
        actions: html`
          <button class="vx-btn vx-btn--secondary" type="button">${icon('edit')} Edit</button>
          <button class="vx-btn vx-btn--primary" type="button">Primary action</button>
          <button class="vx-btn vx-btn--secondary vx-btn--icon" type="button" aria-label="More actions">${icon('more')}</button>`,
        meta: html`<dl class="vx-summary">${summary.map((s) => html`<div class="vx-kv"><dt>${s || skw('60%')}</dt><dd>${skw('80%')}</dd></div>`)}</dl>`,
      })}
      <div class="vx-tabs" role="tablist" aria-label="Record sections" data-vx-sync-query="tab">
        ${tabs.map((t, i) => html`<button class="vx-tab" role="tab" type="button" id="${tid}-${i}" aria-selected="${i === active}" tabindex="${i === active ? 0 : -1}" aria-controls="${tid}-p${i}" data-tab="${slug(t)}">${t}</button>`)}
      </div>
      ${tabs.map((t, i) => html`
        <div class="vx-tabpanel" role="tabpanel" id="${tid}-p${i}" aria-labelledby="${tid}-${i}" tabindex="0" ${i === active ? '' : raw('hidden')}>
          ${i === 0 ? slot(ctx, `tab-${slug(t)}`, overview) : slot(ctx, `tab-${slug(t)}`, card({ title: t, h: 280 }))}
        </div>`)}`);
  };

  /* =========================================================================
     FORM — create / edit (single page) · WIZARD — multi-step (same slots + stepper)
     slots: actions, intro, section-<n> (1-based), help, footer
     options: { sections: ['General information', …], steps: [...] (wizard), submitLabel }
     Patterns: USWDS-style error summary, label → control → error → hint (controls align per row),
               required marked with *, sticky action bar, unsaved-changes guard.
     ======================================================================= */
  const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

  /** Reference field pattern — copy this markup for real fields. */
  const field = ({ id, label, type = 'text', required, hint, cols = 6, attrs = '', options }) => html`
    <div class="vx-field vx-col-${cols}">
      <label class="vx-label" for="${id}">${label}${required ? html`<span class="vx-req" aria-hidden="true">*</span>` : html` <span class="vx-opt">(optional)</span>`}</label>
      ${options
        ? html`<select class="vx-select" id="${id}" name="${id}" ${required ? raw('required') : ''} ${hint ? raw(`aria-describedby="${id}-hint"`) : ''}><option value="">- Select -</option>${options.map((o) => html`<option>${o}</option>`)}</select>`
        : html`<input class="vx-input" id="${id}" name="${id}" type="${type}" ${required ? raw('required') : ''} ${hint ? raw(`aria-describedby="${id}-hint"`) : ''} ${raw(attrs)}>`}
      <span class="vx-error-msg" id="${id}-error" hidden></span>
      ${hint ? html`<span class="vx-hint" id="${id}-hint">${hint}</span>` : ''}
    </div>`;

  const referenceSection = html`
    <div class="vx-form-grid">
      ${field({ id: 'f-name', label: 'Legal name', required: true, cols: 12, attrs: 'autocomplete="organization"' })}
      ${field({ id: 'f-eff', label: 'Effective date', type: 'date', required: true, hint: 'MM/DD/YYYY', cols: 4 })}
      ${field({ id: 'f-state', label: 'State', required: true, cols: 4, options: US_STATES })}
      ${field({ id: 'f-zip', label: 'ZIP code', cols: 4, attrs: 'inputmode="numeric" autocomplete="postal-code" pattern="\\d{5}(-\\d{4})?" maxlength="10"', hint: '5 or 9 digits' })}
      ${field({ id: 'f-phone', label: 'Phone', type: 'tel', cols: 6, attrs: 'autocomplete="tel"', hint: '(555) 123-4567' })}
      ${field({ id: 'f-email', label: 'Email', type: 'email', cols: 6, attrs: 'autocomplete="email"' })}
    </div>`;

  const skeletonSection = (n = 4) => html`<div class="vx-form-grid">
    ${Array.from({ length: n }, (_, i) => html`<div class="vx-field vx-col-${i % 3 === 0 ? 12 : 6}">${skw('30%')}${sk('', 40)}</div>`)}
  </div>`;

  const formPage = (ctx, wizard) => {
    const mod = VX.registry.byPath(ctx.path);
    const sections = opt(ctx, wizard ? 'steps' : 'sections', wizard ? ['Applicant', 'Risk details', 'Coverages', 'Review & submit'] : ['General information', 'Details', 'Additional information']);
    const step = wizard ? Math.min(Math.max(1, Number(ctx.query.step) || 1), sections.length) : null;
    const back = mod ? `${mod.base}/list` : '/';
    const submitLabel = opt(ctx, 'submitLabel', wizard ? (step === sections.length ? 'Submit' : 'Continue') : 'Save');

    return page(ctx, html`
      ${header(ctx)}
      ${wizard ? html`
        <nav aria-label="Progress" style="margin-bottom:var(--space-6)">
          <ol class="vx-stepper">${sections.map((s, i) => html`<li ${i + 1 === step ? raw('aria-current="step"') : ''} data-state="${i + 1 < step ? 'done' : i + 1 === step ? 'current' : 'todo'}"><span>${s}</span>${i + 1 < step ? html`<span class="sr-only"> (completed)</span>` : ''}</li>`)}</ol>
          <p class="sr-only">Step ${step} of ${sections.length}</p>
        </nav>` : ''}
      <div class="vx-form-layout">
        <form class="vx-stack" novalidate data-vx-form aria-labelledby="vx-page-title">
          <div class="vx-alert vx-alert--danger" role="alert" tabindex="-1" hidden data-vx-error-summary>
            ${icon('alert')}
            <div><p class="vx-alert__title">There is a problem</p><ul data-vx-error-list></ul></div>
          </div>
          ${slot(ctx, 'intro', html`<p class="vx-caption">Required fields are marked with an asterisk (<span class="vx-req">*</span>).</p>`)}
          ${sections.map((s, i) => (!wizard || i + 1 === step) ? html`
            <section class="vx-card"><div class="vx-card__body">
              <fieldset class="vx-fieldset">
                <legend>${s}</legend>
                ${slot(ctx, `section-${i + 1}`, i === 0 ? referenceSection : skeletonSection(i === sections.length - 1 ? 3 : 5))}
              </fieldset>
            </div></section>` : '')}
          <div class="vx-actionbar">
            ${slot(ctx, 'footer', html`
              <a class="vx-btn vx-btn--ghost" href="#${back}">Cancel</a>
              <span class="vx-spacer"></span>
              ${wizard && step > 1 ? html`<a class="vx-btn vx-btn--secondary" href="#${ctx.path}?step=${step - 1}">${icon('chevron-left')} Back</a>` : ''}
              <button class="vx-btn vx-btn--secondary" type="button" data-vx-save-draft>Save draft</button>
              <button class="vx-btn vx-btn--primary" type="submit" ${wizard ? raw(`data-vx-next="${step < sections.length ? `${ctx.path}?step=${step + 1}` : ''}"`) : ''}>${submitLabel}${wizard && step < sections.length ? html` ${icon('chevron-right')}` : ''}</button>`, 'vx-slot--row vx-slot--fill')}
          </div>
        </form>
        <aside class="vx-stack vx-sticky" aria-label="Help">
          ${slot(ctx, 'help', card({ title: 'Help', body: lines(5) }))}
        </aside>
      </div>`, 'vx-page--form');
  };
  T.form = (ctx) => formPage(ctx, false);
  T.wizard = (ctx) => formPage(ctx, true);

  /* =========================================================================
     SETTINGS — profile, tenant settings, admin configuration
     slots: actions, section-<slug> for each section
     options: { sections: [...] }
     ======================================================================= */
  T.settings = (ctx) => {
    const sections = opt(ctx, 'sections', ['Profile', 'Notifications', 'Security', 'Preferences']);
    return page(ctx, html`
      ${header(ctx, { actions: html`<button class="vx-btn vx-btn--primary" type="button">Save changes</button>` })}
      <div class="vx-grid vx-grid--rail-main">
        <nav class="vx-card vx-card--flat vx-sticky" aria-label="Settings sections"><ul role="list" style="padding:var(--space-2)">
          ${sections.map((s) => html`<li><button class="vx-menu__item" type="button" data-vx-scroll="sec-${slug(s)}">${s}</button></li>`)}
        </ul></nav>
        <div class="vx-stack">
          ${sections.map((s) => html`<div id="sec-${slug(s)}" tabindex="-1">${slot(ctx, `section-${slug(s)}`, card({ title: s, body: skeletonSection(4) }))}</div>`)}
        </div>
      </div>`);
  };

  /* =========================================================================
     REPORT — analytics, bordereaux, regulatory reports, search
     slots: actions, filters, kpis, canvas, table
     ======================================================================= */
  T.report = (ctx) => page(ctx, html`
    ${header(ctx, {
      actions: html`
        <button class="vx-btn vx-btn--ghost" type="button">${icon('clock')} Schedule</button>
        <button class="vx-btn vx-btn--secondary" type="button">${icon('download')} Export</button>
        <button class="vx-btn vx-btn--primary" type="button">Share</button>` })}
    <div class="vx-grid vx-grid--rail-main">
      <aside class="vx-sticky" aria-label="Report filters">
        ${slot(ctx, 'filters', card({ title: 'Filters', body: html`<div class="vx-stack vx-stack--sm">${Array.from({ length: 5 }, () => html`<div class="vx-stack vx-stack--sm">${skw('40%')}${sk('', 40)}</div>`)}</div>` }))}
      </aside>
      <div class="vx-stack">
        ${slot(ctx, 'kpis', html`<div class="vx-grid vx-grid--kpi">${[1, 2, 3].map(() => kpiTile())}</div>`)}
        ${slot(ctx, 'canvas', card({ h: 340 }))}
        ${slot(ctx, 'table', card({ body: lines(8) }))}
      </div>
    </div>`, 'vx-page--full');

  /* =========================================================================
     BLANK — free-form page with the standard header
     slots: actions, content
     ======================================================================= */
  T.blank = (ctx) => page(ctx, html`
    ${header(ctx, { actions: '' })}
    ${slot(ctx, 'content', card({ h: 320 }))}`);

  /* =========================================================================
     SYSTEM — 403 / 404 / 500 / not-licensed / maintenance / offline / session-expired
     ======================================================================= */
  const SYSTEM = {
    '404': { title: 'Page not found', body: 'The page you are looking for doesn’t exist or may have moved. Check the address, or go back to Home.', icon: 'search' },
    '403': { title: 'You don’t have access to this page', body: 'Your role doesn’t include permission to view this page. If you think this is a mistake, contact your administrator.', icon: 'lock' },
    'not-licensed': { title: 'This module isn’t included in your plan', body: 'Your organization hasn’t enabled this module. An administrator can request access from Modules & entitlements.', icon: 'layers' },
    '500': { title: 'Something went wrong', body: 'We couldn’t load this page. Your work has not been lost. Try again, and if the problem continues, contact support with the reference below.', icon: 'alert' },
    'maintenance': { title: 'Scheduled maintenance', body: 'VeriDex One is being updated. We’ll be back shortly. Check the status page for updates.', icon: 'clock' },
    'offline': { title: 'You’re offline', body: 'Check your internet connection. Unsaved changes on this device will be kept until you reconnect.', icon: 'wifi-off' },
  };
  T.system = (code, ctx) => {
    const c = typeof code === 'string' ? code : opt(ctx, 'code', '404');
    const s = SYSTEM[c] || SYSTEM['404'];
    const showCode = /^\d+$/.test(c);
    const ref = c === '500' ? VX.utils.correlationId() : null;
    return html`<div class="vx-page vx-system" data-template="system">
      <div class="vx-empty vx-measure">
        ${showCode ? html`<p class="vx-system__code" aria-hidden="true">${c}</p>` : html`<div class="vx-empty__art">${icon(s.icon)}</div>`}
        <h1 class="vx-h2" id="vx-page-title" tabindex="-1">${s.title}</h1>
        <p class="vx-body-lg vx-muted">${s.body}</p>
        ${ref ? html`<p class="vx-caption">Reference: <span class="vx-mono">${ref}</span> · ${fmt.dateTime(new Date())}</p>` : ''}
        <div class="vx-row vx-row--center">
          <a class="vx-btn vx-btn--primary" href="#/">Go to Home</a>
          ${c === '500' ? html`<button class="vx-btn vx-btn--secondary" type="button" data-vx-reload>Try again</button>` : ''}
          <a class="vx-btn vx-btn--ghost" href="mailto:${VX.config.support.email}">Contact support</a>
        </div>
      </div>
    </div>`;
  };

  /* ---------- Reusable empty state for pages ---------- */
  const empty = ({ icon: ic = 'inbox', title, body, action } = {}) => html`
    <div class="vx-empty">
      <div class="vx-empty__art">${icon(ic)}</div>
      <h2 class="vx-h3">${title}</h2>
      ${body ? html`<p class="vx-muted vx-measure">${body}</p>` : ''}
      ${action || ''}
    </div>`;

  VX.templates = T;
  VX.ui = Object.assign(VX.ui || {}, { sk, skw, lines, card, kpiTile, slot, empty, field, slug });
})(window.VX = window.VX || {});
