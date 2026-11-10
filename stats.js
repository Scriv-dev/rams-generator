/*
 * Privacy-friendly visitor counter (GoatCounter).
 *
 * - No cookies, no local storage, no fingerprinting: each page view sends one
 *   small request to your GoatCounter site with the page path, page title,
 *   referring site and screen width.
 * - No third-party script runs on the page; this uses GoatCounter's documented
 *   count endpoint directly.
 * - Respects the browser's Do Not Track setting, and doesn't count local testing.
 *
 * Also counts a few anonymous actions as GoatCounter "events" (e.g. "rams-generated/standard")
 * so you can see how the tool is used. Nothing typed into the form is ever sent.
 */
(function () {
  'use strict';

  var code = ((window.RAMS_CONFIG || {}).goatcounterCode || '').trim().toLowerCase();
  var noop = { event: function () {} };

  var dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true;
  var local = /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(location.hostname) || location.protocol === 'file:';

  if (!/^[a-z0-9-]{1,60}$/.test(code) || dnt || local || navigator.webdriver) {
    window.RamsStats = noop;
    return;
  }

  var endpoint = 'https://' + code + '.goatcounter.com/count';

  /* Only the referring site's address, without query strings, and only if it's another site. */
  function referrer() {
    if (!document.referrer) return '';
    try {
      var r = new URL(document.referrer);
      if (r.host === location.host) return '';
      return r.origin + r.pathname;
    } catch (e) {
      return '';
    }
  }

  function send(params) {
    var q = Object.keys(params).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    }).join('&');
    var img = new Image();
    img.referrerPolicy = 'origin';
    img.src = endpoint + '?' + q + '&rnd=' + Math.random().toString(36).slice(2);
  }

  function pageview() {
    send({
      p: location.pathname, // never the query string or #hash
      t: document.title,
      r: referrer(),
      s: String(window.screen && window.screen.width || '')
    });
  }

  window.RamsStats = {
    /* Count an anonymous action, e.g. RamsStats.event('rams-printed'). */
    event: function (name) {
      if (!/^[a-z0-9/_-]{1,80}$/.test(name)) return;
      send({ p: name, t: name, e: 'true' });
    }
  };

  // Don't count pages loaded in the background (prerender) until they're actually shown.
  if (document.visibilityState === 'prerender') {
    document.addEventListener('visibilitychange', function once() {
      if (document.visibilityState !== 'visible') return;
      document.removeEventListener('visibilitychange', once);
      pageview();
    });
  } else {
    pageview();
  }
})();
