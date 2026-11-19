/* =============================================================================
   VX.session / VX.auth — identity, tenant context, entitlements, permissions
   ERD mapping:
     identity (Module 1A)      → user, tenant, site, membership
     authorization (Module 1B) → roles, groups, permissions (OPA decides)
     Module 29 catalogue       → modules, features, entitlements (runtime gating)
   IMPORTANT: client-side checks only HIDE UI. Every API call is authorised
   server-side (OPA + Postgres RLS on tenant_id). Never trust the client.
   ========================================================================== */
(function (VX) {
  'use strict';

  /* ---------- Mock session — replace with GET /api/v1/me on boot ---------- */
  VX.session = {
    user: {
      id: 'usr_0001',
      name: 'Jordan Avery',
      email: 'jordan.avery@summitmutual.example',
      title: 'Senior Underwriter',
      timeZone: null, // null → VX.config.timeZone
    },
    /* Tenants this user holds a membership in. Types follow the ERD tenant model. */
    tenants: [
      { id: 'tn_carrier_01', name: 'Summit Mutual Insurance Co.', type: 'Carrier' },
      { id: 'tn_mga_02', name: 'Ridgeline Underwriting Managers', type: 'MGA' },
      { id: 'tn_broker_03', name: 'Lakeshore Risk Partners', type: 'Broker' },
    ],
    activeTenantId: 'tn_carrier_01',
    /* Entitlement projection for the active tenant (Module 29). Module ids from VX.registry. */
    entitlements: [
      'submission', 'underwriting', 'policy', 'billing', 'claims', 'product', 'rating',
      'distribution', 'finance', 'reinsurance', 'compliance', 'insight', 'marketplace',
    ],
    /* Effective permissions (projection of roles/groups). Supports wildcards: 'claims.*', '*' */
    permissions: ['*'],
    /* Feature flags (Module 29 feature_flag) */
    features: { commandPalette: true, notifications: true, darkMode: true },
  };

  const match = (granted, wanted) => {
    if (granted === '*' || granted === wanted) return true;
    if (granted.endsWith('.*')) return wanted.startsWith(granted.slice(0, -1));
    return false;
  };

  VX.auth = {
    get tenant() { return VX.session.tenants.find((t) => t.id === VX.session.activeTenantId) || VX.session.tenants[0]; },

    /** Is the module licensed for the active tenant? */
    hasModule(moduleId) { return !moduleId || VX.session.entitlements.includes(moduleId); },

    /** Does the user hold this permission? e.g. can('claims.reserve.update') */
    can(permission) { return !permission || VX.session.permissions.some((g) => match(g, permission)); },

    feature(flag) { return !!VX.session.features[flag]; },

    /** Route-level gate. Returns null when allowed, else a system page code. */
    gate(route) {
      if (route.module && !this.hasModule(route.module)) return 'not-licensed';
      if (route.permission && !this.can(route.permission)) return '403';
      return null;
    },

    /** Switch tenant context. Real impl: POST /api/v1/session/tenant → new token → reload entitlements. */
    async switchTenant(tenantId) {
      if (!VX.session.tenants.some((t) => t.id === tenantId)) throw new Error('Unknown tenant');
      VX.session.activeTenantId = tenantId;
      VX.utils.store.set('tenant', tenantId);
      document.dispatchEvent(new CustomEvent('vx:tenant-changed', { detail: { tenantId } }));
    },

    /** Sign-out: clear in-memory state, call IdP end-session, redirect. */
    signOut(reason = 'signed-out') {
      VX.utils.store.remove('tenant');
      window.location.href = `${VX.config.session.loginUrl}?reason=${encodeURIComponent(reason)}`;
    },

    restore() {
      const saved = VX.utils.store.get('tenant');
      if (saved && VX.session.tenants.some((t) => t.id === saved)) VX.session.activeTenantId = saved;
    },
  };
})(window.VX = window.VX || {});
