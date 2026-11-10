/*
 * Accounts and Pro (optional).
 *
 * Runs only when config.js has Supabase details. Adds:
 *   - sign in by emailed link (no passwords)
 *   - Upgrade to Pro (Stripe Checkout) and Manage billing (Stripe customer portal)
 *   - for Pro users, RAMS saved to their account instead of this browser
 *
 * Payment is enforced by the database rules (supabase/migrations), not by this
 * file: without an active subscription the server refuses to save.
 */
(function () {
  'use strict';

  var cfg = window.RAMS_CONFIG || {};
  var App = window.RamsApp;
  if (!cfg.supabaseUrl || !cfg.supabaseAnonKey || !App) return;

  var SUPABASE_SRC = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js';
  var SUPABASE_SRI = 'sha384-0w2KAL2YHP6wKOkUDzkCDGgVvfmHnj02DHeQ6XcHOgTfFsGyonKOpShMH1x6nk9o';

  var slot = document.getElementById('account-slot');
  var panel = document.getElementById('account-panel');
  var banner = document.getElementById('account-banner');

  var client = null;
  var user = null;
  var plan = { pro: false, sub: null, accountCount: 0, loaded: false };
  var viewingAccount = false; // a lapsed Pro user browsing their account RAMS read-only
  var menuOpen = false;

  /* ---------- Helpers ---------- */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function longDate(iso) {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function priceText(prefix) {
    return cfg.proPriceLabel ? prefix + esc(cfg.proPriceLabel) : '';
  }

  function showBanner(html, kind) {
    banner.innerHTML = html;
    banner.className = 'account-banner no-print' + (kind ? ' is-' + kind : '');
    banner.hidden = !html;
  }

  function loadLibrary() {
    if (window.supabase && window.supabase.createClient) return Promise.resolve();
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = SUPABASE_SRC;
      s.integrity = SUPABASE_SRI;
      s.crossOrigin = 'anonymous';
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error('Couldn’t load the sign-in service.')); };
      document.head.appendChild(s);
    });
  }

  /* Turn a Supabase or Edge Function error into a sentence for the user. */
  function friendlyError(error, fallback) {
    if (!error) return fallback;
    if (error.code === '42501') return 'your Pro subscription isn’t active, so RAMS can’t be saved to your account.';
    if (error.message && /fetch|network/i.test(error.message)) return 'you seem to be offline. Check your connection and try again.';
    return fallback;
  }

  function functionError(error) {
    // Edge Function errors carry the response; our functions return { error: "..." }.
    if (error && error.context && typeof error.context.json === 'function') {
      return error.context.json().then(function (body) {
        return (body && body.error) || 'Something went wrong. Please try again.';
      }, function () { return 'Something went wrong. Please try again.'; });
    }
    return Promise.resolve('Something went wrong. Please try again.');
  }

  /* ---------- Account store (RAMS saved to the user's account) ---------- */

  function toRecord(row) {
    return {
      id: row.id,
      title: row.title,
      values: row.values,
      html: row.html,
      createdAt: Date.parse(row.created_at),
      updatedAt: Date.parse(row.updated_at)
    };
  }

  function rejectWith(error, fallback) {
    // The server refused because Pro has lapsed: re-check the plan so the screen catches up.
    if (error && error.code === '42501') {
      setTimeout(function () {
        refreshPlan().then(update).then(function () {
          showBanner('Your Pro plan isn\u2019t active, so that RAMS wasn\u2019t saved to your account. ' +
            'Tap Save RAMS to keep it in this browser instead, or renew Pro from the account menu.', 'error');
        });
      }, 0);
    }
    return Promise.reject(new Error(friendlyError(error, fallback)));
  }

  function makeAccountStore(readOnly) {
    return {
      kind: 'cloud',
      where: readOnly ? 'In your account (read-only)' : 'In your account',
      savedText: 'Saved to your account',
      note: readOnly
        ? 'Your Pro plan has ended, so you can open and delete these RAMS but not change them. Renew Pro to edit them, or use Print / Save as PDF to keep a copy.'
        : 'Saved RAMS are stored in your account, so you can open them on any device where you sign in.',
      list: function () {
        return client.from('rams_documents')
          .select('id, title, values, created_at, updated_at')
          .order('updated_at', { ascending: false })
          .then(function (res) {
            if (res.error) return rejectWith(res.error, 'please try again.');
            return res.data.map(toRecord);
          });
      },
      get: function (id) {
        return client.from('rams_documents').select('*').eq('id', id).maybeSingle()
          .then(function (res) {
            if (res.error) return rejectWith(res.error, 'please try again.');
            return res.data ? toRecord(res.data) : null;
          });
      },
      put: function (record) {
        if (readOnly) return Promise.reject(new Error('renew Pro to save changes to your account.'));
        return client.from('rams_documents').upsert({
          user_id: user.id,
          id: record.id,
          title: record.title,
          values: record.values,
          html: record.html,
          created_at: new Date(record.createdAt).toISOString(),
          updated_at: new Date(record.updatedAt).toISOString()
        }, { onConflict: 'user_id,id' }).then(function (res) {
          if (res.error) return rejectWith(res.error, 'please try again.');
          return record;
        });
      },
      remove: function (id) {
        return client.from('rams_documents').delete().eq('id', id).then(function (res) {
          if (res.error) return rejectWith(res.error, 'please try again.');
        });
      }
    };
  }

  var accountStore = null;
  var readOnlyStore = null;

  /* ---------- Plan ---------- */

  function refreshPlan() {
    if (!user) {
      plan = { pro: false, sub: null, accountCount: 0, loaded: true };
      return Promise.resolve(plan);
    }
    return Promise.all([
      client.rpc('is_pro'),
      client.from('subscriptions')
        .select('status, current_period_end, cancel_at_period_end')
        .order('updated_at', { ascending: false })
        .limit(1),
      client.from('rams_documents').select('id', { count: 'exact', head: true })
    ]).then(function (results) {
      plan = {
        pro: results[0].data === true,
        sub: (results[1].data && results[1].data[0]) || null,
        accountCount: results[2].count || 0,
        loaded: true
      };
      return plan;
    }, function () {
      plan = { pro: false, sub: null, accountCount: 0, loaded: true };
      return plan;
    });
  }

  function applyStore() {
    if (user && plan.pro) {
      viewingAccount = false;
      return App.setStore(accountStore);
    }
    if (user && viewingAccount && plan.accountCount > 0) return App.setStore(readOnlyStore);
    viewingAccount = false;
    return App.setStore(App.localStore);
  }

  function update() {
    return applyStore().then(function () {
      renderSlot();
      renderPanel();
    });
  }

  /* ---------- Header: sign in / account menu ---------- */

  function renderSlot() {
    if (!user) {
      slot.innerHTML = '<button type="button" class="btn btn-light btn-small" data-acct="signin">Sign in</button>';
      return;
    }
    var badge = plan.pro ? '<span class="plan-badge is-pro">Pro</span>' : '<span class="plan-badge">Free</span>';
    var planLine = plan.pro
      ? (plan.sub && plan.sub.cancel_at_period_end && plan.sub.current_period_end
          ? 'Pro until ' + esc(longDate(plan.sub.current_period_end))
          : 'Pro plan')
      : 'Free plan';
    slot.innerHTML =
      '<button type="button" class="account-toggle" data-acct="menu" aria-expanded="' + menuOpen + '" aria-controls="account-menu">' +
        '<span class="account-email">' + esc(user.email || 'Your account') + '</span>' + badge +
      '</button>' +
      '<div id="account-menu" class="account-menu"' + (menuOpen ? '' : ' hidden') + '>' +
        '<p class="account-menu-plan">' + planLine + '</p>' +
        (plan.pro || plan.sub
          ? '<button type="button" class="account-menu-item" data-acct="portal">Manage billing</button>'
          : '') +
        (plan.pro ? '' : '<button type="button" class="account-menu-item" data-acct="upgrade">Upgrade to Pro' + priceText(' – ') + '</button>') +
        '<button type="button" class="account-menu-item" data-acct="signout">Sign out</button>' +
      '</div>';
  }

  /* ---------- Panel under the saved list ---------- */

  function renderPanel() {
    var localCount = 0;
    try { localCount = JSON.parse(localStorage.getItem('rams-generator:saved') || '[]').length; } catch (e) { /* ignore */ }

    if (!user) {
      panel.innerHTML =
        '<div class="upsell">' +
          '<p><strong>Want your RAMS on every device?</strong> Sign in and upgrade to Pro' + priceText(' (') + (cfg.proPriceLabel ? ')' : '') +
          ' to save RAMS to your account and open them on your phone, tablet or laptop.</p>' +
          '<button type="button" class="btn btn-secondary btn-small" data-acct="signin">Sign in</button>' +
        '</div>';
      return;
    }

    if (plan.pro) {
      var html = '';
      if (plan.sub && plan.sub.cancel_at_period_end && plan.sub.current_period_end) {
        html += '<p class="panel-note">Your Pro plan ends on ' + esc(longDate(plan.sub.current_period_end)) +
          '. <button type="button" class="link-btn" data-acct="portal">Manage billing</button> to keep it.</p>';
      }
      if (localCount > 0) {
        html += '<div class="upsell">' +
          '<p>You have <strong>' + localCount + '</strong> RAMS saved in this browser from before you upgraded.</p>' +
          '<button type="button" class="btn btn-secondary btn-small" data-acct="import">Copy them to your account</button>' +
          '</div>';
      }
      panel.innerHTML = html;
      return;
    }

    // Signed in, not Pro.
    var html2 = '';
    if (plan.accountCount > 0) {
      html2 += viewingAccount
        ? '<p class="panel-note">Showing the RAMS in your account. <button type="button" class="link-btn" data-acct="view-local">Show RAMS saved in this browser</button></p>'
        : '<p class="panel-note">You have ' + plan.accountCount + ' RAMS in your account from when you had Pro. <button type="button" class="link-btn" data-acct="view-account">View them</button></p>';
    }
    html2 +=
      '<div class="upsell upsell-pro">' +
        '<h3>Upgrade to Pro' + priceText(': ') + '</h3>' +
        '<ul>' +
          '<li>Save RAMS to your account, not just this browser</li>' +
          '<li>Open and edit them on any device where you sign in</li>' +
          '<li>Cancel any time from Manage billing</li>' +
        '</ul>' +
        '<button type="button" class="btn btn-primary btn-small" data-acct="upgrade">Upgrade to Pro</button>' +
      '</div>';
    panel.innerHTML = html2;
  }

  /* ---------- Sign-in dialog ---------- */

  var dialog = document.createElement('dialog');
  dialog.className = 'signin-dialog';
  dialog.innerHTML =
    '<form method="dialog" class="signin-form" novalidate>' +
      '<h2>Sign in</h2>' +
      '<p class="hint">We’ll email you a sign-in link. There’s no password to remember. New here? The same link creates your account.</p>' +
      '<label class="field"><span>Email address</span>' +
        '<input type="email" id="signin-email" name="email" autocomplete="email" required placeholder="you@company.co.uk"></label>' +
      '<p id="signin-status" class="signin-status" role="status" aria-live="polite"></p>' +
      '<div class="actions">' +
        '<button type="submit" class="btn btn-primary" id="signin-submit" value="send">Email me a sign-in link</button>' +
        '<button type="button" class="btn btn-ghost" id="signin-cancel">Close</button>' +
      '</div>' +
    '</form>';
  document.body.appendChild(dialog);

  var signinForm = dialog.querySelector('form');
  var signinEmail = dialog.querySelector('#signin-email');
  var signinStatus = dialog.querySelector('#signin-status');
  var signinSubmit = dialog.querySelector('#signin-submit');

  function openSignin() {
    signinStatus.textContent = '';
    signinStatus.className = 'signin-status';
    signinSubmit.disabled = false;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    signinEmail.focus();
  }

  function closeSignin() {
    if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
  }

  dialog.querySelector('#signin-cancel').addEventListener('click', closeSignin);

  signinForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = signinEmail.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      signinStatus.textContent = 'Enter a full email address, like you@company.co.uk.';
      signinStatus.className = 'signin-status is-error';
      return;
    }
    signinSubmit.disabled = true;
    signinStatus.textContent = 'Sending…';
    signinStatus.className = 'signin-status';
    client.auth.signInWithOtp({
      email: email,
      options: { emailRedirectTo: location.origin + location.pathname }
    }).then(function (res) {
      if (res.error) {
        signinSubmit.disabled = false;
        signinStatus.textContent = res.error.status === 429
          ? 'Too many sign-in emails were requested. Wait a minute, then try again.'
          : 'Couldn’t send the email. Check the address and try again.';
        signinStatus.className = 'signin-status is-error';
        return;
      }
      signinStatus.textContent = 'Check your inbox at ' + email + ' and tap the link to sign in. You can close this window.';
      signinStatus.className = 'signin-status is-ok';
    });
  });

  /* ---------- Billing ---------- */

  function goToStripe(fnName, button) {
    if (button) { button.disabled = true; button.dataset.label = button.textContent; button.textContent = 'Opening…'; }
    return client.functions.invoke(fnName, { body: {} }).then(function (res) {
      if (res.error || !res.data || !res.data.url) {
        return functionError(res.error).then(function (msg) { throw new Error(msg); });
      }
      location.assign(res.data.url);
    }).catch(function (err) {
      if (button) { button.disabled = false; button.textContent = button.dataset.label; }
      showBanner(esc(err.message || 'Something went wrong. Please try again.'), 'error');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Copy browser RAMS to the account ---------- */

  function importLocal(button) {
    button.disabled = true;
    button.textContent = 'Copying…';
    var local = [];
    try { local = JSON.parse(localStorage.getItem('rams-generator:saved') || '[]'); } catch (e) { /* ignore */ }
    var done = 0;
    var chain = Promise.resolve();
    local.forEach(function (rec) {
      chain = chain.then(function () { return accountStore.put(rec); }).then(function () { done++; });
    });
    chain.then(function () {
      showBanner('Copied ' + done + ' RAMS to your account. The copies in this browser haven’t been changed; you can delete them once you’ve checked.', 'ok');
    }, function (err) {
      showBanner('Copied ' + done + ' of ' + local.length + ' RAMS, then stopped: ' + esc(err.message), 'error');
    }).then(function () {
      App.refreshSaved();
      renderPanel();
    });
  }

  /* ---------- Clicks ---------- */

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-acct]');
    if (!el) {
      if (menuOpen && !e.target.closest('#account-slot')) { menuOpen = false; renderSlot(); }
      return;
    }
    var action = el.dataset.acct;
    if (action === 'signin') return openSignin();
    if (action === 'menu') { menuOpen = !menuOpen; return renderSlot(); }
    if (action === 'upgrade') { menuOpen = false; return goToStripe('create-checkout-session', el); }
    if (action === 'portal') { menuOpen = false; return goToStripe('create-portal-session', el); }
    if (action === 'import') return importLocal(el);
    if (action === 'view-account') { viewingAccount = true; return update(); }
    if (action === 'view-local') { viewingAccount = false; return update(); }
    if (action === 'signout') {
      menuOpen = false;
      client.auth.signOut();
    }
  });

  /* Pick up plan changes made elsewhere (e.g. cancelled in the billing portal on another device). */
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && client && user) refreshPlan().then(update);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) { menuOpen = false; renderSlot(); }
  });

  /* ---------- Returning from Stripe Checkout ---------- */

  function handleCheckoutReturn() {
    var params = new URLSearchParams(location.search);
    var result = params.get('checkout');
    if (!result) return;
    params.delete('checkout');
    var clean = location.pathname + (params.toString() ? '?' + params.toString() : '') + location.hash;
    history.replaceState(null, '', clean);

    if (result === 'cancelled') {
      showBanner('Checkout cancelled. You haven’t been charged.', '');
      return;
    }
    if (result !== 'success') return;

    // Stripe tells our server about the payment by webhook, which can take a few seconds.
    showBanner('Thanks for upgrading. Switching on Pro…', 'ok');
    var tries = 0;
    (function poll() {
      tries++;
      refreshPlan().then(function () {
        if (plan.pro) {
          update();
          showBanner('You’re on Pro. RAMS you save now go to your account.', 'ok');
        } else if (tries < 15) {
          setTimeout(poll, 2000);
        } else {
          showBanner('Your payment went through, but Pro is taking longer than usual to switch on. Refresh this page in a minute.', 'error');
        }
      });
    })();
  }

  /* ---------- Start ---------- */

  slot.innerHTML = '<span class="account-loading">Loading account…</span>';

  loadLibrary().then(function () {
    client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
    });
    accountStore = makeAccountStore(false);
    readOnlyStore = makeAccountStore(true);

    var first = true;
    client.auth.onAuthStateChange(function (event, session) {
      var nextUser = session ? session.user : null;
      var changed = (nextUser && nextUser.id) !== (user && user.id);
      user = nextUser;
      if (!changed && !first && event !== 'USER_UPDATED') return;
      // Defer: Supabase recommends not calling its methods inside this callback.
      setTimeout(function () {
        refreshPlan().then(update).then(function () {
          if (first) { first = false; handleCheckoutReturn(); }
          if (event === 'SIGNED_IN') closeSignin();
        });
      }, 0);
    });
  }).catch(function (err) {
    slot.innerHTML = '';
    panel.innerHTML = '<p class="panel-note">' + esc(err.message) + ' Saving in this browser still works.</p>';
  });
})();
