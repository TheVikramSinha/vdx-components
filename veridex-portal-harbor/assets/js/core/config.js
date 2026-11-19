/* =============================================================================
   VX.config — environment + locale + platform settings
   In production, inject this from the server (e.g. /config.json or a templated
   <script>) — never hard-code per environment in the bundle.
   ========================================================================== */
(function (VX) {
  'use strict';

  VX.config = {
    appName: 'VeriDex One',
    productName: 'Platform',
    version: '0.1.0',
    build: 'skeleton',
    erdBaseline: 'L3 v4.20',

    /** DEV | QA | UAT | PROD — non-PROD shows an environment badge + ochre stripe */
    env: 'DEV',

    /* US defaults. Users may override time zone in their profile. */
    locale: 'en-US',
    currency: 'USD',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Chicago',

    /* Session (NIST SP 800-63B AAL2 guidance: re-auth after inactivity) */
    session: {
      idleMinutes: 15,      // sign out after this much inactivity
      warnSeconds: 120,     // warning dialog countdown before sign-out
      loginUrl: 'auth/login.html',
    },

    api: {
      baseUrl: '/api/v1',   // versioned APIs (ERD: "Versioned APIs and event bus")
      timeoutMs: 30000,
    },

    support: {
      email: 'support@veridex.example',
      phone: '1-800-555-0100',
      hours: 'Mon–Fri, 8 AM – 8 PM ET',
    },

    /* US legal / privacy footer links (CCPA/CPRA "Do Not Sell or Share",
       accessibility statement for ADA/Section 508). */
    legal: [
      { label: 'Privacy Policy', href: '#/legal/privacy' },
      { label: 'Terms of Use', href: '#/legal/terms' },
      { label: 'Accessibility', href: '#/legal/accessibility' },
      { label: 'Your Privacy Choices', href: '#/legal/privacy-choices' },
      { label: 'Licensing', href: '#/legal/licensing' },  // producer licensing disclosures by state
    ],

    /* Developer aids — turn off in PROD */
    dev: {
      slotLabels: true,     // outline skeleton slots with their names
    },
  };
})(window.VX = window.VX || {});
