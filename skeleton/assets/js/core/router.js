/* =============================================================================
   VX.router + VX.pages — hash router with params, query, guards
   Hash routing works on any static host and from file://. Swap to History API
   (pushState) when served behind a server that rewrites to index.html.

   Route definition (what every page registers):
   {
     path: '/claims/:id',          // :params become ctx.params
     title: 'Claim' | (ctx) => '…',// document title + H1
     template: 'detail',           // dashboard | list | detail | form | wizard | settings | report | blank
     module: 'claims',             // entitlement gate + overline + breadcrumb root
     permission: 'claims.read',    // permission gate
     crumbs: [{label, path}],      // optional; auto-derived when omitted
     description: '…',
     options: {…},                 // template options (tabs, steps, columns…)
     slots: { name: (ctx) => html`…` },  // replace skeleton slots with real content
     actions: (ctx) => html`…`,    // page header actions
     onMount(ctx, el) {}, onLeave(ctx) {}
   }
   ========================================================================== */
(function (VX) {
  'use strict';

  const routes = [];
  let current = null;
  let lastHash = null;
  let suppressNext = false;
  const guards = new Set();

  const compile = (path) => {
    const keys = [];
    const pattern = path
      .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
      .replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; });
    return { re: new RegExp(`^${pattern}/?$`), keys };
  };

  const parseHash = () => {
    const h = decodeURI(location.hash.replace(/^#/, '')) || '/';
    const [path, qs = ''] = h.split('?');
    return { path: path || '/', query: Object.fromEntries(new URLSearchParams(qs)) };
  };

  const resolve = (path) => {
    for (const r of routes) {
      const m = r._re.exec(path);
      if (m) return { route: r, params: Object.fromEntries(r._keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) };
    }
    return null;
  };

  const router = {
    routes,
    get current() { return current; },

    add(def) {
      const { re, keys } = compile(def.path);
      def._re = re; def._keys = keys;
      // Literal segments win over params: '/claims/new' before '/claims/:id'
      const literal = (def.path.match(/\/[^:/][^/]*/g) || []).length;
      def._weight = literal * 10 - keys.length;
      const idx = routes.findIndex((r) => r.path === def.path);
      if (idx >= 0) routes[idx] = { ...routes[idx], ...def }; // later registration overrides/extends
      else routes.push(def);
      routes.sort((a, b) => b._weight - a._weight);
      return def;
    },

    /** Register a leave-guard. Return false to block navigation (e.g. unsaved changes). */
    guard(fn) { guards.add(fn); return () => guards.delete(fn); },

    go(path, { replace = false } = {}) {
      const target = '#' + path;
      if (replace) { history.replaceState(null, '', target); this.handle(); }
      else location.hash = path;
    },

    href(path) { return '#' + path; },

    async handle() {
      if (suppressNext) { suppressNext = false; return; }
      const { path, query } = parseHash();

      for (const g of guards) {
        if (g({ from: current, toPath: path }) === false) {
          suppressNext = true;
          location.hash = lastHash ? lastHash.replace(/^#/, '') : '/';
          return;
        }
      }

      if (current && current.route.onLeave) { try { current.route.onLeave(current); } catch (e) { console.error(e); } }

      const hit = resolve(path);
      const ctx = hit
        ? { route: hit.route, params: hit.params, query, path }
        : { route: resolve('/404').route, params: {}, query, path };

      current = ctx;
      lastHash = location.hash || '#/';
      await VX.shell.render(ctx);
    },

    start() {
      window.addEventListener('hashchange', () => this.handle());
      this.handle();
    },
  };

  /* ---------- Page API used by pages/*.js ---------- */
  const pages = {
    register(def) { return router.add(def); },
    /** Register many at once. */
    registerAll(defs) { defs.forEach((d) => router.add(d)); },
    /**
     * Generate the four conventional routes for a registry module:
     *   base            → dashboard (module overview)
     *   base/list       → list (work queue / search results)
     *   base/new        → form  (create)
     *   base/:id        → detail (record view)
     */
    conventional(mod) {
      const perm = (a) => `${mod.id}.${a}`;
      const isFoundation = !!mod.permission;
      const gate = isFoundation ? { permission: mod.permission } : { module: mod.id };
      const rec = mod.record || 'Record';
      router.add({ path: mod.base, template: 'dashboard', title: mod.label, description: `${mod.long} overview.`, ...gate, permission: isFoundation ? mod.permission : perm('read') });
      router.add({ path: `${mod.base}/list`, template: 'list', title: `All ${mod.label.toLowerCase()}`, ...gate, permission: isFoundation ? mod.permission : perm('read') });
      router.add({ path: `${mod.base}/new`, template: 'form', title: `New ${rec.toLowerCase()}`, ...gate, permission: isFoundation ? mod.permission.replace('.read', '.create') : perm('create') });
      router.add({ path: `${mod.base}/:id`, template: 'detail', title: (ctx) => `${rec} ${ctx.params.id}`, ...gate, permission: isFoundation ? mod.permission : perm('read') });
    },
  };

  VX.router = router;
  VX.pages = pages;
})(window.VX = window.VX || {});
