/* =============================================================================
   Sign-in flow (UI skeleton). Real auth = OIDC Authorization Code + PKCE against
   the tenant's IdP (e.g. Microsoft Entra ID / Okta). The portal NEVER handles
   SSO passwords; the local password step is only for non-federated tenants.
   Tokens live in HttpOnly, Secure, SameSite cookies — never in web storage.
   ========================================================================== */
(function (VX) {
  'use strict';
  const { $, store, announce } = VX.utils;

  const REASONS = {
    timeout: 'You were signed out after a period of inactivity. Sign in again to continue.',
    'signed-out': 'You have signed out.',
    expired: 'Your session expired. Sign in again to continue.',
  };
  const reason = new URLSearchParams(location.search).get('reason');
  if (reason && REASONS[reason]) { $('#auth-reason').hidden = false; $('#auth-reason-text').textContent = REASONS[reason]; }

  const remembered = store.get('remember-email');
  if (remembered) { $('#email').value = remembered; $('#remember').checked = true; }

  const show = (id) => {
    ['step-email', 'step-password', 'step-mfa'].forEach((s) => { $(`#${s}`).hidden = s !== id; });
    const h = $(`#${id} h1`); h.focus(); announce(h.textContent);
  };

  const fieldError = (input, msg) => {
    const err = $(`#${input.id}-error`);
    err.hidden = !msg; err.textContent = msg ? `Error: ${msg}` : '';
    input.setAttribute('aria-invalid', String(!!msg));
    msg ? input.setAttribute('aria-describedby', err.id) : input.removeAttribute('aria-describedby');
    input.closest('.vx-field').toggleAttribute('data-invalid', !!msg);
    if (msg) input.focus();
    return !msg;
  };

  $('#step-email').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = $('#email');
    if (!fieldError(email, !email.value ? 'Enter your work email' : !email.checkValidity() ? 'Enter an email address in the correct format, like name@company.com' : '')) return;
    $('#remember').checked ? store.set('remember-email', email.value) : store.remove('remember-email');
    // Home-realm discovery: GET /api/v1/auth/discover?email=… → { federated: true, authorizeUrl }
    $('#who').textContent = email.value;
    show('step-password');
  });

  $('#sso-btn').addEventListener('click', () => {
    // Redirect to IdP authorize endpoint (OIDC + PKCE). Skeleton: go straight to app.
    window.location.href = '../index.html';
  });

  $('#toggle-pw').addEventListener('click', (e) => {
    const pw = $('#password'); const on = pw.type === 'password';
    pw.type = on ? 'text' : 'password';
    e.currentTarget.textContent = on ? 'Hide' : 'Show';
    e.currentTarget.setAttribute('aria-pressed', String(on));
  });

  $('#step-password').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!fieldError($('#password'), $('#password').value ? '' : 'Enter your password')) return;
    show('step-mfa');
  });

  $('#step-mfa').addEventListener('submit', (e) => {
    e.preventDefault();
    const otp = $('#otp');
    if (!fieldError(otp, /^\d{6}$/.test(otp.value) ? '' : 'Enter the 6-digit code')) return;
    window.location.href = '../index.html';
  });

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-back]');
    if (b) show(b.dataset.back);
  });
})(window.VX);
