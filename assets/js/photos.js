/* ==========================================================================
   photos.js — real-photo layer, zero setup required.

   IMPORTANT DESIGN NOTE (why this version exists):
   The Wikipedia REST endpoint (/api/rest_v1/page/summary/...) does NOT send
   CORS headers for arbitrary origins, so a static site hosted on GitHub
   Pages gets a silent CORS failure and no photo ever appears. The older
   MediaWiki "action API" (/w/api.php) DOES support anonymous cross-origin
   requests when called with origin=* — so this version routes everything
   through that endpoint instead. This is the difference between photos
   showing up on a deployed GitHub Pages site and not.

   Destination and package cards use a curated, hand-verified Wikipedia
   page title per real destination. Hotel cards search for the hotel's
   real neighbourhood first and fall back to the destination photo. If a
   photo is unavailable for any reason, the illustration underneath is
   untouched — nothing else on the site depends on this working.
   ========================================================================== */
(function (global) {
  'use strict';

  // curated, individually verified Wikipedia page title per destination id
  var WIKI_TITLE = {
    goa: 'Goa',
    manali: 'Manali',
    jaipur: 'Jaipur',
    kerala: 'Alappuzha',
    ladakh: 'Leh',
    andaman: 'Havelock Island',
    rishikesh: 'Rishikesh',
    udaipur: 'Udaipur',
    shillong: 'Shillong',
    jaisalmer: 'Jaisalmer',
    munnar: 'Munnar',
    coorg: 'Madikeri',
    pondicherry: 'Pondicherry',
    nainital: 'Nainital',
    darjeeling: 'Darjeeling',
    gangtok: 'Gangtok',
    // new destinations
    sinhagad: 'Sinhagad',
    raigad: 'Raigad Fort',
    diveagar: 'Diveagar',
    ambyvalley: 'Aamby Valley',
    lonavala: 'Lonavla',
    goldentemple: 'Golden Temple',
    ooty: 'Ooty'
  };

  var API = 'https://en.wikipedia.org/w/api.php';
  var CACHE_PREFIX = 'yk_wikiphoto_';
  var CACHE_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
  var inflight = {};

  function cacheGet(key) {
    try {
      var raw = localStorage.getItem(CACHE_PREFIX + key);
      if (!raw) return undefined;
      var rec = JSON.parse(raw);
      if (Date.now() - rec.t > CACHE_MS) return undefined;
      return rec.url;
    } catch (e) { return undefined; }
  }
  function cacheSet(key, url) {
    try { localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ url: url, t: Date.now() })); }
    catch (e) { /* storage full/disabled — skip */ }
  }

  /* Fetch the lead image for an exact known page title, via the CORS-safe
     action API. pithumbsize gives us a reasonably large lead image. */
  function pageImage(title) {
    var url = API + '?action=query&format=json&origin=*&prop=pageimages' +
      '&piprop=original|thumbnail&pithumbsize=1000&redirects=1&titles=' +
      encodeURIComponent(title);
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error('wiki ' + r.status); return r.json(); })
      .then(function (data) {
        var pages = data && data.query && data.query.pages;
        if (!pages) return null;
        var key = Object.keys(pages)[0];
        var page = pages[key];
        if (!page) return null;
        return (page.original && page.original.source) ||
          (page.thumbnail && page.thumbnail.source) || null;
      })
      .catch(function () { return null; });
  }

  /* Find the best real page title for a loose search phrase, CORS-safe. */
  function searchTitle(query) {
    var url = API + '?action=query&format=json&origin=*&list=search&srlimit=1&srsearch=' +
      encodeURIComponent(query);
    return fetch(url)
      .then(function (r) { if (!r.ok) throw new Error('wiki search ' + r.status); return r.json(); })
      .then(function (data) {
        var hits = data && data.query && data.query.search;
        return (hits && hits[0] && hits[0].title) || null;
      })
      .catch(function () { return null; });
  }

  function getDestPhoto(destId) {
    var title = WIKI_TITLE[destId];
    if (!title) return Promise.resolve(null);
    var cacheKey = 'dest_' + destId;
    var cached = cacheGet(cacheKey);
    if (cached !== undefined) return Promise.resolve(cached);
    if (inflight[cacheKey]) return inflight[cacheKey];
    inflight[cacheKey] = pageImage(title).then(function (url) {
      cacheSet(cacheKey, url);
      delete inflight[cacheKey];
      return url;
    });
    return inflight[cacheKey];
  }

  function getHotelPhoto(area, state, fallbackDestId) {
    var cacheKey = 'area_' + area + '|' + state;
    var cached = cacheGet(cacheKey);
    if (cached !== undefined) {
      return cached ? Promise.resolve(cached) : getDestPhoto(fallbackDestId);
    }
    if (inflight[cacheKey]) {
      return inflight[cacheKey].then(function (u) { return u || getDestPhoto(fallbackDestId); });
    }
    inflight[cacheKey] = searchTitle(area + ' ' + state + ' India')
      .then(function (title) { return title ? pageImage(title) : null; })
      .then(function (url) {
        cacheSet(cacheKey, url);
        delete inflight[cacheKey];
        return url;
      });
    return inflight[cacheKey].then(function (u) { return u || getDestPhoto(fallbackDestId); });
  }

  function attachImg(el, url) {
    if (!url || !el || !el.isConnected) return;
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
  }

  function fillPhoto(el, destId) {
    if (!el || !destId) return;
    getDestPhoto(destId).then(function (url) { attachImg(el, url); });
  }
  function fillHotelPhoto(el, area, state, fallbackDestId) {
    if (!el || !area) return;
    getHotelPhoto(area, state, fallbackDestId).then(function (url) { attachImg(el, url); });
  }

  global.Photos = {
    fillPhoto: fillPhoto,
    fillHotelPhoto: fillHotelPhoto,
    getDestPhoto: getDestPhoto,
    enabled: true
  };
})(window);
