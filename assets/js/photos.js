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
      // if the curated title somehow has no lead image, fall back to a search
      if (url) return url;
      return searchTitle(title + ' India').then(function (t) {
        return t ? pageImage(t) : null;
      });
    }).then(function (url) {
      cacheSet(cacheKey, url);
      delete inflight[cacheKey];
      return url;
    });
    return inflight[cacheKey];
  }

  // Per-destination pools of real, distinct landmarks/areas — so different
  // hotels in the same destination show DIFFERENT real photos rather than the
  // same one repeated. Each is a Wikipedia search phrase that returns a photo.
  var DEST_LANDMARKS = {
    goa: ['Baga Beach','Anjuna Beach','Basilica of Bom Jesus Goa','Palolem Beach','Fontainhas Goa'],
    manali: ['Solang Valley','Hadimba Temple Manali','Rohtang Pass','Old Manali','Beas River Manali'],
    jaipur: ['Hawa Mahal','Amer Fort','City Palace Jaipur','Jal Mahal','Nahargarh Fort'],
    kerala: ['Alappuzha backwaters','Kumarakom','Kerala houseboat','Vembanad Lake','Marari Beach'],
    ladakh: ['Pangong Tso','Thiksey Monastery','Nubra Valley','Leh Palace','Shanti Stupa Leh'],
    andaman: ['Radhanagar Beach','Havelock Island','Cellular Jail','Neil Island','Ross Island Andaman'],
    rishikesh: ['Lakshman Jhula','Ram Jhula','Triveni Ghat','Rishikesh Ganga','Neelkanth Mahadev Temple'],
    udaipur: ['Lake Pichola','City Palace Udaipur','Jag Mandir','Fateh Sagar Lake','Sajjangarh Palace'],
    shillong: ['Umiam Lake','Elephant Falls Shillong','Shillong Peak','Ward\u2019s Lake Shillong','Laitlum Canyons'],
    jaisalmer: ['Jaisalmer Fort','Sam Sand Dunes','Patwon Ki Haveli','Gadisar Lake','Jaisalmer haveli'],
    munnar: ['Munnar tea gardens','Eravikulam National Park','Mattupetty Dam','Kundala Lake','Top Station Munnar'],
    coorg: ['Abbey Falls','Madikeri','Raja\u2019s Seat Coorg','Dubare Elephant Camp','Talacauvery'],
    pondicherry: ['Promenade Beach Pondicherry','Auroville','French Quarter Pondicherry','Paradise Beach Pondicherry','Sri Aurobindo Ashram'],
    nainital: ['Naini Lake','Naina Devi Temple','Tiffin Top','Bhimtal','Snow View Point Nainital'],
    darjeeling: ['Darjeeling Himalayan Railway','Tiger Hill Darjeeling','Batasia Loop','Darjeeling tea garden','Peace Pagoda Darjeeling'],
    gangtok: ['Tsomgo Lake','MG Marg Gangtok','Rumtek Monastery','Nathula Pass','Ganesh Tok'],
    sinhagad: ['Sinhagad','Sinhagad fort','Khadakwasla','Pune fort','Sahyadri fort'],
    raigad: ['Raigad Fort','Raigad ropeway','Maratha fort','Raigad Maharashtra','Pachad'],
    diveagar: ['Diveagar','Diveagar beach','Konkan beach','Shrivardhan','Harihareshwar'],
    ambyvalley: ['Aamby Valley','Lonavala lake','Sahyadri hills','Lonavala','Western Ghats Maharashtra'],
    lonavala: ['Bhushi Dam','Tiger\u2019s Leap Lonavala','Lonavala','Rajmachi','Karla Caves'],
    goldentemple: ['Golden Temple','Harmandir Sahib','Amritsar','Jallianwala Bagh','Akal Takht'],
    ooty: ['Ooty Lake','Nilgiri Mountain Railway','Ooty Botanical Garden','Doddabetta','Ooty tea estate']
  };

  function pickLandmark(destId, hotelId){
    var pool = DEST_LANDMARKS[destId];
    if (!pool || !pool.length) return null;
    // deterministic index from the hotel id, so each hotel keeps the same photo
    var h = 0, s = String(hotelId || '');
    for (var i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i)) >>> 0;
    return pool[h % pool.length];
  }

  function getLandmarkPhoto(landmark, fallbackDestId){
    if (!landmark) return getDestPhoto(fallbackDestId);
    var cacheKey = 'lm_' + landmark;
    var cached = cacheGet(cacheKey);
    if (cached !== undefined) return cached ? Promise.resolve(cached) : getDestPhoto(fallbackDestId);
    if (inflight[cacheKey]) return inflight[cacheKey].then(function(u){ return u || getDestPhoto(fallbackDestId); });
    inflight[cacheKey] = pageImage(landmark).then(function(url){
      if (url) return url;
      return searchTitle(landmark).then(function(t){ return t ? pageImage(t) : null; });
    }).then(function(url){
      cacheSet(cacheKey, url);
      delete inflight[cacheKey];
      return url;
    });
    return inflight[cacheKey].then(function(u){ return u || getDestPhoto(fallbackDestId); });
  }

  function attachImg(el, url) {
    if (!url || !el || !el.isConnected) return;
    // remove any photo we placed earlier (so a later, better photo replaces it cleanly)
    var prev = el.querySelector('img[data-yk-photo]');
    var img = document.createElement('img');
    img.src = url;
    img.alt = '';
    img.loading = 'lazy';
    img.setAttribute('data-yk-photo', '1');
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;' +
      'object-fit:cover;opacity:0;transition:opacity .35s ease;';
    img.onload = function () { img.style.opacity = '1'; if (prev) prev.remove(); };
    img.onerror = function () { img.remove(); };
    el.style.position = el.style.position || 'relative';
    el.appendChild(img);
  }

  /* ---- hotel room photos, pulled from Wikimedia Commons categories ----
     Real, freely-licensed hotel-room / bedroom / suite / resort photos.
     We gather a large pool (200+) across several categories, then hand each
     hotel a UNIQUE photo from it so no two hotels repeat. CORS-safe action
     API, cached for 30 days after the first load. */
  var ROOM_CATEGORIES = [
    'Category:Hotel rooms',
    'Category:Hotel bedrooms',
    'Category:Hotel suites',
    'Category:Interiors of hotels',
    'Category:Hotel rooms in India',
    'Category:Guest rooms',
    'Category:Double rooms',
    'Category:Resort hotels'
  ];
  var roomPoolPromise = null;

  function fetchCategoryTitles(cat) {
    // pull up to ~200 file titles from one category, following continuation
    var acc = [];
    function page(cont) {
      var url = API + '?action=query&format=json&origin=*&list=categorymembers' +
        '&cmtype=file&cmlimit=200&cmtitle=' + encodeURIComponent(cat) +
        (cont ? '&cmcontinue=' + encodeURIComponent(cont) : '');
      return fetch(url).then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d || !d.query) return acc;
          d.query.categorymembers.forEach(function (m) { acc.push(m.title); });
          if (d.continue && d.continue.cmcontinue && acc.length < 200) {
            return page(d.continue.cmcontinue);
          }
          return acc;
        }).catch(function () { return acc; });
    }
    return page(null);
  }

  function resolveTitlesToUrls(titles) {
    // imageinfo accepts at most 50 titles per request — batch them
    var batches = [];
    for (var i = 0; i < titles.length; i += 50) batches.push(titles.slice(i, i + 50));
    var calls = batches.map(function (batch) {
      var url = API + '?action=query&format=json&origin=*&prop=imageinfo' +
        '&iiprop=url|size&iiurlwidth=900&titles=' + encodeURIComponent(batch.join('|'));
      return fetch(url).then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) {
          if (!d || !d.query) return [];
          var pages = d.query.pages, urls = [];
          Object.keys(pages).forEach(function (k) {
            var ii = pages[k].imageinfo;
            if (!ii || !ii[0]) return;
            // skip portrait-heavy or tiny images so cards look like rooms, not odd crops
            var w = ii[0].width || 900, h = ii[0].height || 600;
            if (w && h && h / w > 1.6) return;
            urls.push(ii[0].thumburl || ii[0].url);
          });
          return urls;
        }).catch(function () { return []; });
    });
    return Promise.all(calls).then(function (lists) {
      var out = [];
      lists.forEach(function (l) { out = out.concat(l); });
      return out;
    });
  }

  function loadRoomPool() {
    if (roomPoolPromise) return roomPoolPromise;
    var cached = cacheGet('roompool2');
    if (cached !== undefined && cached && cached.length >= 120) {
      roomPoolPromise = Promise.resolve(cached);
      return roomPoolPromise;
    }
    roomPoolPromise = Promise.all(ROOM_CATEGORIES.map(fetchCategoryTitles)).then(function (lists) {
      // merge + dedupe titles, drop obvious non-room files
      var seen = {}, titles = [];
      lists.forEach(function (l) {
        l.forEach(function (t) {
          var low = t.toLowerCase();
          if (seen[t]) return;
          if (!/\.(jpg|jpeg|png)$/.test(low)) return;
          if (/logo|map|floor|plan|diagram|1900s|1910s|prison|lingerie|birthday|exterior|facade|entrance|lobby sign|menu|receipt|brochure/.test(low)) return;
          seen[t] = 1; titles.push(t);
        });
      });
      // cap the number we resolve so we don't fire dozens of requests
      titles = titles.slice(0, 260);
      return resolveTitlesToUrls(titles);
    }).then(function (urls) {
      // final dedupe of URLs
      var seen = {}, pool = [];
      urls.forEach(function (u) { if (u && !seen[u]) { seen[u] = 1; pool.push(u); } });
      if (pool.length) cacheSet('roompool2', pool);
      return pool;
    }).catch(function () { return []; });
    return roomPoolPromise;
  }

  // stable, collision-free assignment: sort hotels once, give each a distinct
  // index into the shuffled pool so no two share a photo (until the pool runs out)
  var hotelPhotoIndex = null;
  function buildIndex(pool) {
    if (hotelPhotoIndex) return hotelPhotoIndex;
    hotelPhotoIndex = {};
    var ids = (typeof HOTELS !== 'undefined' ? HOTELS.map(function (h) { return h.id; }) : []).slice().sort();
    // deterministic shuffle of the pool seeded by a constant, so it's stable across loads
    var shuffled = pool.slice();
    var seed = 20260906;
    for (var i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      var j = Math.floor((seed / 233280) * (i + 1));
      var tmp = shuffled[i]; shuffled[i] = shuffled[j]; shuffled[j] = tmp;
    }
    ids.forEach(function (id, i) {
      hotelPhotoIndex[id] = shuffled.length ? shuffled[i % shuffled.length] : null;
    });
    return hotelPhotoIndex;
  }


  function fillPhoto(el, destId) {
    if (!el || !destId) return;
    getDestPhoto(destId).then(function (url) { attachImg(el, url); });
  }

  /* hotel cards + hero: a UNIQUE real hotel-room photo per hotel, with the
     destination photo as an instant fallback so a card is never blank. */
  function fillHotelPhoto(el, destId, hotelId) {
    if (!el) return;
    // instant fallback so something real shows immediately
    if (destId) getDestPhoto(destId).then(function (url) { attachImg(el, url); });
    loadRoomPool().then(function (pool) {
      if (!pool || !pool.length) return;         // keep the dest fallback
      var idx = buildIndex(pool);
      var url = idx[hotelId];
      if (!url) {                                 // hotel not in HOTELS list (edge case)
        var h = 0, s = String(hotelId || destId || '');
        for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
        url = pool[h % pool.length];
      }
      attachImg(el, url);                         // upgrade to its unique room photo
    });
  }

  global.Photos = {
    fillPhoto: fillPhoto,
    fillHotelPhoto: fillHotelPhoto,
    getDestPhoto: getDestPhoto,
    enabled: true
  };
})(window);
