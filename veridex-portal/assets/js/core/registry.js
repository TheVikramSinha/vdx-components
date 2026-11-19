/* =============================================================================
   VX.registry — module catalogue + navigation model
   Mirrors the ERD "How the modules connect": Foundation (always included) +
   sellable modules, each owning its own schema. One entry here = one module
   in the nav + its four conventional routes (overview, list, new, record).
   To add a module: add an entry below. No other shell code changes.
   ========================================================================== */
(function (VX) {
  'use strict';

  /** Navigation groups (sidebar order). */
  const groups = [
    { id: 'workspace', label: 'Workspace' },
    { id: 'core', label: 'Core insurance' },
    { id: 'product', label: 'Product' },
    { id: 'distribution', label: 'Distribution' },
    { id: 'finance', label: 'Finance & risk' },
    { id: 'insight', label: 'Insight' },
    { id: 'admin', label: 'Administration' },
  ];

  /**
   * Sellable modules.
   * id        — entitlement key (matches VX.session.entitlements)
   * schema    — owning DB schema (ERD) — for reference/API routing
   * base      — URL base; conventional routes are derived from it
   * record    — singular noun used in titles ("New claim", "Claim CLM-…")
   * icon      — sprite id
   */
  const modules = [
    { id: 'submission',   group: 'core',         label: 'Submissions',      long: 'Submission Intake & Data Intelligence', schema: 'submission', base: '/submissions',   record: 'Submission', icon: 'file-in' },
    { id: 'underwriting', group: 'core',         label: 'Underwriting',     long: 'Underwriting Workbench',                schema: 'risk',       base: '/underwriting',  record: 'Risk',       icon: 'clipboard' },
    { id: 'policy',       group: 'core',         label: 'Policies',         long: 'Policy Administration',                 schema: 'pas',        base: '/policies',      record: 'Policy',     icon: 'file-text' },
    { id: 'billing',      group: 'core',         label: 'Billing',          long: 'Billing',                               schema: 'billing',    base: '/billing',       record: 'Account',    icon: 'card' },
    { id: 'claims',       group: 'core',         label: 'Claims',           long: 'Claims',                                schema: 'claims',     base: '/claims',        record: 'Claim',      icon: 'shield' },
    { id: 'product',      group: 'product',      label: 'Product Studio',   long: 'Product Studio & Runtime',              schema: 'product',    base: '/products',      record: 'Product',    icon: 'layers' },
    { id: 'rating',       group: 'product',      label: 'Rating',           long: 'Rating Engine',                         schema: 'rating',     base: '/rating',        record: 'Rate table', icon: 'calculator' },
    { id: 'distribution', group: 'distribution', label: 'Broker & Agency',  long: 'Broker & Agency Portal',                schema: 'agency',     base: '/distribution',  record: 'Producer',   icon: 'briefcase' },
    { id: 'marketplace',  group: 'distribution', label: 'Marketplace',      long: 'Marketplace',                           schema: 'market',     base: '/marketplace',   record: 'Listing',    icon: 'store' },
    { id: 'finance',      group: 'finance',      label: 'Finance',          long: 'Finance & Accounting',                  schema: 'finance',    base: '/finance',       record: 'Journal',    icon: 'landmark' },
    { id: 'reinsurance',  group: 'finance',      label: 'Reinsurance',      long: 'Reinsurance',                           schema: 'reinsurance',base: '/reinsurance',   record: 'Treaty',     icon: 'repeat' },
    { id: 'compliance',   group: 'finance',      label: 'Compliance',       long: 'Compliance & Legal',                    schema: 'compliance', base: '/compliance',    record: 'Filing',     icon: 'scale' },
    { id: 'insight',      group: 'insight',      label: 'Insight 360',      long: 'Insight 360',                           schema: 'insight',    base: '/insight',       record: 'Report',     icon: 'chart' },
  ];

  /** Foundation (included with every sale). Admin screens, permission-gated, not entitlement-gated. */
  const foundation = [
    { id: 'org',          label: 'Organization & sites', long: 'Identity',                  schema: 'identity',      base: '/admin/organization', icon: 'building',  permission: 'admin.identity.read' },
    { id: 'users',        label: 'Users & teams',        long: 'Identity',                  schema: 'identity',      base: '/admin/users',        icon: 'users',     permission: 'admin.identity.read' },
    { id: 'access',       label: 'Roles & permissions',  long: 'Authorization',             schema: 'authorization', base: '/admin/access',       icon: 'key',       permission: 'admin.authorization.read' },
    { id: 'entitlements', label: 'Modules & entitlements', long: 'Platform catalogue',      schema: 'platform',      base: '/admin/entitlements', icon: 'layers',    permission: 'admin.platform.read' },
    { id: 'parties',      label: 'Parties',              long: 'Party',                     schema: 'party',         base: '/admin/parties',      icon: 'users',     permission: 'party.read' },
    { id: 'workflow',     label: 'Workflows & approvals', long: 'Workflow',                 schema: 'workflow',      base: '/admin/workflow',     icon: 'workflow',  permission: 'admin.workflow.read' },
    { id: 'docs',         label: 'Documents & comms',    long: 'Docs · Comms · Contract',   schema: 'docs',          base: '/admin/documents',    icon: 'folder',    permission: 'admin.docs.read' },
    { id: 'integration',  label: 'Integrations',         long: 'Integration',               schema: 'integration',   base: '/admin/integrations', icon: 'plug',      permission: 'admin.integration.read' },
    { id: 'reference',    label: 'Reference data',       long: 'Platform reference data',   schema: 'platform',      base: '/admin/reference',    icon: 'database',  permission: 'admin.platform.read' },
    { id: 'audit',        label: 'Audit log',            long: 'Platform',                  schema: 'platform',      base: '/admin/audit',        icon: 'history',   permission: 'admin.audit.read' },
  ];

  /** Workspace (personal, cross-module). */
  const workspace = [
    { id: 'home',   label: 'Home',     path: '/',       icon: 'home' },
    { id: 'inbox',  label: 'My work',  path: '/inbox',  icon: 'inbox', count: 12 },
    { id: 'search', label: 'Search',   path: '/search', icon: 'search' },
  ];

  VX.registry = {
    groups,
    modules,
    foundation,
    workspace,
    byId(id) { return modules.find((m) => m.id === id) || foundation.find((m) => m.id === id); },
    byPath(path) {
      const all = [...modules, ...foundation];
      return all.filter((m) => path === m.base || path.startsWith(m.base + '/')).sort((a, b) => b.base.length - a.base.length)[0] || null;
    },
    /** Build the sidebar model for the current user/tenant. */
    nav() {
      const can = VX.auth;
      const out = groups.map((g) => ({ ...g, items: [] }));
      const push = (gid, item) => out.find((g) => g.id === gid).items.push(item);
      workspace.forEach((w) => push('workspace', { ...w }));
      modules.filter((m) => can.hasModule(m.id) && can.can(`${m.id}.read`))
        .forEach((m) => push(m.group, { id: m.id, label: m.label, path: m.base, icon: m.icon }));
      foundation.filter((f) => can.can(f.permission))
        .forEach((f) => push('admin', { id: f.id, label: f.label, path: f.base, icon: f.icon }));
      return out.filter((g) => g.items.length);
    },
  };
})(window.VX = window.VX || {});
