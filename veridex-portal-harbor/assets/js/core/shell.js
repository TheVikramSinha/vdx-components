/* =============================================================================
   VX.shell — application chrome + global behaviours
   Owns: sidebar nav, tenant switcher, menus, command palette, theme/density,
   toasts, tabs keyboard model, list/table interactions, form validation,
   unsaved-changes guard, session timeout, route rendering + focus management.
   Pages never touch the chrome directly — they use VX.ui.* and slots.
   ========================================================================== */
(function (VX) {
  'use strict';
  const { html, icon, $, $$, on, store, announce, fmt } = VX.utils;

  const shell = { dirty: false };

  /* =========================================================================
     Render a route into #vx-view
     ======================================================================= */
  shell.render = async (ctx) => {
    const view = $('#vx-view');
    const r = ctx.route;
    const T = VX.templates;
    const blocked = r.template === 'system' ? null : VX.auth.gate(r);
    let out;
    try {
      out = blocked ? T.system(blocked, ctx) : r.template === 'system' ? T.system(null, ctx) : (T[r.template] || T.blank)(ctx);
    } catch (err) {
      console.error('[VX] render failed', err);
      out = T.system('500', ctx);
    }

    view.setAttribute('aria-busy', 'true');
    view.innerHTML = String(out);
    shell.dirty = false;

    // Document title: "Page · Module · App" (SC 2.4.2)
    const h1 = $('#vx-page-title', view);
    const mod = VX.registry.byPath(ctx.path);
    const pageTitle = h1 ? h1.textContent.trim() : VX.config.appName;
    document.title = [pageTitle, mod && mod.label !== pageTitle ? mod.label : null, VX.config.appName].filter(Boolean).join(' · ');

    shell.setActiveNav(ctx.path);
    shell.closeMobileNav();
    closeAllMenus();
    window.scrollTo(0, 0);

    // Focus management on route change: move focus to H1 and announce (SPA a11y)
    if (shell._booted && h1) h1.focus({ preventScroll: true });
    if (shell._booted) announce(`${pageTitle} page loaded`);
    shell._booted = true;

    if (!blocked && typeof r.onMount === 'function') {
      try { await r.onMount(ctx, view); }
      catch (err) { console.error('[VX] onMount failed', err); view.innerHTML = String(T.system('500', ctx)); }
    }
    view.setAttribute('aria-busy', 'false');
  };

  /* =========================================================================
     Sidebar navigation
     ======================================================================= */
  shell.renderNav = () => {
    const groups = VX.registry.nav();
    $('#vx-nav').innerHTML = String(html`${groups.map((g) => html`
      <div class="vx-nav-group">
        <h2 class="vx-nav-group__label" id="nav-g-${g.id}">${g.label}</h2>
        <ul role="list" aria-labelledby="nav-g-${g.id}">
          ${g.items.map((it) => html`<li><a class="vx-nav-link" href="#${it.path}" data-path="${it.path}" title="${it.label}">
            ${icon(it.icon)}<span class="vx-nav-link__label">${it.label}</span>
            ${it.count ? html`<span class="vx-nav-link__count" aria-label="${it.count} items">${it.count}</span>` : ''}
          </a></li>`)}
        </ul>
      </div>`)}`);
    if (VX.router.current) shell.setActiveNav(VX.router.current.path);
  };

  shell.setActiveNav = (path) => {
    const links = $$('#vx-nav .vx-nav-link');
    let best = null; let len = -1;
    links.forEach((a) => {
      a.removeAttribute('aria-current');
      const p = a.dataset.path;
      const hit = p === '/' ? path === '/' : path === p || path.startsWith(p + '/');
      if (hit && p.length > len) { best = a; len = p.length; }
    });
    if (best) best.setAttribute('aria-current', 'page');
  };

  /* Mobile drawer + desktop collapse */
  shell.openMobileNav = () => {
    $('#vx-app').dataset.navOpen = 'true';
    $('#vx-menu-btn').setAttribute('aria-expanded', 'true');
    $('#vx-backdrop').hidden = false;
    const first = $('#vx-nav a'); if (first) first.focus();
  };
  shell.closeMobileNav = () => {
    const app = $('#vx-app');
    if (app.dataset.navOpen !== 'true') return;
    app.dataset.navOpen = 'false';
    $('#vx-menu-btn').setAttribute('aria-expanded', 'false');
    $('#vx-backdrop').hidden = true;
  };
  shell.setCollapsed = (collapsed) => {
    $('#vx-app').dataset.sidebar = collapsed ? 'collapsed' : 'expanded';
    const b = $('#vx-collapse-btn');
    b.setAttribute('aria-pressed', String(collapsed));
    b.setAttribute('aria-label', collapsed ? 'Expand navigation' : 'Collapse navigation');
    store.set('sidebar', collapsed ? 'collapsed' : 'expanded');
  };

  /* =========================================================================
     Topbar: tenant, user, notifications
     ======================================================================= */
  shell.renderTenant = () => {
    const t = VX.auth.tenant;
    $('#vx-tenant-name').textContent = t.name;
    $('#vx-tenant-type').textContent = t.type;
    $('#vx-tenant-menu').innerHTML = String(html`
      <p class="vx-menu__head vx-caption">Switch organization</p>
      ${VX.session.tenants.map((x) => html`
        <button class="vx-menu__item" type="button" role="menuitemradio" aria-checked="${x.id === t.id}" data-vx-tenant="${x.id}">
          <span style="flex:1"><strong>${x.name}</strong><br><span class="vx-caption">${x.type}</span></span>
          ${x.id === t.id ? icon('check') : ''}
        </button>`)}`);
  };

  shell.renderUser = () => {
    const u = VX.session.user;
    $('#vx-user-initials').textContent = fmt.initials(u.name);
    $('#vx-user-name').textContent = u.name;
    $('#vx-user-email').textContent = u.email;
    $('#vx-user-title').textContent = u.title;
  };

  /* =========================================================================
     Disclosure menus (topbar) — button[data-vx-menu] aria-controls=<panel>
     ======================================================================= */
  const openMenus = new Set();
  const closeMenu = (btn, restoreFocus = false) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.setAttribute('aria-expanded', 'false');
    if (panel) panel.hidden = true;
    openMenus.delete(btn);
    if (restoreFocus) btn.focus();
  };
  const closeAllMenus = (except) => { [...openMenus].forEach((b) => b !== except && closeMenu(b)); };
  const toggleMenu = (btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    const open = btn.getAttribute('aria-expanded') !== 'true';
    closeAllMenus(btn);
    btn.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (open) { openMenus.add(btn); const f = panel.querySelector('button, a, [tabindex]'); if (f) f.focus(); }
    else openMenus.delete(btn);
  };

  /* =========================================================================
     Theme + density
     ======================================================================= */
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  shell.applyTheme = (pref = store.get('theme', 'light')) => {
    const theme = pref === 'system' ? (mq.matches ? 'dark' : 'light') : pref;
    document.documentElement.dataset.theme = theme;
    $$('[data-vx-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vxTheme === pref)));
    store.set('theme', pref);
  };
  mq.addEventListener && mq.addEventListener('change', () => store.get('theme') === 'system' && shell.applyTheme('system'));

  shell.applyDensity = (d = store.get('density', 'comfortable')) => {
    document.documentElement.dataset.density = d;
    $$('[data-vx-density]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.vxDensity === d)));
    store.set('density', d);
  };

  shell.applySlotLabels = (on_ = store.get('slotLabels', VX.config.dev.slotLabels)) => {
    document.documentElement.dataset.slotLabels = on_ ? 'on' : 'off';
    const b = $('#vx-slot-toggle'); if (b) b.setAttribute('aria-pressed', String(!!on_));
    store.set('slotLabels', !!on_);
  };

  /* =========================================================================
     Toasts — VX.ui.toast('Saved', { type: 'success' })
     ======================================================================= */
  const toast = (message, { type = 'info', timeout = 6000, action } = {}) => {
    const el = document.createElement('div');
    el.className = `vx-toast vx-toast--${type}`;
    el.innerHTML = String(html`
      ${icon(type === 'success' ? 'check' : type === 'danger' ? 'alert' : 'info')}
      <p class="vx-toast__msg">${message}</p>
      ${action ? html`<button class="vx-btn vx-btn--ghost vx-btn--sm" type="button" data-act>${action.label}</button>` : ''}
      <button class="vx-btn vx-btn--ghost vx-btn--icon vx-btn--sm" type="button" aria-label="Dismiss notification">${icon('x')}</button>`);
    const remove = () => el.remove();
    el.querySelector('[aria-label="Dismiss notification"]').addEventListener('click', remove);
    if (action) el.querySelector('[data-act]').addEventListener('click', () => { action.onClick(); remove(); });
    $('#vx-toasts').appendChild(el);
    // SC 2.2.1: give enough time — errors persist until dismissed
    if (timeout && type !== 'danger') setTimeout(remove, timeout);
  };

  /* =========================================================================
     Command palette (Ctrl/⌘+K) — WAI-ARIA combobox + listbox
     ======================================================================= */
  const palette = {
    items: [],
    index: 0,
    build() {
      const items = [];
      VX.registry.nav().forEach((g) => g.items.forEach((it) => items.push({ label: it.label, hint: g.label, path: it.path, icon: it.icon })));
      VX.registry.modules.filter((m) => VX.auth.hasModule(m.id) && VX.auth.can(`${m.id}.create`))
        .forEach((m) => items.push({ label: `New ${m.record.toLowerCase()}`, hint: m.label, path: `${m.base}/new`, icon: 'plus' }));
      items.push({ label: 'Settings', hint: 'Account', path: '/settings', icon: 'sliders' });
      this.all = items;
    },
    render(q = '') {
      const term = q.trim().toLowerCase();
      this.items = this.all.filter((i) => !term || `${i.label} ${i.hint}`.toLowerCase().includes(term)).slice(0, 12);
      this.index = 0;
      const list = $('#vx-palette-list');
      list.innerHTML = this.items.length
        ? String(html`${this.items.map((it, i) => html`<li role="option" id="pal-${i}" class="vx-menu__item" aria-selected="${i === 0}" data-path="${it.path}">${icon(it.icon)}<span style="flex:1">${it.label}</span><span class="vx-caption">${it.hint}</span></li>`)}`)
        : String(html`<li class="vx-menu__head vx-muted" role="presentation">No matches for “${q}”</li>`);
      $('#vx-palette-input').setAttribute('aria-activedescendant', this.items.length ? 'pal-0' : '');
      $('#vx-palette-status').textContent = `${this.items.length} results`;
    },
    move(d) {
      if (!this.items.length) return;
      this.index = (this.index + d + this.items.length) % this.items.length;
      $$('#vx-palette-list [role="option"]').forEach((li, i) => li.setAttribute('aria-selected', String(i === this.index)));
      $('#vx-palette-input').setAttribute('aria-activedescendant', `pal-${this.index}`);
      const el = $(`#pal-${this.index}`); el && el.scrollIntoView({ block: 'nearest' });
    },
    open() { this.build(); const d = $('#vx-palette'); $('#vx-palette-input').value = ''; this.render(); d.showModal(); $('#vx-palette-input').focus(); },
    close() { $('#vx-palette').close(); },
    choose(i = this.index) { const it = this.items[i]; if (!it) return; this.close(); VX.router.go(it.path); },
  };

  /* =========================================================================
     Forms — generic required/pattern validation + error summary (USWDS pattern)
     ======================================================================= */
  const validate = (form) => {
    const errors = [];
    $$('input, select, textarea', form).forEach((elm) => {
      const fieldEl = elm.closest('.vx-field');
      const msgEl = document.getElementById(`${elm.id}-error`);
      const label = fieldEl ? (fieldEl.querySelector('.vx-label') || {}).textContent : elm.name;
      const clean = String(label || '').replace(/\*|\(optional\)/g, '').trim();
      let msg = '';
      if (elm.required && !String(elm.value).trim()) msg = `Enter ${clean.toLowerCase()}`;
      else if (elm.value && !elm.checkValidity()) msg = `Enter a valid ${clean.toLowerCase()}`;
      if (fieldEl) fieldEl.toggleAttribute('data-invalid', !!msg);
      elm.setAttribute('aria-invalid', String(!!msg));
      if (msgEl) {
        msgEl.hidden = !msg; msgEl.textContent = msg ? `Error: ${msg}` : '';
        const ids = new Set((elm.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
        msg ? ids.add(msgEl.id) : ids.delete(msgEl.id);
        ids.size ? elm.setAttribute('aria-describedby', [...ids].join(' ')) : elm.removeAttribute('aria-describedby');
      }
      if (msg) errors.push({ id: elm.id, msg });
    });
    const summary = $('[data-vx-error-summary]', form);
    if (summary) {
      summary.hidden = !errors.length;
      $('[data-vx-error-list]', summary).innerHTML = String(html`${errors.map((e) => html`<li><a href="#" data-vx-focus="${e.id}">${e.msg}</a></li>`)}`);
      if (errors.length) summary.focus();
    }
    return errors.length === 0;
  };

  /* =========================================================================
     Session timeout (inactivity) — warn, then sign out
     ======================================================================= */
  const session = {
    last: Date.now(),
    timer: null,
    countdown: null,
    touch() { if (!$('#vx-timeout').open) session.last = Date.now(); },
    start() {
      ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((e) => window.addEventListener(e, session.touch, { passive: true }));
      session.timer = setInterval(session.check, 15000);
    },
    check() {
      const { idleMinutes, warnSeconds } = VX.config.session;
      const idle = (Date.now() - session.last) / 1000;
      if (idle >= idleMinutes * 60 - warnSeconds && !$('#vx-timeout').open) session.warn();
    },
    warn() {
      let left = VX.config.session.warnSeconds;
      const d = $('#vx-timeout');
      const out = $('#vx-timeout-count');
      const tick = () => {
        const m = Math.floor(left / 60); const s = String(left % 60).padStart(2, '0');
        out.textContent = `${m}:${s}`;
        if (left <= 0) { clearInterval(session.countdown); VX.auth.signOut('timeout'); }
        left -= 1;
      };
      tick();
      session.countdown = setInterval(tick, 1000);
      d.showModal();
    },
    stay() { clearInterval(session.countdown); $('#vx-timeout').close(); session.last = Date.now(); toast('You’re still signed in.', { type: 'success' }); },
  };

  /* =========================================================================
     Tabs keyboard model (automatic activation) — any [role=tablist]
     ======================================================================= */
  const selectTab = (tab, focus = true) => {
    const list = tab.closest('[role="tablist"]');
    $$('[role="tab"]', list).forEach((t) => {
      const sel = t === tab;
      t.setAttribute('aria-selected', String(sel));
      t.tabIndex = sel ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      // Multiple tabs may share one panel (saved views) — only toggle distinct panels
      if (panel && $$(`[aria-controls="${panel.id}"]`, list).length === 1) panel.hidden = !sel;
      if (panel && sel) panel.setAttribute('aria-labelledby', t.id);
    });
    if (focus) tab.focus();
    const key = list.dataset.vxSyncQuery;
    if (key && tab.dataset.tab) {
      const [p, qs = ''] = location.hash.replace(/^#/, '').split('?');
      const q = new URLSearchParams(qs); q.set(key, tab.dataset.tab);
      history.replaceState(null, '', `#${p}?${q}`); // deep-linkable, no re-render
    }
    document.dispatchEvent(new CustomEvent('vx:tab-change', { detail: { tab: tab.dataset.tab || tab.dataset.view, list } }));
  };

  /* =========================================================================
     Wire up global events (event delegation — survives re-renders)
     ======================================================================= */
  shell.bind = () => {
    const app = $('#vx-app');

    // Nav
    $('#vx-menu-btn').addEventListener('click', () => (app.dataset.navOpen === 'true' ? shell.closeMobileNav() : shell.openMobileNav()));
    $('#vx-backdrop').addEventListener('click', shell.closeMobileNav);
    $('#vx-collapse-btn').addEventListener('click', () => shell.setCollapsed(app.dataset.sidebar !== 'collapsed'));

    // Menus
    on(document, 'click', '[data-vx-menu]', (e, btn) => toggleMenu(btn));
    document.addEventListener('click', (e) => { if (!e.target.closest('.vx-menu, [data-vx-menu]')) closeAllMenus(); });

    // Tenant switch
    on(document, 'click', '[data-vx-tenant]', async (e, b) => {
      const id = b.dataset.vxTenant;
      closeAllMenus();
      if (id === VX.session.activeTenantId) return;
      if (shell.dirty && !window.confirm('You have unsaved changes. Switch organization and discard them?')) return;
      await VX.auth.switchTenant(id);
    });
    document.addEventListener('vx:tenant-changed', () => {
      shell.renderTenant(); shell.renderNav();
      toast(`Switched to ${VX.auth.tenant.name}`, { type: 'success' });
      VX.router.handle();
    });

    // Theme / density / slot labels / sign out
    on(document, 'click', '[data-vx-theme]', (e, b) => shell.applyTheme(b.dataset.vxTheme));
    on(document, 'click', '[data-vx-density]', (e, b) => shell.applyDensity(b.dataset.vxDensity));
    on(document, 'click', '#vx-slot-toggle', () => shell.applySlotLabels(document.documentElement.dataset.slotLabels !== 'on'));
    on(document, 'click', '[data-vx-signout]', () => VX.auth.signOut());
    on(document, 'click', '[data-vx-reload]', () => VX.router.handle());

    // Command palette
    on(document, 'click', '[data-vx-palette]', () => palette.open());
    $('#vx-palette-input').addEventListener('input', (e) => palette.render(e.target.value));
    $('#vx-palette-input').addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); palette.move(1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); palette.move(-1); }
      else if (e.key === 'Enter') { e.preventDefault(); palette.choose(); }
    });
    on($('#vx-palette-list'), 'click', '[role="option"]', (e, li) => palette.choose(Number(li.id.split('-')[1])));
    $('#vx-palette').addEventListener('click', (e) => { if (e.target.id === 'vx-palette') palette.close(); }); // backdrop click

    // Session timeout dialog
    $('#vx-timeout-stay').addEventListener('click', session.stay);
    $('#vx-timeout-signout').addEventListener('click', () => VX.auth.signOut());

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) || document.activeElement.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && VX.auth.feature('commandPalette')) { e.preventDefault(); palette.open(); }
      else if (e.key === '/' && !typing) { e.preventDefault(); palette.open(); }
      else if (e.key === 'Escape') {
        const btn = [...openMenus][0];
        if (btn) closeMenu(btn, true);
        else if (app.dataset.navOpen === 'true') { shell.closeMobileNav(); $('#vx-menu-btn').focus(); }
      }
    });

    // Tabs
    on(document, 'click', '[role="tab"]', (e, t) => selectTab(t, false));
    on(document, 'keydown', '[role="tab"]', (e, t) => {
      const tabs = $$('[role="tab"]', t.closest('[role="tablist"]'));
      const i = tabs.indexOf(t);
      const map = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      selectTab(tabs[(map[e.key] + tabs.length) % tabs.length]);
    });

    // Generic disclosure: [data-vx-toggle][aria-controls]
    on(document, 'click', '[data-vx-toggle]', (e, b) => {
      const p = document.getElementById(b.getAttribute('aria-controls'));
      const open = b.getAttribute('aria-expanded') !== 'true';
      b.setAttribute('aria-expanded', String(open)); p.hidden = !open;
    });

    // Settings in-page section jump (hash router owns the URL hash)
    on(document, 'click', '[data-vx-scroll]', (e, b) => { const t = document.getElementById(b.dataset.vxScroll); if (t) { t.scrollIntoView({ behavior: 'smooth', block: 'start' }); t.focus({ preventScroll: true }); } });

    // Tables: select all / rows / sort
    on(document, 'change', '[data-vx-select-all]', (e, cb) => {
      const table = cb.closest('table');
      $$('[data-vx-select-row]', table).forEach((r) => { r.checked = cb.checked; });
      updateBulk(table);
    });
    on(document, 'change', '[data-vx-select-row]', (e, cb) => updateBulk(cb.closest('table')));
    on(document, 'click', '[data-vx-sort]', (e, b) => {
      const th = b.closest('th');
      const next = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
      $$('th[aria-sort]', th.closest('tr')).forEach((h) => h.setAttribute('aria-sort', 'none'));
      th.setAttribute('aria-sort', next);
      announce(`Sorted by ${b.textContent.trim()}, ${next}`);
      th.closest('table').dispatchEvent(new CustomEvent('vx:sort', { bubbles: true, detail: { column: b.textContent.trim(), direction: next } }));
    });
    on(document, 'input', '[data-vx-list-search]', VX.utils.debounce((e, inp) => {
      inp.dispatchEvent(new CustomEvent('vx:search', { bubbles: true, detail: { q: inp.value } }));
    }, 300));

    // Forms: dirty tracking, validation, wizard next, draft
    on(document, 'input', '[data-vx-form]', () => { shell.dirty = true; });
    document.addEventListener('submit', (e) => {
      const form = e.target.closest('[data-vx-form]');
      if (!form) return;
      e.preventDefault();
      if (!validate(form)) return;
      shell.dirty = false;
      const next = e.submitter && e.submitter.dataset.vxNext;
      form.dispatchEvent(new CustomEvent('vx:submit', { bubbles: true, detail: { data: Object.fromEntries(new FormData(form)) } }));
      if (next) VX.router.go(next);
      else toast('Saved successfully.', { type: 'success' });
    });
    on(document, 'click', '[data-vx-save-draft]', () => { shell.dirty = false; toast('Draft saved.', { type: 'success' }); });
    on(document, 'click', '[data-vx-focus]', (e, a) => { e.preventDefault(); const t = document.getElementById(a.dataset.vxFocus); if (t) { t.focus(); t.scrollIntoView({ block: 'center' }); } });

    // Unsaved-changes guards (SPA + browser)
    VX.router.guard(() => !shell.dirty || window.confirm('You have unsaved changes. Leave this page without saving?'));
    window.addEventListener('beforeunload', (e) => { if (shell.dirty) { e.preventDefault(); e.returnValue = ''; } });

    // Connectivity
    window.addEventListener('offline', () => toast('You’re offline. Changes will sync when you reconnect.', { type: 'danger' }));
    window.addEventListener('online', () => toast('Back online.', { type: 'success' }));
  };

  const updateBulk = (table) => {
    const rows = $$('[data-vx-select-row]', table);
    const n = rows.filter((r) => r.checked).length;
    const all = $('[data-vx-select-all]', table);
    if (all) { all.checked = n === rows.length && n > 0; all.indeterminate = n > 0 && n < rows.length; }
    const card = table.closest('[role="tabpanel"], .vx-card');
    const bar = card && $('[data-vx-bulkbar]', card);
    if (bar) { bar.hidden = n === 0; $('[data-vx-bulk-count]', bar).textContent = `${n} selected`; }
  };

  /* =========================================================================
     Boot
     ======================================================================= */
  shell.init = () => {
    VX.auth.restore();
    shell.applyTheme();
    shell.applyDensity();
    shell.applySlotLabels();
    shell.setCollapsed(store.get('sidebar') === 'collapsed');

    const env = VX.config.env;
    $('.vx-topbar').dataset.env = env;
    const badge = $('#vx-env');
    badge.hidden = env === 'PROD';
    badge.textContent = `${env} environment`;

    $('#vx-year').textContent = new Date().getFullYear();
    $('#vx-version').textContent = `v${VX.config.version} · ERD ${VX.config.erdBaseline}`;
    $('#vx-legal').innerHTML = String(html`${VX.config.legal.map((l) => html`<li><a href="${l.href}">${l.label}</a></li>`)}`);
    $('#vx-support').textContent = `Support ${VX.config.support.phone}`;

    shell.renderUser();
    shell.renderTenant();
    shell.renderNav();
    shell.bind();
    session.start();
  };

  VX.shell = shell;
  VX.ui = Object.assign(VX.ui || {}, { toast, validate, palette });
})(window.VX = window.VX || {});
