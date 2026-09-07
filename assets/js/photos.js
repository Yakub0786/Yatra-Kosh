/* ==========================================================================
   photos.js — real-photo layer, zero setup required.

   Every card and hero already renders a generated SVG illustration first.
   This module tries to replace it with a real photo from Picsum
   (picsum.photos) — a keyless hotlinking CDN backed by real Unsplash
   photographers, chosen specifically for reliability: no signup, no API
   key, no rate limit that a small class project could hit, and none of
   the uptime problems smaller "placeholder" services are prone to.

   Picsum doesn't do keyword search — it can't fetch "a photo of Goa" —
   so instead each entity gets a photo that's consistent across visits
   (same hotel always shows the same picture) via a seeded URL, rather
   than a literally matching one. If a photo ever fails to load for any
   reason, the illustration underneath is untouched — nothing else on the
   site depends on this working.
   ========================================================================== */
(function (global) {
  'use strict';

  function photoUrl(seed, w, h) {
    var clean = String(seed).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return 'https://picsum.photos/seed/' + encodeURIComponent(clean) + '/' + w + '/' + h;
  }

  /**
   * fillPhoto(el, query) — el is the .dest-art / .ticket-art / .pkg-art /
   * hero wrapper that already contains the SVG illustration. Fades a real
   * <img> in over it once the photo loads. On any failure, does nothing —
   * the illustration underneath stays exactly as it was.
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
