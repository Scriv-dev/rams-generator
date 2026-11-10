/*
 * Feedback form (Formspree).
 *
 * Any element with a data-feedback attribute opens a short form. Messages are
 * sent to your Formspree form and arrive in your email inbox; your address is
 * never shown on the site. Links stay hidden until formspreeId is set in config.js.
 *
 * Sent with each message: the text, an optional topic, an optional reply email,
 * the page, and (in the generator) the event type, activities and detail level
 * chosen. Event names, venues, clients and staff names are never sent.
 */
(function () {
  'use strict';

  var id = ((window.RAMS_CONFIG || {}).formspreeId || '').trim();
  if (!/^[A-Za-z0-9]{4,40}$/.test(id)) return; // not configured: links stay hidden

  var endpoint = 'https://formspree.io/f/' + id;
  var TOPICS = ['Missing activity', 'Missing hazard or control', 'Something’s wrong', 'Feature idea', 'Other'];

  // Reveal the feedback links and prompts.
  document.querySelectorAll('[data-feedback], [data-feedback-prompt]').forEach(function (el) { el.hidden = false; });

  var dialog = document.createElement('dialog');
  dialog.className = 'modal feedback-dialog';
  dialog.setAttribute('aria-labelledby', 'feedback-title');
  dialog.innerHTML =
    '<form class="feedback-form" novalidate>' +
      '<div class="feedback-body">' +
        '<h2 id="feedback-title">Send feedback</h2>' +
        '<p class="hint">What’s missing, or what would make this more useful? It takes 30 seconds.</p>' +
        '<fieldset class="topic-chips">' +
          '<legend>Topic <span class="optional">(optional)</span></legend>' +
          TOPICS.map(function (t, i) {
            return '<label class="chip"><input type="radio" name="topic" value="' + t + '" id="fb-topic-' + i + '"><span>' + t + '</span></label>';
          }).join('') +
        '</fieldset>' +
        '<label class="field"><span>Your feedback</span>' +
          '<textarea id="fb-message" name="message" rows="4" maxlength="2000" required ' +
          'placeholder="For example: a hazard for pyrotechnics, or an export to Word"></textarea></label>' +
        '<label class="field"><span>Email <span class="optional">(optional, if you’d like a reply)</span></span>' +
          '<input type="email" id="fb-email" name="email" autocomplete="email" placeholder="you@company.co.uk"></label>' +
        // Honeypot: hidden from people, filled in by spam bots. Formspree discards messages that fill it.
        '<label class="hp" aria-hidden="true">Leave this empty <input type="text" name="_gotcha" tabindex="-1" autocomplete="off"></label>' +
        '<p class="hint small">We also send which page you’re on and, in the generator, the event type, activities and detail level you chose. Never your event details.</p>' +
        '<p id="fb-status" class="form-status" role="status" aria-live="polite"></p>' +
      '</div>' +
      '<div class="actions">' +
        '<button type="submit" class="btn btn-primary" id="fb-send">Send feedback</button>' +
        '<button type="button" class="btn btn-ghost" id="fb-close">Close</button>' +
      '</div>' +
    '</form>';
  document.body.appendChild(dialog);

  var fbForm = dialog.querySelector('form');
  var message = dialog.querySelector('#fb-message');
  var email = dialog.querySelector('#fb-email');
  var status = dialog.querySelector('#fb-status');
  var sendBtn = dialog.querySelector('#fb-send');
  var lastTrigger = null;

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = 'form-status' + (kind ? ' is-' + kind : '');
  }

  function open(trigger) {
    lastTrigger = trigger || null;
    fbForm.hidden = false;
    setStatus('', '');
    sendBtn.disabled = false;
    sendBtn.hidden = false;
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
    message.focus();
  }

  function close() {
    if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
  }

  dialog.querySelector('#fb-close').addEventListener('click', close);
  dialog.addEventListener('click', function (e) { if (e.target === dialog) close(); }); // tap outside

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-feedback]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger);
  });

  /* Anonymous context from the generator form (no free-text fields). */
  function context() {
    var form = document.getElementById('rams-form');
    if (!form) return '';
    var type = form.elements.eventType ? form.elements.eventType.value : '';
    var acts = Array.prototype.map.call(form.querySelectorAll('input[name="activities"]:checked'), function (b) { return b.value; });
    var detail = form.querySelector('input[name="detail"]:checked');
    return [
      'Event type: ' + (type || 'not chosen'),
      'Activities: ' + (acts.length ? acts.join(', ') : 'none ticked'),
      'Detail level: ' + (detail ? detail.value : 'standard')
    ].join('; ');
  }

  fbForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var text = message.value.trim();
    if (text.length < 3) {
      setStatus('Write a few words about what’s missing or could be better.', 'error');
      message.focus();
      return;
    }
    var mail = email.value.trim();
    if (mail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
      setStatus('That email address doesn’t look right. Fix it, or leave it blank.', 'error');
      email.focus();
      return;
    }
    var topic = fbForm.querySelector('input[name="topic"]:checked');
    var payload = {
      message: text,
      topic: topic ? topic.value : '',
      page: location.pathname,
      context: context(),
      _subject: 'RAMS Generator feedback' + (topic ? ': ' + topic.value : ''),
      _gotcha: fbForm.elements._gotcha.value
    };
    if (mail) payload.email = mail; // Formspree uses this as the reply-to address

    sendBtn.disabled = true;
    setStatus('Sending…', '');

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'omit'
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) {
        if (!res.ok) {
          var msg = body && body.errors && body.errors[0] && body.errors[0].message;
          throw new Error(msg || 'The feedback service didn’t accept the message.');
        }
      });
    }).then(function () {
      fbForm.reset();
      sendBtn.hidden = true;
      setStatus('Thanks, your feedback has been sent.', 'ok');
      if (window.RamsStats) window.RamsStats.event('feedback-sent');
    }).catch(function (err) {
      sendBtn.disabled = false;
      var offline = err instanceof TypeError; // fetch network failure
      setStatus(offline
        ? 'Couldn’t send: you seem to be offline. Check your connection and try again.'
        : 'Couldn’t send: ' + err.message + ' Please try again.', 'error');
    });
  });
})();
