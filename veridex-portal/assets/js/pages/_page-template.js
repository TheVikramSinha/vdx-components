/* =============================================================================
   PAGE FILE TEMPLATE — copy to assets/js/pages/<module>.pages.js
   One file per module. Add a <script> tag for it in index.html ABOVE app.js.

   Every page = route + template + slots. Nothing else.
     1. Pick a template: dashboard | list | detail | form | wizard | settings | report | blank
     2. Fill only the slots you need. Unfilled slots remain skeletons.
     3. Put module-specific components in assets/js/modules/<module>/ and
        module CSS in assets/css/modules/<module>.css — never in core/.
   ========================================================================== */
(window.VX.pageQueue = window.VX.pageQueue || []).push(function (VX) {
  'use strict';
  const { html, icon } = VX.utils;
  const { card, empty } = VX.ui;

  // Example: override the conventional list route for a module.
  // (Commented out — this file is a reference, not a live page.)
  /*
  VX.pages.register({
    path: '/billing/list',            // conventional path → overrides default
    template: 'list',
    module: 'billing',                // entitlement gate
    permission: 'billing.read',       // permission gate (UI only; API re-checks)
    title: 'Billing accounts',
    description: 'Direct-bill and agency-bill accounts.',
    options: {
      views: ['All accounts', 'Past due', 'Pending cancellation'],
      columns: [
        { label: 'Account #', sort: true },
        { label: 'Insured', sort: true },
        { label: 'Bill type' },
        { label: 'Status' },
        { label: 'Balance', num: true, sort: true },
      ],
    },
    slots: {
      // Replace a skeleton with real content:
      // table: (ctx) => html`<my-table>…</my-table>`,
    },
    async onMount(ctx, el) {
      // Fetch data, then replace slot contents:
      // const data = await api.get(`/billing/accounts?${new URLSearchParams(ctx.query)}`);
      // el.querySelector('[data-slot="table"]').innerHTML = String(renderTable(data));
      el.addEventListener('vx:search', (e) => console.log('search', e.detail.q));
      el.addEventListener('vx:sort', (e) => console.log('sort', e.detail));
    },
    onLeave(ctx) {
      // abort fetches, clear timers
    },
  });
  */
});
