/* ==========================================================================
   photos.js — real-photo layer, zero setup required.

   Every card and hero already renders a generated SVG illustration first.
   This module tries to replace it with a real, keyword-relevant photo
   pulled from LoremFlickr — a free, keyless hotlinking service (no signup,
   no API key, no config file edit). If the image ever fails to load for
   any reason, the illustration underneath just stays visible. Nothing else
   on the site depends on this working.

   Each entity (a specific hotel, destination, or package) always gets the
   same photo on every visit, because the URL is "locked" to a number
   derived from its own search query — so a hotel card doesn't show a
   different random photo every time someone reloads the page.
   ========================================================================== */
(function (global) {
  'use strict';

  function lockNumber(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return (h % 5000) + 1; // LoremFlickr reuses the same photo for the same lock value
  }

  function photoUrl(query, w, h) {
    var tags = query
      .toLowerCase()
      .replace(/[^a-z0-9\s,]/g, '')
      .trim()
      .split(/\s+/)
      .slice(0, 4)      // LoremFlickr matches best with a handful of tags, not a whole sentence
      .map(encodeURIComponent)
      .join(',');       // literal commas in the path — LoremFlickr splits tags on these
    return 'https://loremflickr.com/' + w + '/' + h + '/' + tags +
      '?lock=' + lockNumber(query);
  }

  /**
   * fillPhoto(el, query) — el is the .dest-art / .ticket-art / .pkg-art / hero
   * wrapper that already contains the SVG illustration. Fades a real <img>
   * in over it once the photo loads. On any failure, does nothing — the
   * illustration underneath stays exactly as it was.
   */
  function fillPhoto(el, query) {
    if (!el || !query) return;
    var rect = el.getBoundingClientRect();
    var w = Math.max(320, Math.round(rect.width) || 640);
    var h = Math.max(200, Math.round(rect.height) || 400);

    var img = document.createElement('img');
    img.src = photoUrl(query, w, h);
    img.alt = '';
    img.loading = 'lazy';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;' +
      'object-fit:cover;opacity:0;transition:opacity .35s ease;';
    img.onload = function () { img.style.opacity = '1'; };
    img.onerror = function () { img.remove(); }; // illustration underneath is untouched
    el.style.position = el.style.position || 'relative';
    el.appendChild(img);
  }

  global.Photos = { fillPhoto: fillPhoto, enabled: true };
})(window);
