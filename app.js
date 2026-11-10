(function () {
  'use strict';

  var DATA = window.RAMS_DATA;
  var STORAGE_KEY = 'rams-generator:form';
  var RATINGS = ['low', 'medium', 'high'];

  var form = document.getElementById('rams-form');
  var activityList = document.getElementById('activity-list');
  var output = document.getElementById('output');
  var doc = document.getElementById('document');
  var errorBox = document.getElementById('form-error');

  /* ---------- Helpers ---------- */

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function fill(text, ctx) {
    return text.replace(/\{public\}/g, ctx.public);
  }

  function formatDate(iso) {
    if (!iso) return '';
    var parts = iso.split('-');
    var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    if (isNaN(d)) return iso;
    return d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  function today() {
    return new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function capitalise(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  /* ---------- Activity checkboxes ---------- */

  Object.keys(DATA.activities).forEach(function (key) {
    var a = DATA.activities[key];
    var label = document.createElement('label');
    label.className = 'activity';
    label.innerHTML =
      '<input type="checkbox" name="activities" value="' + esc(key) + '">' +
      '<span class="activity-text"><strong>' + esc(a.label) + '</strong>' +
      '<small>' + esc(a.short) + '</small></span>';
    activityList.appendChild(label);
  });

  /* ---------- Persistence (per-browser convenience only) ---------- */

  function readForm() {
    var fd = new FormData(form);
    return {
      eventName: (fd.get('eventName') || '').trim(),
      eventDate: fd.get('eventDate') || '',
      venue: (fd.get('venue') || '').trim(),
      client: (fd.get('client') || '').trim(),
      eventType: fd.get('eventType') || '',
      preparedBy: (fd.get('preparedBy') || '').trim(),
      activities: fd.getAll('activities'),
      staff: (fd.get('staff') || '').split('\n').map(function (s) { return s.trim(); }).filter(Boolean),
      staffRaw: fd.get('staff') || '',
      blankRows: Math.max(0, Math.min(40, parseInt(fd.get('blankRows'), 10) || 0))
    };
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(readForm())); } catch (e) { /* ignore */ }
  }

  function fillForm(values) {
    form.reset();
    ['eventName', 'eventDate', 'venue', 'client', 'eventType', 'preparedBy'].forEach(function (n) {
      if (values[n] != null) form.elements[n].value = values[n];
    });
    form.elements.staff.value = values.staffRaw || '';
    if (values.blankRows != null) form.elements.blankRows.value = values.blankRows;
    (values.activities || []).forEach(function (key) {
      var box = form.querySelector('input[name="activities"][value="' + key + '"]');
      if (box) box.checked = true;
    });
  }

  function restore() {
    var saved;
    try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { saved = null; }
    if (saved) fillForm(saved);
  }

  restore();
  form.addEventListener('input', save);
  form.addEventListener('change', save);

  /* ---------- Validation ---------- */

  function validate(v) {
    var missing = [];
    if (!v.eventName) missing.push('event name');
    if (!v.eventDate) missing.push('event date');
    if (!v.venue) missing.push('venue');
    if (!v.client) missing.push('client');
    if (!v.eventType) missing.push('event type');

    form.querySelectorAll('[required]').forEach(function (el) {
      el.classList.toggle('invalid', !el.value.trim());
    });

    if (missing.length) return 'Please fill in: ' + missing.join(', ') + '.';
    if (!v.activities.length) return 'Please tick at least one activity.';
    return '';
  }

  /* ---------- Rendering ---------- */

  function ratingBadge(rating) {
    return '<button type="button" class="rating rating-' + rating + '" data-rating="' + rating + '" ' +
      'title="Tap to change rating" contenteditable="false">' + capitalise(rating) + '</button>';
  }

  function riskTable(title, number, hazards, ctx) {
    var rows = hazards.map(function (h) {
      return '<tr>' +
        '<td data-label="Hazard">' + esc(fill(h.hazard, ctx)) + '</td>' +
        '<td data-label="Who might be harmed">' + esc(capitalise(fill(h.who, ctx))) + '</td>' +
        '<td data-label="Existing controls">' + esc(fill(h.controls, ctx)) + '</td>' +
        '<td data-label="Risk rating" class="col-rating">' + ratingBadge(h.rating) + '</td>' +
        '<td data-label="Further actions">' + esc(fill(h.actions, ctx)) + '</td>' +
        '</tr>';
    }).join('');

    return '<section class="ra-block">' +
      '<h3>' + number + ' ' + esc(title) + '</h3>' +
      '<table class="ra-table">' +
      '<thead><tr><th>Hazard</th><th>Who might be harmed</th><th>Existing controls</th>' +
      '<th class="col-rating">Risk rating</th><th>Further actions</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></section>';
  }

  function stepList(steps) {
    return '<ol class="steps">' + steps.map(function (s) {
      return '<li>' + esc(s) + '</li>';
    }).join('') + '</ol>';
  }

  function methodPhase(title, number, before, perActivity, after) {
    var html = '<section class="ms-phase"><h3>' + number + ' ' + esc(title) + '</h3>';
    html += '<h4>General</h4>' + stepList(before);
    perActivity.forEach(function (p) {
      if (p.steps.length) html += '<h4>' + esc(p.label) + '</h4>' + stepList(p.steps);
    });
    html += '<h4>Completion</h4>' + stepList(after);
    return html + '</section>';
  }

  /* Wind action plan: one row per wind-sensitive structure in use (outdoor events only). */
  function windPlan(v, isOutdoor) {
    if (!isOutdoor) return '';
    var rows = (DATA.windPlan || []).filter(function (r) { return v.activities.indexOf(r.activity) !== -1; });
    if (!rows.length) return '';
    var blank = '<span class="fill-in">____ m/s</span>';
    return '<h4>Wind action plan</h4>' +
      '<p>Fill in each structure\'s figures from its supplier\'s design calculations or operations manual. Use gust speed. ' +
      'Read the anemometer every 30 minutes, and every 15 minutes once any structure reaches amber.</p>' +
      '<table class="ra-table wind-table"><thead><tr><th>Structure</th><th>Max design gust</th>' +
      '<th>Amber trigger and action</th><th>Red trigger and action</th></tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr><td data-label="Structure">' + esc(r.structure) + '</td>' +
          '<td data-label="Max design gust">' + blank + '</td>' +
          '<td data-label="Amber trigger and action">' + blank + '<br>' + esc(r.amber) + '</td>' +
          '<td data-label="Red trigger and action">' + blank + '<br>' + esc(r.red) + '</td></tr>';
      }).join('') +
      '</tbody></table>' +
      '<p class="note">1 m/s ≈ 2.24 mph. Anemometer read and logged by: ____________________</p>';
  }

  function render(v) {
    var type = DATA.eventTypes[v.eventType];
    var ctx = { public: type.public };
    var selected = v.activities.map(function (k) { return DATA.activities[k]; }).filter(Boolean);

    // Outdoor weather row: skip for corporate events unless a marquee/tent is in use.
    var isOutdoor = v.eventType !== 'corporate' || v.activities.indexOf('marquee') !== -1;
    function applies(h) { return !h.outdoor || isOutdoor; }
    var generalHazards = DATA.general.hazards.filter(applies);

    var M = DATA.method;
    var html = '';

    /* Title block */
    html += '<header class="doc-header">' +
      '<p class="doc-kicker">Risk Assessment &amp; Method Statement</p>' +
      '<h1>' + esc(v.eventName) + '</h1>' +
      '<table class="meta-table"><tbody>' +
      '<tr><th>Event</th><td>' + esc(v.eventName) + '</td><th>Event type</th><td>' + esc(type.label) + '</td></tr>' +
      '<tr><th>Date</th><td>' + esc(formatDate(v.eventDate)) + '</td><th>Client</th><td>' + esc(v.client) + '</td></tr>' +
      '<tr><th>Venue</th><td>' + esc(v.venue) + '</td><th>Prepared by</th><td>' + (esc(v.preparedBy) || '&nbsp;') + '</td></tr>' +
      '<tr><th>Date of issue</th><td>' + esc(today()) + '</td><th>Revision</th><td>1</td></tr>' +
      '</tbody></table></header>';

    /* 1. Scope */
    html += '<section class="doc-section"><h2>1. Scope</h2>' +
      '<p>This document covers the setup, operation and pack-down of temporary event infrastructure for <strong>' +
      esc(v.eventName) + '</strong> at <strong>' + esc(v.venue) + '</strong> on behalf of <strong>' + esc(v.client) +
      '</strong>. The event is ' + esc(type.scope) + '.</p>' +
      '<p>Activities covered:</p><ul class="scope-list">' +
      selected.map(function (a) { return '<li>' + esc(a.label) + ' – ' + esc(a.short.toLowerCase()) + '</li>'; }).join('') +
      '</ul>' +
      '<p>It was prepared with reference to the Health and Safety at Work etc. Act 1974, the Management of Health and Safety at Work Regulations 1999, the Construction (Design and Management) Regulations 2015 and ' +
      esc(type.guidance) + '.</p></section>';

    /* 2. Risk rating key */
    html += '<section class="doc-section"><h2>2. Risk rating key</h2>' +
      '<p>Ratings show the remaining (residual) risk with the existing controls in place.</p>' +
      '<table class="key-table"><tbody>' +
      '<tr><td class="col-rating"><span class="rating rating-low">Low</span></td><td>Acceptable. Maintain existing controls and monitor.</td></tr>' +
      '<tr><td class="col-rating"><span class="rating rating-medium">Medium</span></td><td>Tolerable. Make sure controls are in place and complete the further actions before work starts.</td></tr>' +
      '<tr><td class="col-rating"><span class="rating rating-high">High</span></td><td>Unacceptable. Do not start or continue work until further controls reduce the risk.</td></tr>' +
      '</tbody></table></section>';

    /* 3. Risk assessments */
    html += '<section class="doc-section"><h2>3. Risk assessments</h2>';
    html += riskTable(DATA.general.label, '3.1', generalHazards, ctx);
    selected.forEach(function (a, i) {
      html += riskTable(a.label, '3.' + (i + 2), a.hazards.filter(applies), ctx);
    });
    html += '</section>';

    /* 4. Method statement */
    function phase(name) {
      return selected.map(function (a) { return { label: a.label, steps: a.method[name] || [] }; });
    }
    html += '<section class="doc-section"><h2>4. Method statement</h2>';
    html += methodPhase('Setup', '4.1', M.setupBefore, phase('setup'), M.setupAfter);
    html += methodPhase('During the event', '4.2', M.duringBefore, phase('during'), M.duringAfter);
    html += methodPhase('Pack-down', '4.3', M.packdownBefore, phase('packdown'), M.packdownAfter);
    html += '</section>';

    /* 5. PPE, weather and emergency arrangements */
    var ppe = ['Safety boots (toe protection)', 'High-visibility vest or jacket'];
    if (v.activities.some(function (k) { return ['rigging', 'height', 'marquee', 'staging'].indexOf(k) !== -1; })) ppe.push('Hard hat in overhead work areas and exclusion zones');
    if (v.activities.some(function (k) { return ['fencing', 'manual', 'staging', 'marquee'].indexOf(k) !== -1; })) ppe.push('Work gloves suited to the task');
    if (v.activities.indexOf('rigging') !== -1) ppe.push('Hearing protection during sound checks and performances');
    if (v.activities.indexOf('height') !== -1) ppe.push('Harness and restraint lanyard in MEWP baskets');

    html += '<section class="doc-section"><h2>5. PPE, weather and emergency arrangements</h2>' +
      '<h4>Required PPE</h4><ul>' + ppe.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
      windPlan(v, isOutdoor) +
      '<h4>Emergency arrangements</h4>' +
      '<table class="meta-table emergency"><tbody>' +
      '<tr><th>Emergency services</th><td>999 / 112</td></tr>' +
      '<tr><th>Crew chief / site contact</th><td>&nbsp;</td></tr>' +
      '<tr><th>Venue contact</th><td>&nbsp;</td></tr>' +
      '<tr><th>First aid point</th><td>&nbsp;</td></tr>' +
      '<tr><th>Nearest A&amp;E</th><td>&nbsp;</td></tr>' +
      '<tr><th>Fire assembly point</th><td>&nbsp;</td></tr>' +
      '</tbody></table>' +
      '<p class="note">Click a blank cell to fill it in, or write it in by hand after printing.</p></section>';

    /* 6. Sign-off */
    var signRows = v.staff.map(function (name) {
      return '<tr><td>' + esc(name) + '</td><td></td><td></td><td></td></tr>';
    });
    for (var i = 0; i < v.blankRows; i++) signRows.push('<tr><td></td><td></td><td></td><td></td></tr>');
    if (!signRows.length) signRows.push('<tr><td></td><td></td><td></td><td></td></tr>');

    html += '<section class="doc-section signoff"><h2>6. Sign-off</h2>' +
      '<p>By signing below, I confirm that I have read and understood this RAMS document, that it has been explained to me, and that I will follow the control measures and method described.</p>' +
      '<table class="sign-table"><thead><tr><th>Name</th><th>Role / company</th><th>Signature</th><th>Date</th></tr></thead>' +
      '<tbody>' + signRows.join('') + '</tbody></table>' +
      '<h4>Approval</h4>' +
      '<table class="sign-table approval"><thead><tr><th></th><th>Name</th><th>Signature</th><th>Date</th></tr></thead><tbody>' +
      '<tr><th>Prepared by</th><td>' + esc(v.preparedBy) + '</td><td></td><td></td></tr>' +
      '<tr><th>Approved by (client / event manager)</th><td></td><td></td><td></td></tr>' +
      '</tbody></table></section>';

    html += '<footer class="doc-footer">' + esc(v.eventName) + ' · RAMS · ' + esc(v.venue) + ' · ' + esc(formatDate(v.eventDate)) +
      '<br>This document must be reviewed if site conditions, the scope of work or the event plan change.</footer>';

    doc.innerHTML = html;
    makeEditable();
  }

  /* Let the user tweak text in place before printing. */
  function makeEditable() {
    doc.querySelectorAll('h1, p, li, td, .meta-table td').forEach(function (el) {
      if (el.querySelector('.rating')) return;
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'true');
    });
  }

  /* Tap a rating badge to cycle low → medium → high. */
  doc.addEventListener('click', function (e) {
    var badge = e.target.closest('button.rating');
    if (!badge) return;
    var next = RATINGS[(RATINGS.indexOf(badge.dataset.rating) + 1) % RATINGS.length];
    badge.dataset.rating = next;
    badge.className = 'rating rating-' + next;
    badge.textContent = capitalise(next);
    markDirty();
  });

  /* Paste as plain text so formatting from other apps doesn't end up in the document. */
  doc.addEventListener('paste', function (e) {
    if (!e.target.closest('[contenteditable="true"]')) return;
    e.preventDefault();
    var text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  });

  doc.addEventListener('input', markDirty);

  /* ---------- Saved RAMS ----------
   * Saving goes through a "store" with async list/get/put/remove.
   * The browser store (localStorage) is the default; account.js swaps in the
   * account store when a Pro user signs in, via window.RamsApp.setStore().
   * Records: { id, title, values, html, createdAt, updatedAt } (times in ms).
   */

  var SAVED_KEY = 'rams-generator:saved';
  var savedSection = document.getElementById('saved-section');
  var savedList = document.getElementById('saved-list');
  var savedEmpty = document.getElementById('saved-empty');
  var savedCount = document.getElementById('saved-count');
  var savedWhere = document.getElementById('saved-where');
  var savedNote = document.getElementById('saved-note');
  var storageError = document.getElementById('storage-error');
  var saveBtn = document.getElementById('save-btn');
  var saveStatus = document.getElementById('save-status');
  var editingBanner = document.getElementById('editing-banner');
  var editingName = document.getElementById('editing-name');

  var currentId = null;        // id of the saved RAMS on screen, or null if not saved
  var currentTitle = '';
  var currentCreatedAt = null;
  var currentSavedAt = null;
  var currentValues = null;
  var dirty = false;
  var busy = false;

  function readLocal() {
    try {
      var list = JSON.parse(localStorage.getItem(SAVED_KEY) || '[]');
      return Array.isArray(list) ? list : [];
    } catch (e) {
      return [];
    }
  }

  function writeLocal(list) {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(list));
    } catch (e) {
      throw new Error('This browser’s storage is full or blocked. Delete some saved RAMS and try again.');
    }
  }

  var localStore = {
    kind: 'local',
    where: 'In this browser',
    savedText: 'Saved in this browser',
    note: 'Saved RAMS are stored only in this browser on this device. Clearing your browser data deletes them.',
    list: function () {
      return Promise.resolve(readLocal().map(function (r) {
        return { id: r.id, title: r.title, values: r.values, createdAt: r.createdAt, updatedAt: r.updatedAt };
      }));
    },
    get: function (id) {
      return Promise.resolve(readLocal().filter(function (r) { return r.id === id; })[0] || null);
    },
    put: function (record) {
      return new Promise(function (resolve) {
        var list = readLocal().filter(function (r) { return r.id !== record.id; });
        list.push(record);
        writeLocal(list);
        resolve(record);
      });
    },
    remove: function (id) {
      return new Promise(function (resolve) {
        writeLocal(readLocal().filter(function (r) { return r.id !== id; }));
        resolve();
      });
    }
  };

  var store = localStore;

  function newId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function formatStamp(ms) {
    return new Date(ms).toLocaleString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  function formatTime(ms) {
    return new Date(ms).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }

  function showStorageError(msg) {
    storageError.textContent = msg || '';
    storageError.hidden = !msg;
  }

  function errorText(err) {
    return (err && err.message) ? err.message : 'Something went wrong. Please try again.';
  }

  /* Strip anything executable from stored HTML before putting it back into the page. */
  function cleanHtml(html) {
    var tpl = document.createElement('template');
    tpl.innerHTML = html;
    tpl.content.querySelectorAll('script, iframe, object, embed, link, meta, style, form').forEach(function (el) { el.remove(); });
    tpl.content.querySelectorAll('*').forEach(function (el) {
      Array.prototype.slice.call(el.attributes).forEach(function (attr) {
        var name = attr.name.toLowerCase();
        if (name.indexOf('on') === 0 || /^\s*javascript:/i.test(attr.value)) el.removeAttribute(attr.name);
      });
    });
    return tpl.innerHTML;
  }

  function setStatus(text, kind) {
    saveStatus.textContent = text;
    saveStatus.className = 'save-status' + (kind ? ' is-' + kind : '');
  }

  function updateSaveUI() {
    saveBtn.textContent = currentId ? 'Save changes' : 'Save RAMS';
    saveBtn.disabled = busy || store.disabled === true;
    if (dirty) {
      setStatus(currentId ? 'Unsaved changes' : 'Not saved yet', 'dirty');
    } else if (currentId && currentSavedAt) {
      setStatus(store.savedText + ' at ' + formatTime(currentSavedAt), 'saved');
    } else {
      setStatus('', '');
    }
    editingBanner.hidden = !currentId;
    editingName.textContent = currentTitle;
  }

  function markDirty() {
    if (output.hidden) return;
    dirty = true;
    updateSaveUI();
  }

  function setClean() {
    dirty = false;
    updateSaveUI();
  }

  function saveCurrent() {
    if (!currentValues || busy) return;
    var now = Date.now();
    var record = {
      version: 1,
      id: currentId || newId(),
      title: currentValues.eventName,
      values: currentValues,
      html: doc.innerHTML,
      createdAt: currentCreatedAt || now,
      updatedAt: now
    };
    busy = true;
    updateSaveUI();
    setStatus('Saving…', '');
    store.put(record).then(function () {
      currentId = record.id;
      currentTitle = record.title;
      currentCreatedAt = record.createdAt;
      currentSavedAt = record.updatedAt;
      busy = false;
      setClean();
      renderSavedList();
    }, function (err) {
      busy = false;
      updateSaveUI();
      setStatus('Couldn’t save: ' + errorText(err), 'error');
    });
  }

  function deleteSaved(id) {
    store.remove(id).then(function () {
      if (currentId === id) {
        currentId = null;
        currentTitle = '';
        currentCreatedAt = null;
        currentSavedAt = null;
        currentValues = null;
        dirty = false;
      }
      showStorageError('');
      updateSaveUI();
      renderSavedList();
    }, function (err) {
      showStorageError('Couldn’t delete: ' + errorText(err));
      renderSavedList();
    });
  }

  function openSaved(id) {
    if (dirty && id !== currentId && !confirm('You have unsaved changes to the current RAMS. Open this one anyway?')) return;
    store.get(id).then(function (rec) {
      if (!rec) {
        showStorageError('That RAMS couldn’t be found. It may have been deleted on another device.');
        renderSavedList();
        return;
      }
      currentId = rec.id;
      currentTitle = rec.title;
      currentCreatedAt = rec.createdAt;
      currentSavedAt = rec.updatedAt;
      currentValues = rec.values;
      fillForm(rec.values);
      save(); // keep the form autosave in step with what's on screen
      doc.innerHTML = cleanHtml(rec.html);
      makeEditable();
      showStorageError('');
      showDocument(rec.title);
      setClean();
    }, function (err) {
      showStorageError('Couldn’t open that RAMS: ' + errorText(err));
    });
  }

  var listRequest = 0;
  function renderSavedList() {
    var ticket = ++listRequest;
    savedWhere.textContent = store.where;
    savedNote.textContent = store.note;
    if (store.disabled) {
      savedList.innerHTML = '';
      savedEmpty.hidden = true;
      savedCount.textContent = '';
      return Promise.resolve();
    }
    return store.list().then(function (list) {
      if (ticket !== listRequest) return; // a newer refresh has started
      list.sort(function (a, b) { return b.updatedAt - a.updatedAt; });
      savedEmpty.hidden = list.length > 0;
      savedCount.textContent = list.length ? String(list.length) : '';
      savedList.innerHTML = list.map(function (r) {
        var v = r.values || {};
        var type = DATA.eventTypes[v.eventType];
        var meta = [formatDate(v.eventDate), v.venue, type && type.label].filter(Boolean).map(esc).join(' · ');
        return '<li class="saved-item' + (r.id === currentId ? ' is-current' : '') + '" data-id="' + esc(r.id) + '">' +
          '<div class="saved-info">' +
          '<strong class="saved-title">' + esc(r.title || 'Untitled RAMS') + '</strong>' +
          '<span class="saved-meta">' + meta + '</span>' +
          '<span class="saved-stamp">Last saved ' + esc(formatStamp(r.updatedAt)) + '</span>' +
          '</div>' +
          '<div class="saved-actions">' +
          '<button type="button" class="btn btn-secondary btn-small" data-action="open">Open</button>' +
          '<button type="button" class="btn btn-danger btn-small" data-action="delete">Delete</button>' +
          '</div></li>';
      }).join('');
    }, function (err) {
      if (ticket !== listRequest) return;
      savedList.innerHTML = '';
      savedEmpty.hidden = true;
      showStorageError('Couldn’t load your saved RAMS: ' + errorText(err));
    });
  }

  /* Delete needs a second tap within a few seconds, so a stray tap can't lose work. */
  savedList.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-action]');
    if (!btn) return;
    var id = btn.closest('.saved-item').dataset.id;
    if (btn.dataset.action === 'open') return openSaved(id);
    if (btn.dataset.armed === 'true') {
      btn.disabled = true;
      return deleteSaved(id);
    }
    btn.dataset.armed = 'true';
    btn.textContent = 'Tap again to delete';
    setTimeout(function () {
      if (!btn.isConnected) return;
      btn.dataset.armed = '';
      btn.textContent = 'Delete';
    }, 4000);
  });

  window.addEventListener('beforeunload', function (e) {
    if (dirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  /* Keep the list in step if another tab saves or deletes in this browser. */
  window.addEventListener('storage', function (e) {
    if (e.key === SAVED_KEY && store.kind === 'local') renderSavedList();
  });

  /* Hooks for account.js. */
  window.RamsApp = {
    localStore: localStore,
    /* Switch where RAMS are saved. The RAMS on screen (if any) is treated as not yet saved there. */
    setStore: function (next) {
      if (next === store) return renderSavedList();
      store = next || localStore;
      if (currentId) {
        currentId = null;
        currentTitle = '';
        currentCreatedAt = null;
        currentSavedAt = null;
        if (currentValues && !output.hidden) dirty = true;
      }
      showStorageError('');
      updateSaveUI();
      return renderSavedList();
    },
    refreshSaved: function () { return renderSavedList(); },
    newId: newId
  };

  /* ---------- Screens ---------- */

  function showDocument(title) {
    form.hidden = true;
    savedSection.hidden = true;
    output.hidden = false;
    document.title = 'RAMS – ' + title;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function showStart(scrollTarget) {
    output.hidden = true;
    form.hidden = false;
    savedSection.hidden = false;
    document.title = 'RAMS Generator';
    renderSavedList();
    updateSaveUI();
    if (scrollTarget) scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- Events ---------- */

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = readForm();
    var err = validate(v);
    if (err) {
      errorBox.textContent = err;
      errorBox.hidden = false;
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    errorBox.hidden = true;
    currentValues = v;
    render(v);
    showDocument(v.eventName);
    dirty = true;
    updateSaveUI();
  });

  saveBtn.addEventListener('click', saveCurrent);

  document.getElementById('edit-btn').addEventListener('click', function () {
    showStart(form);
  });

  document.getElementById('list-btn').addEventListener('click', function () {
    showStart(savedSection);
  });

  document.getElementById('new-btn').addEventListener('click', function () {
    if (dirty && !confirm('You have unsaved changes to this RAMS. Start a new one anyway?')) return;
    currentId = null;
    currentTitle = '';
    currentCreatedAt = null;
    currentSavedAt = null;
    currentValues = null;
    dirty = false;
    form.reset();
    form.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });
    try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
    showStart(form);
  });

  document.getElementById('print-btn').addEventListener('click', function () {
    window.print();
  });

  document.getElementById('reset-btn').addEventListener('click', function () {
    if (!confirm('Clear all fields?')) return;
    form.reset();
    form.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });
    errorBox.hidden = true;
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  });

  /* Check storage works at all, then show the list. */
  try {
    localStorage.setItem(SAVED_KEY + ':probe', '1');
    localStorage.removeItem(SAVED_KEY + ':probe');
  } catch (e) {
    localStore.disabled = true;
    localStore.note = 'This browser is blocking storage (for example, in a private window), so RAMS can’t be saved here.';
  }
  renderSavedList();
  updateSaveUI();
})();
