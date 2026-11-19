/* =============================================================================
   VeriDex One — bootstrap
   Load order (see index.html):
     core/utils → core/config → core/auth → core/registry → core/router
     → core/templates → core/shell → pages/*.js → app.js
   ========================================================================== */
(function (VX) {
  'use strict';
  const { html } = VX.utils;

  /* ---------- 1. Platform (non-module) routes ---------- */
  VX.pages.registerAll([
    {
      path: '/',
      template: 'dashboard',
      overline: 'Workspace',
      title: () => {
        const h = new Date().getHours();
        const part = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
        return `Good ${part}, ${VX.session.user.name.split(' ')[0]}`;
      },
      description: 'Your work, approvals and key numbers across every module you have access to.',
      options: { kpis: ['Open tasks', 'Awaiting my approval', 'Due this week', 'SLA at risk'] },
    },
    {
      path: '/inbox',
      template: 'list',
      overline: 'Workspace',
      title: 'My work',
      description: 'Tasks, referrals and approvals assigned to you or your teams (Workflow & approvals).',
      options: {
        views: ['Assigned to me', 'My teams', 'Approvals', 'Mentions', 'Completed'],
        columns: [{ label: 'Task', sort: true }, { label: 'Related record' }, { label: 'Type' }, { label: 'Due', sort: true }, { label: 'Priority', sort: true }, { label: 'Assigned to' }],
      },
    },
    {
      path: '/search',
      template: 'list',
      overline: 'Workspace',
      title: 'Search',
      description: 'Find policies, claims, submissions, parties and documents across your organization.',
      options: {
        views: ['All results', 'Policies', 'Claims', 'Submissions', 'Parties', 'Documents'],
        columns: [{ label: 'Result' }, { label: 'Type' }, { label: 'Status' }, { label: 'Updated', sort: true }],
        selectable: false,
      },
    },
    { path: '/settings', template: 'settings', overline: 'Account', title: 'Settings', options: { sections: ['Profile', 'Notifications', 'Security & sign-in', 'Regional preferences', 'Accessibility'] } },
    { path: '/profile', template: 'settings', overline: 'Account', title: 'My profile', options: { sections: ['Personal information', 'Licenses & appointments', 'Teams'] } },
    { path: '/notifications', template: 'list', overline: 'Account', title: 'Notifications', options: { views: ['Unread', 'All'], columns: [{ label: 'Notification' }, { label: 'Module' }, { label: 'Received', sort: true }], selectable: true } },
    { path: '/help', template: 'blank', overline: 'Support', title: 'Help & support', description: `Call ${VX.config.support.phone} (${VX.config.support.hours}) or email ${VX.config.support.email}.` },

    /* Legal (US) */
    { path: '/legal/privacy', template: 'blank', overline: 'Legal', title: 'Privacy Policy' },
    { path: '/legal/terms', template: 'blank', overline: 'Legal', title: 'Terms of Use' },
    { path: '/legal/accessibility', template: 'blank', overline: 'Legal', title: 'Accessibility statement', description: 'VeriDex One is designed to conform to WCAG 2.2 Level AA and Section 508. Report a barrier to our support team.' },
    { path: '/legal/privacy-choices', template: 'form', overline: 'Legal', title: 'Your privacy choices', description: 'Opt out of the sale or sharing of personal information and limit use of sensitive personal information (CCPA/CPRA and other state privacy laws).', options: { sections: ['Your request'] } },
    { path: '/legal/licensing', template: 'blank', overline: 'Legal', title: 'Licensing & disclosures', description: 'Producer and carrier licensing information by state.' },

    /* System pages (directly addressable for testing) */
    { path: '/404', template: 'system', title: 'Page not found', options: { code: '404' } },
    { path: '/403', template: 'system', title: 'Access denied', options: { code: '403' } },
    { path: '/500', template: 'system', title: 'Error', options: { code: '500' } },
    { path: '/maintenance', template: 'system', title: 'Maintenance', options: { code: 'maintenance' } },
    { path: '/offline', template: 'system', title: 'Offline', options: { code: 'offline' } },
  ]);

  /* ---------- 2. Conventional routes for every module (overview · list · new · :id) ---------- */
  [...VX.registry.modules, ...VX.registry.foundation].forEach((m) => VX.pages.conventional(m));

  /* ---------- 3. Page files (assets/js/pages/*.js) registered BEFORE this file
                    override or extend the conventional routes. They were queued
                    in VX.pageQueue so conventional routes exist first. ---------- */
  (VX.pageQueue || []).forEach((fn) => fn(VX));

  /* ---------- 4. Start ---------- */
  VX.shell.init();
  VX.router.start();
})(window.VX);
