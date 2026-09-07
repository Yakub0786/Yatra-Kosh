/* ==========================================================================
   photos.js — real-photo layer, zero setup required.

   v4: pulls the actual lead photo from each real destination's Wikipedia
   article — a genuine photo of Goa for Goa, of Manali for Manali, and so
   on — via Wikipedia's public REST API (no key, no signup, explicitly
   CORS-enabled for exactly this kind of use, and about as reliable as
   free infrastructure gets).

   The 67 hotels and 6 packages in this catalogue are fictional, so there
   is no real photo of "Casa Anjuna Beach Resort" to fetch. Every hotel
   and package card instead shows the real photo of the destination it's
   *in* — every Goa hotel shows the real Goa photo, every Rajasthan
   package shows the real Jaipur photo, etc. That is a deliberate choice:
   a real photo of the real place is more honest than a random stock photo
   with no connection to it at all.

   If a photo is unavailable for any reason, the illustration underneath
   is untouched — nothing else on the site depends on this working.
   ========================================================================== */
(function (global) {
  'use strict';

  // curated Wikipedia article title for each real destination in data.js —
  // hand-picked rather than searched, so there's no risk of a mismatched result
  var WIKI_TITLE = {
    goa: 'Goa',
    manali: 'Manali, Himachal Pradesh',
    jaipur: 'Jaipur',
    kerala: 'Alappuzha',
    ladakh: 'Leh',
    andaman: 'Havelock Island',
    rishikesh: 'Rishikesh',
    udaipur: 'Udaipur',
    shillong: 'Shillong',
    jaisalmer: 'Jaisalmer',
    munnar: 'Munnar',
    coorg: 'Kodagu district',
    pondicherry: 'Puducherry (city)',
    nainital: 'Nainital',
    darjeeling: 'Darjeeling',
    gangtok: 'Gangtok'
  };

  var CACHE_PREFIX = 'yk_wikiphoto_';
  var CACHE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
  var inflight = {};

  function cacheGet(destId) {
    try {
      var raw = localStorage.getItem(CACHE_PREFIX + destId);
      if (!raw) return undefined;
      var rec = JSON.parse(raw);
      if (Date.now() - rec.t > CACHE_MS) return undefined;
      return rec.url; // may be null = "checked, no image available"
    } catch (e) { return undefined; }
  }
  function cacheSet(destId, url) {
    try { localStorage.setItem(CACHE_PREFIX + destId, JSON.stringify({ url: url, t: Date.now() })); }
    catch (e) { /* storage full or disabled — skip caching, not fatal */ }
  }

  /**
   * getDestPhoto(destId) -> Promise<string|null>
   * Resolves to a real photo URL for that destination, or null if none is
   * available for any reason. Never rejects.
   */
  function getDestPhoto(destId) {
    var title = WIKI_TITLE[destId];
    if (!title) return Promise.resolve(null);

    var cached = cacheGet(destId);
    if (cached !== undefined) return Promise.resolve(cached);
    if (inflight[destId]) return inflight[destId];

    var url = 'https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title);
    inflight[destId] = fetch(url, { headers: { 'Accept': 'application/json' } })
      .then(function (r) { if (!r.ok) throw new Error('wiki ' + r.status); return r.json(); })
      .then(function (data) {
        var photoUrl = (data.originalimage && data.originalimage.source) ||
          (data.thumbnail && data.thumbnail.source) || null;
        cacheSet(destId, photoUrl);
        delete inflight[destId];
        return photoUrl;
      })
      .catch(function () { delete inflight[destId]; return null; });

    return inflight[destId];
  }

  /**
   * fillPhoto(el, destId) — el is the .dest-art / .ticket-art / .pkg-art /
   * hero wrapper that already contains the SVG illustration. destId is one
   * of the 16 real destination ids in DESTINATIONS (assets/js/data.js) —
   * for a hotel or package card, pass the destination it belongs to, not
   * the fictional property's own name. Fades a real <img> in on success;
   * does nothing on failure, leaving the illustration exactly as it was.
   */
  function fillPhoto(el, destId) {
    if (!el || !destId) return;
    getDestPhoto(destId).then(function (url) {
      if (!url || !el.isConnected) return;
      var img = document.createElement('img');
      img.src = url;
      img.alt = '';
      img.loading = 'lazy';
      img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;' +
        'object-fit:cover;opacity:0;transition:opacity .35s ease;';
      img.onload = function () { img.style.opacity = '1'; };
      img.onerror = function () { img.remove(); };
      el.style.position = el.style.position || 'relative';
      el.appendChild(img);
    });
  }

  global.Photos = { fillPhoto: fillPhoto, getDestPhoto: getDestPhoto, enabled: true };
})(window);
