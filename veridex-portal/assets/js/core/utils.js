/* =============================================================================
   VX.utils — safe HTML, US formatting, PII masking, storage, a11y announcer
   Classic script (no build step, runs from file:// and any static host).
   ========================================================================== */
(function (VX) {
  'use strict';

  /* ---------- Safe HTML ----------
     html`<p>${value}</p>` escapes every interpolation by default (XSS-safe).
     Wrap trusted markup with raw() to opt out. Arrays are joined. */
  class SafeHTML { constructor(v) { this.v = v; } toString() { return this.v; } }
  const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
  const val = (v) => {
    if (v == null || v === false) return '';
    if (v instanceof SafeHTML) return v.v;
    if (Array.isArray(v)) return v.map(val).join('');
    return esc(v);
  };
  const html = (strings, ...vals) =>
    new SafeHTML(strings.reduce((acc, s, i) => acc + s + (i < vals.length ? val(vals[i]) : ''), ''));
  const raw = (s) => new SafeHTML(String(s ?? ''));

  /* ---------- US locale formatting ----------
     All display formatting goes through VX.fmt so locale/time zone live in one place. */
  const L = () => (VX.config && VX.config.locale) || 'en-US';
  const TZ = () => (VX.config && VX.config.timeZone) || undefined;
  const toDate = (d) => {
    if (d instanceof Date) return d;
    // 'YYYY-MM-DD' (date-only, e.g. policy effective date) → local midnight, avoids UTC day-shift
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) { const [y, m, dd] = d.split('-').map(Number); return new Date(y, m - 1, dd); }
    return new Date(d);
  };
  const fmt = {
    /** $1,234.56 — amounts arrive as numeric(19,4) strings + currency_code (ERD "Money and codes") */
    currency: (n, code = (VX.config && VX.config.currency) || 'USD', opts = {}) =>
      n == null || n === '' ? '—' : new Intl.NumberFormat(L(), { style: 'currency', currency: code, ...opts }).format(Number(n)),
    compactCurrency: (n, code = 'USD') =>
      n == null ? '—' : new Intl.NumberFormat(L(), { style: 'currency', currency: code, notation: 'compact', maximumFractionDigits: 1 }).format(Number(n)),
    number: (n, opts) => (n == null ? '—' : new Intl.NumberFormat(L(), opts).format(Number(n))),
    percent: (n, digits = 1) => (n == null ? '—' : new Intl.NumberFormat(L(), { style: 'percent', maximumFractionDigits: digits }).format(Number(n))),
    /** 11/18/2026 */
    date: (d) => (d ? new Intl.DateTimeFormat(L(), { month: '2-digit', day: '2-digit', year: 'numeric' }).format(toDate(d)) : '—'),
    /** Nov 18, 2026 */
    dateLong: (d) => (d ? new Intl.DateTimeFormat(L(), { month: 'short', day: 'numeric', year: 'numeric' }).format(toDate(d)) : '—'),
    /** 11/18/2026, 6:05 PM CST */
    dateTime: (d) => (d ? new Intl.DateTimeFormat(L(), { month: '2-digit', day: '2-digit', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: TZ(), timeZoneName: 'short' }).format(toDate(d)) : '—'),
    relative: (d) => {
      const diff = (toDate(d).getTime() - Date.now()) / 1000;
      const rtf = new Intl.RelativeTimeFormat(L(), { numeric: 'auto' });
      const units = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
      for (const [u, s] of units) if (Math.abs(diff) >= s) return rtf.format(Math.round(diff / s), u);
      return rtf.format(Math.round(diff), 'second');
    },
    /** Policy term: 01/01/2026 – 01/01/2027 */
    term: (from, to) => `${fmt.date(from)} – ${fmt.date(to)}`,
    /** (555) 123-4567 */
    phone: (s) => {
      const d = String(s || '').replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
      return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : s || '—';
    },
    /** 12345-6789 */
    zip: (s) => { const d = String(s || '').replace(/\D/g, ''); return d.length === 9 ? `${d.slice(0, 5)}-${d.slice(5)}` : d || '—'; },
    /** PII masking (SSN, FEIN, DL, bank acct, VIN tail) — show last N only. GLBA / state privacy laws. */
    mask: (s, visible = 4) => { const v = String(s || ''); return v ? '•••• ' + v.slice(-visible) : '—'; },
    initials: (name) => String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join(''),
  };

  /* ---------- Safe storage (Safari private mode / locked-down browsers throw) ----------
     Store only UI preferences. NEVER store tokens, PII or PHI in web storage. */
  const store = {
    key: (k) => `vx:${k}`,
    get(k, fallback = null) { try { const v = localStorage.getItem(this.key(k)); return v == null ? fallback : JSON.parse(v); } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(this.key(k), JSON.stringify(v)); } catch { /* noop */ } },
    remove(k) { try { localStorage.removeItem(this.key(k)); } catch { /* noop */ } },
  };

  /* ---------- DOM helpers ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const on = (root, evt, sel, fn) => root.addEventListener(evt, (e) => { const t = e.target.closest(sel); if (t && root.contains(t)) fn(e, t); });
  const debounce = (fn, ms = 250) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const uid = (p = 'vx') => `${p}-${Math.random().toString(36).slice(2, 9)}`;
  /** Correlation id shown on error pages so support can trace logs (W3C traceparent-style). */
  const correlationId = () => (crypto.randomUUID ? crypto.randomUUID() : uid('cid')).slice(0, 18).toUpperCase();

  /* ---------- Screen-reader announcer (polite / assertive live regions) ---------- */
  const announce = (msg, politeness = 'polite') => {
    const el = document.getElementById(politeness === 'assertive' ? 'vx-live-assertive' : 'vx-live-polite');
    if (!el) return;
    el.textContent = '';
    setTimeout(() => { el.textContent = msg; }, 50);
  };

  /* ---------- Icon from inline sprite ---------- */
  const icon = (name, cls = '') =>
    raw(`<svg class="vx-icon ${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"></use></svg>`);

  VX.utils = { html, raw, esc, val, SafeHTML, fmt, store, $, $$, on, debounce, uid, correlationId, announce, icon };
  VX.fmt = fmt;
})(window.VX = window.VX || {});
