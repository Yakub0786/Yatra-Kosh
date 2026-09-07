/* ==========================================================================
   tracking.js — behavioural data collection layer
   Behavioural Data Analytics & UX mini project

   Captures, per the course guidelines:
     page views · button clicks · scroll depth · mouse behaviour
     form analytics · search analytics · session analytics
     device · browser · screen resolution · geography · downloads · video

   Every event carries the 16 required fields (user id, session id, page,
   click position, scroll depth, search query, time on page, session time,
   device, browser, resolution, referrer, language, date & time, plus
   event type and label).

   Public API:
     YK.track(type, props)   fire a custom event
     YK.events()             array of everything stored on this device
     YK.toCSV()              CSV string
     YK.download()           save events.csv
     YK.reset()              wipe local events (does not touch the server)
     YK.summary()            quick counts, handy in the console
   ========================================================================== */
(function (global) {
  'use strict';

  var CFG = Object.assign({
    endpoint: '', siteId: 'site', version: '1.0', requireConsent: true,
    sampleMouseMs: 2000, flushMs: 6000, maxStored: 6000, lookupGeo: true, debug: false
  }, global.TRACK_CONFIG || {});

  var K = {
    user: 'yk_user', visits: 'yk_visits', events: 'yk_events',
    consent: 'yk_consent', geo: 'yk_geo', sess: 'yk_session'
  };

  /* ---------- small helpers ---------- */
  function uid(prefix) {
    return prefix + '-' + Date.now().toString(36) + '-' +
      Math.random().toString(36).slice(2, 8);
  }
  function ls(key, val) {
    try {
      if (val === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, val); return val;
    } catch (e) { return null; }
  }
  function ss(key, val) {
    try {
      if (val === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, val); return val;
    } catch (e) { return null; }
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  /* ---------- environment ---------- */
  function deviceType() {
    var w = screen.width, ua = navigator.userAgent;
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua))) return 'Tablet';
    if (/Mobi|Android|iPhone|iPod|Windows Phone/i.test(ua) || w < 768) return 'Mobile';
    if (w < 1024) return 'Tablet';
    return 'Desktop';
  }
  function browserName() {
    var u = navigator.userAgent;
    if (/Edg\//.test(u)) return 'Edge';
    if (/OPR\/|Opera/.test(u)) return 'Opera';
    if (/Chrome\//.test(u) && !/Chromium/.test(u)) return 'Chrome';
    if (/Firefox\//.test(u)) return 'Firefox';
    if (/Safari\//.test(u) && !/Chrome/.test(u)) return 'Safari';
    return 'Other';
  }
  function osName() {
    var u = navigator.userAgent;
    if (/Windows/.test(u)) return 'Windows';
    if (/Android/.test(u)) return 'Android';
    if (/iPhone|iPad|iPod/.test(u)) return 'iOS';
    if (/Mac OS X/.test(u)) return 'macOS';
    if (/Linux/.test(u)) return 'Linux';
    return 'Other';
  }
  function pageName() {
    var p = location.pathname.split('/').pop() || 'index.html';
    return p.replace(/\.html?$/, '') || 'index';
  }

  /* ---------- consent ---------- */
  var consent = ls(K.consent);
  function hasConsent() { return !CFG.requireConsent || consent === 'granted'; }

  /* ---------- identity & session ---------- */
  var userId = ls(K.user);
  var isNewUser = !userId;
  if (!userId) { userId = uid('u'); ls(K.user, userId); }

  var visits = parseInt(ls(K.visits) || '0', 10);

  var sess = null;
  try { sess = JSON.parse(ss(K.sess) || 'null'); } catch (e) { sess = null; }
  var freshSession = !sess;
  if (!sess) {
    visits += 1; ls(K.visits, String(visits));
    sess = {
      id: uid('s'),
      start: Date.now(),
      entry: pageName(),
      referrer: document.referrer || 'direct',
      pages: 0
    };
  }
  sess.pages = (sess.pages || 0) + 1;
  ss(K.sess, JSON.stringify(sess));

  /* ---------- geography (one lookup per visitor, cached) ---------- */
  var geo = { country: '', region: '', city: '' };
  try { geo = JSON.parse(ls(K.geo) || 'null') || geo; } catch (e) { }
  function lookupGeo() {
    if (!CFG.lookupGeo || geo.country) return;
    if (!('fetch' in global)) return;
    fetch('https://ipapi.co/json/')
      .then(function (r) { return r.json(); })
      .then(function (d) {
        geo = { country: d.country_name || '', region: d.region || '', city: d.city || '' };
        ls(K.geo, JSON.stringify(geo));
      })
      .catch(function () { /* offline or blocked — fields stay empty */ });
  }

  /* ---------- storage ---------- */
  function readAll() {
    try { return JSON.parse(ls(K.events) || '[]'); } catch (e) { return []; }
  }
  function writeAll(arr) {
    if (arr.length > CFG.maxStored) arr = arr.slice(arr.length - CFG.maxStored);
    try { ls(K.events, JSON.stringify(arr)); } catch (e) {
      // quota hit — keep the most recent half and try once more
      try { ls(K.events, JSON.stringify(arr.slice(Math.floor(arr.length / 2)))); } catch (e2) { }
    }
  }

  /* ---------- outbound queue ---------- */
  var queue = [];
  function flush(sync) {
    if (!CFG.endpoint || !queue.length) return;
    var batch = queue.splice(0, queue.length);
    var body = JSON.stringify({ site: CFG.siteId, events: batch });
    try {
      if (sync && navigator.sendBeacon) {
        navigator.sendBeacon(CFG.endpoint, new Blob([body], { type: 'text/plain;charset=utf-8' }));
      } else {
        fetch(CFG.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // avoids CORS preflight
          body: body,
          keepalive: true
        }).catch(function () { queue = batch.concat(queue); }); // retry next flush
      }
    } catch (e) { queue = batch.concat(queue); }
  }
  if (CFG.flushMs) setInterval(function () { flush(false); }, CFG.flushMs);

  /* ---------- the event record ---------- */
  var pageStart = Date.now();
  var seq = 0;

  function build(type, p) {
    p = p || {};
    var now = new Date();
    seq += 1;
    return {
      event_id: sess.id + '-' + seq,
      user_id: userId,
      session_id: sess.id,
      timestamp: now.toISOString(),
      date: now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()),
      time: pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()),
      hour: now.getHours(),
      weekday: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][now.getDay()],

      event_type: type,
      event_category: p.category || '',
      event_label: p.label || '',
      event_value: p.value === undefined ? '' : p.value,

      page: pageName(),
      page_title: document.title,
      click_x: p.x === undefined ? '' : Math.round(p.x),
      click_y: p.y === undefined ? '' : Math.round(p.y),
      scroll_depth: p.scroll === undefined ? '' : p.scroll,
      search_query: p.query === undefined ? '' : p.query,
      search_results: p.results === undefined ? '' : p.results,

      time_on_page: Math.round((Date.now() - pageStart) / 1000),
      session_time: Math.round((Date.now() - sess.start) / 1000),
      pages_in_session: sess.pages,
      is_new_user: isNewUser ? 1 : 0,
      visitor_type: visits > 1 ? 'Returning' : 'New',
      visit_number: visits,
      entry_page: sess.entry,
      referrer: sess.referrer,

      device: deviceType(),
      browser: browserName(),
      os: osName(),
      screen_resolution: screen.width + 'x' + screen.height,
      viewport: window.innerWidth + 'x' + window.innerHeight,
      language: navigator.language || '',

      country: geo.country, region: geo.region, city: geo.city
    };
  }

  function track(type, p) {
    if (!hasConsent()) return;
    var e = build(type, p);
    var all = readAll(); all.push(e); writeAll(all);
    queue.push(e);
    if (CFG.debug) console.log('[track]', type, e);
    document.dispatchEvent(new CustomEvent('yk:event', { detail: e }));
  }

  /* ======================================================================
     Automatic collectors
     ====================================================================== */
  function startCollectors() {

    /* --- 1. session + page view --- */
    if (freshSession) {
      track('session_start', { category: 'session', label: sess.entry });
    }
    track('page_view', { category: 'navigation', label: document.title });

    /* --- 2. button / link clicks + click position --- */
    document.addEventListener('click', function (ev) {
      var t = ev.target.closest('[data-track], a, button');
      if (!t) {
        track('click', { category: 'body', label: 'blank area', x: ev.pageX, y: ev.pageY });
        return;
      }
      var label = t.getAttribute('data-track') ||
        (t.innerText || t.textContent || '').trim().slice(0, 60) ||
        t.getAttribute('aria-label') || t.tagName.toLowerCase();
      var cat = t.getAttribute('data-cat') || (t.tagName === 'A' ? 'link' : 'button');
      track('click', { category: cat, label: label, x: ev.pageX, y: ev.pageY });
    }, true);

    /* --- 3. scroll depth 25 / 50 / 75 / 100 --- */
    var marks = [25, 50, 75, 100], hit = {};
    function onScroll() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      if (h <= 0) return;
      var pct = Math.min(100, Math.round((window.scrollY / h) * 100));
      marks.forEach(function (m) {
        if (pct >= m && !hit[m]) {
          hit[m] = true;
          track('scroll_depth', { category: 'engagement', label: m + '%', scroll: m });
        }
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(onScroll, 400); // short pages reach 100% immediately

    /* --- 4. mouse behaviour: hover, double click, right click, movement --- */
    document.addEventListener('mouseover', function (ev) {
      var t = ev.target.closest('[data-hover]');
      if (!t) return;
      if (t.__hovered) return;
      t.__hovered = true;
      setTimeout(function () { t.__hovered = false; }, 1200);
      track('hover', { category: 'mouse', label: t.getAttribute('data-hover'), x: ev.pageX, y: ev.pageY });
    });
    document.addEventListener('dblclick', function (ev) {
      track('double_click', { category: 'mouse', label: (ev.target.innerText || '').trim().slice(0, 40), x: ev.pageX, y: ev.pageY });
    });
    document.addEventListener('contextmenu', function (ev) {
      track('right_click', { category: 'mouse', label: ev.target.tagName.toLowerCase(), x: ev.pageX, y: ev.pageY });
    });
    var lastMove = 0;
    document.addEventListener('mousemove', function (ev) {
      var now = Date.now();
      if (now - lastMove < CFG.sampleMouseMs) return;
      lastMove = now;
      track('mouse_move', { category: 'mouse', label: 'sample', x: ev.pageX, y: ev.pageY });
    }, { passive: true });

    /* --- 5. form analytics: start, submit, errors, abandonment --- */
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      var name = form.getAttribute('data-form');
      var started = false, submitted = false, tStart = 0, failedThisAttempt = false;

      form.addEventListener('focusin', function () {
        if (started) return;
        started = true; tStart = Date.now();
        track('form_start', { category: 'form', label: name });
      });

      // Validation runs in the page's own submit handler, which is registered
      // before this one, so any yk:formerror has already fired by the time we
      // get here. A rejected attempt is logged as form_error, not form_submit.
      form.addEventListener('submit', function () {
        if (failedThisAttempt) { failedThisAttempt = false; return; }
        submitted = true;
        track('form_submit', {
          category: 'form', label: name,
          value: tStart ? Math.round((Date.now() - tStart) / 1000) : ''
        });
      });

      form.addEventListener('yk:formerror', function (ev) {
        failedThisAttempt = true;
        track('form_error', { category: 'form', label: name, value: (ev.detail || {}).field || '' });
      });

      window.addEventListener('pagehide', function () {
        if (started && !submitted) {
          track('form_abandon', {
            category: 'form', label: name,
            value: Math.round((Date.now() - tStart) / 1000)
          });
        }
      });
    });

    /* --- 6. downloads --- */
    document.addEventListener('click', function (ev) {
      var a = ev.target.closest('a[download], a[href$=".pdf"]');
      if (!a) return;
      track('download', { category: 'download', label: a.getAttribute('href').split('/').pop() });
    });

    /* --- 7. video (optional in the brief) --- */
    document.querySelectorAll('video[data-video]').forEach(function (v) {
      var n = v.getAttribute('data-video');
      v.addEventListener('play', function () { track('video_play', { category: 'video', label: n }); });
      v.addEventListener('pause', function () { track('video_pause', { category: 'video', label: n, value: Math.round(v.currentTime) }); });
      v.addEventListener('ended', function () { track('video_complete', { category: 'video', label: n }); });
    });

    /* --- 8. exit: time on page, session close --- */
    var exited = false;
    function onExit() {
      if (exited) return; exited = true;
      track('page_exit', {
        category: 'navigation', label: pageName(),
        value: Math.round((Date.now() - pageStart) / 1000)
      });
      flush(true);
    }
    window.addEventListener('pagehide', onExit);
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState === 'hidden') flush(true);
    });

    lookupGeo();
  }

  /* ======================================================================
     Consent banner
     ====================================================================== */
  function consentBanner() {
    if (!CFG.requireConsent || consent) { if (hasConsent()) startCollectors(); return; }
    var el = document.createElement('div');
    el.className = 'consent show';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Data collection notice');
    el.innerHTML =
      '<h3 style="margin-bottom:8px;font-size:1.05rem">We record how this page is used</h3>' +
      '<p>This is a student project. While you browse, the site logs pages viewed, clicks, ' +
      'scrolling, searches, form activity and your device type — no names, no email, no payment data. ' +
      'The data is used only for coursework analysis and you can decline without losing any feature.</p>' +
      '<div class="consent-actions">' +
      '<button class="btn btn-primary btn-sm" id="yk-yes">Allow tracking</button>' +
      '<button class="btn btn-ghost btn-sm" id="yk-no">Browse without tracking</button>' +
      '</div>';
    document.body.appendChild(el);
    el.querySelector('#yk-yes').addEventListener('click', function () {
      consent = 'granted'; ls(K.consent, consent); el.remove(); startCollectors();
    });
    el.querySelector('#yk-no').addEventListener('click', function () {
      consent = 'denied'; ls(K.consent, consent); el.remove();
    });
  }

  /* ======================================================================
     Export
     ====================================================================== */
  var COLS = ['event_id', 'user_id', 'session_id', 'timestamp', 'date', 'time', 'hour', 'weekday',
    'event_type', 'event_category', 'event_label', 'event_value',
    'page', 'page_title', 'click_x', 'click_y', 'scroll_depth', 'search_query', 'search_results',
    'time_on_page', 'session_time', 'pages_in_session', 'is_new_user', 'visitor_type', 'visit_number',
    'entry_page', 'referrer', 'device', 'browser', 'os', 'screen_resolution', 'viewport',
    'language', 'country', 'region', 'city'];

  function esc(v) {
    v = (v === null || v === undefined) ? '' : String(v);
    return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
  }
  function toCSV() {
    var rows = readAll();
    var out = [COLS.join(',')];
    rows.forEach(function (r) { out.push(COLS.map(function (c) { return esc(r[c]); }).join(',')); });
    return out.join('\n');
  }
  function download() {
    var blob = new Blob([toCSV()], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'behaviour_events_' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(a); a.click(); a.remove();
  }
  function summary() {
    var rows = readAll(), by = {};
    rows.forEach(function (r) { by[r.event_type] = (by[r.event_type] || 0) + 1; });
    return {
      events: rows.length,
      sessions: new Set(rows.map(function (r) { return r.session_id; })).size,
      users: new Set(rows.map(function (r) { return r.user_id; })).size,
      byType: by
    };
  }

  global.YK = {
    track: track,
    events: readAll,
    toCSV: toCSV,
    download: download,
    summary: summary,
    reset: function () { ls(K.events, '[]'); },
    config: CFG,
    columns: COLS,
    ids: function () { return { user: userId, session: sess.id, visits: visits }; }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', consentBanner);
  } else { consentBanner(); }

})(window);
