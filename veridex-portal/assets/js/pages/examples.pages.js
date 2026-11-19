/* =============================================================================
   EXAMPLE PAGES — show how routes override conventions and fill slots.
   Safe to delete once real module pages exist.
   ========================================================================== */
(window.VX.pageQueue = window.VX.pageQueue || []).push(function (VX) {
  'use strict';
  const { html, icon } = VX.utils;
  const { card, empty } = VX.ui;

  /* 1. Claims list — custom views + columns (still skeleton rows) */
  VX.pages.register({
    path: '/claims/list',
    template: 'list',
    module: 'claims',
    permission: 'claims.read',
    title: 'Claims',
    description: 'All open and recently closed claims for your organization.',
    options: {
      views: ['My claims', 'Unassigned', 'Reserve review', 'Litigation', 'Closed (30 days)'],
      columns: [
        { label: 'Claim #', sort: true }, { label: 'Insured', sort: true }, { label: 'Loss date', sort: true },
        { label: 'Line' }, { label: 'Status' }, { label: 'Adjuster' }, { label: 'Incurred', num: true, sort: true },
      ],
      createLabel: 'Report a claim',
    },
  });

  /* 2. Claim FNOL — conventional "new" route upgraded to a wizard */
  VX.pages.register({
    path: '/claims/new',
    template: 'wizard',
    module: 'claims',
    permission: 'claims.create',
    title: 'Report a claim',
    description: 'First notice of loss. You can save a draft and return at any time.',
    options: { steps: ['Policy lookup', 'Loss details', 'Parties & vehicles', 'Documents', 'Review & submit'] },
  });

  /* 3. Policy record — custom tabs + summary labels + a filled slot */
  VX.pages.register({
    path: '/policies/:id',
    template: 'detail',
    module: 'policy',
    permission: 'policy.read',
    title: (ctx) => `Policy ${ctx.params.id}`,
    options: {
      tabs: ['Overview', 'Coverages', 'Locations & vehicles', 'Billing', 'Documents', 'Transactions', 'Activity'],
      summary: ['Named insured', 'Policy term', 'Line of business', 'Written premium', 'Producer'],
    },
    slots: {
      status: () => html`<span class="vx-badge vx-badge--success">In force</span>`,
      'tab-documents': () => card({
        title: 'Documents',
        body: empty({ icon: 'folder', title: 'No documents yet', body: 'Declarations, endorsements and certificates appear here once issued.', action: html`<button class="vx-btn vx-btn--secondary" type="button">${icon('plus')} Upload document</button>` }),
      }),
    },
  });

  /* 4. Insight 360 — report template on the module root */
  VX.pages.register({
    path: '/insight',
    template: 'report',
    module: 'insight',
    permission: 'insight.read',
    title: 'Insight 360',
    description: 'Portfolio, loss and distribution analytics.',
  });
});
