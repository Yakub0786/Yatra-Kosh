/* ==========================================================================
   scene.js — generates flat vintage travel-poster SVGs.
   No external image files: every visual on this site is drawn in the browser.
   Scene.make(type, palette, seed, w, h) -> SVG markup string
   ========================================================================== */
(function (global) {
  'use strict';

  // deterministic pseudo-random so a destination always looks the same
  function rng(seed) {
    var s = 0;
    for (var i = 0; i < String(seed).length; i++) s = (s * 31 + String(seed).charCodeAt(i)) % 233280;
    return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  }

  var PALETTES = {
    dusk:    ['#1B2E4F', '#3A5C9A', '#E8A33D', '#F2C078', '#0F1E38'],
    sea:     ['#0E4E5A', '#1B8391', '#F0B450', '#FCE1A8', '#08313A'],
    sand:    ['#7A3B21', '#C4703A', '#E8A33D', '#F6D9A6', '#4A2213'],
    forest:  ['#123829', '#2C6B4F', '#D9B44A', '#EBD9A0', '#08221A'],
    snow:    ['#233B63', '#5C7FB8', '#EFEFEF', '#F5D08A', '#132342'],
    rose:    ['#5B1E3C', '#A9436B', '#E8A33D', '#F7CBA0', '#360F23']
  };

  function sky(c1, c2, id) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="' + c1 + '"/><stop offset="100%" stop-color="' + c2 + '"/></linearGradient>';
  }

  function sun(x, y, r, c) {
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + c + '" opacity=".95"/>';
  }

  function birds(r, c) {
    var out = '', i, x, y, s;
    for (i = 0; i < 4; i++) {
      x = 60 + r() * 260; y = 34 + r() * 46; s = 4 + r() * 3;
      out += '<path d="M' + x + ' ' + y + ' q' + s + ' -' + s * 0.8 + ' ' + s * 2 + ' 0 q' + s + ' -' + s * 0.8 + ' ' + s * 2 + ' 0" ' +
        'fill="none" stroke="' + c + '" stroke-width="1.4" opacity=".55" stroke-linecap="round"/>';
    }
    return out;
  }

  var SCENES = {
    // layered peaks
    mountain: function (p, r) {
      var g = sky(p[0], p[1], 'sk');
      var s = '<rect width="400" height="300" fill="url(#sk)"/>' + sun(300, 78, 34, p[2]);
      s += birds(r, p[3]);
      s += '<path d="M0 300 L0 190 L70 118 L128 172 L186 96 L262 186 L318 142 L400 214 L400 300Z" fill="' + p[4] + '" opacity=".55"/>';
      s += '<path d="M0 300 L0 224 L86 152 L152 208 L226 140 L300 206 L360 172 L400 206 L400 300Z" fill="' + p[4] + '"/>';
      s += '<path d="M186 96 L166 118 L178 124 L192 114 L204 124 L216 116Z" fill="#F2F6FA" opacity=".9"/>';
      s += '<path d="M226 140 L210 158 L222 162 L234 154 L246 162 L256 154Z" fill="#F2F6FA" opacity=".55"/>';
      return g + s;
    },
    // sea, sand and palms
    beach: function (p, r) {
      var g = sky(p[0], p[1], 'sk');
      var s = '<rect width="400" height="300" fill="url(#sk)"/>' + sun(96, 86, 30, p[2]);
      s += birds(r, p[3]);
      s += '<rect y="176" width="400" height="60" fill="' + p[4] + '" opacity=".75"/>';
      for (var i = 0; i < 5; i++) {
        var y = 190 + i * 10, w = 40 + r() * 70, x = r() * 320;
        s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="2.5" rx="1.2" fill="' + p[3] + '" opacity=".35"/>';
      }
      s += '<path d="M0 236 Q120 224 220 240 T400 232 L400 300 L0 300Z" fill="' + p[2] + '" opacity=".85"/>';
      // palms
      function palm(px, py, sc) {
        var o = '<path d="M' + px + ' ' + py + ' q-4 -' + 44 * sc + ' 6 -' + 66 * sc + '" stroke="' + p[4] + '" stroke-width="' + 5 * sc + '" fill="none" stroke-linecap="round"/>';
        var a = [-160, -125, -55, -20, -90];
        for (var k = 0; k < a.length; k++) {
          var rad = a[k] * Math.PI / 180, ex = px + 6 + Math.cos(rad) * 40 * sc, ey = py - 66 * sc + Math.sin(rad) * 26 * sc;
          o += '<path d="M' + (px + 6) + ' ' + (py - 66 * sc) + ' Q' + ((px + 6 + ex) / 2) + ' ' + (ey - 16 * sc) + ' ' + ex + ' ' + ey + '" stroke="' + p[4] + '" stroke-width="' + 6 * sc + '" fill="none" stroke-linecap="round"/>';
        }
        return o;
      }
      s += palm(52, 272, 1.05) + palm(352, 286, .82);
      return g + s;
    },
    // palace / fort silhouette with domes
    fort: function (p, r) {
      var g = sky(p[0], p[1], 'sk');
      var s = '<rect width="400" height="300" fill="url(#sk)"/>' + sun(320, 70, 30, p[2]);
      s += birds(r, p[3]);
      s += '<rect y="228" width="400" height="72" fill="' + p[4] + '"/>';
      function dome(x, y, w) {
        return '<path d="M' + (x - w) + ' ' + y + ' Q' + x + ' ' + (y - w * 1.5) + ' ' + (x + w) + ' ' + y + 'Z" fill="' + p[4] + '"/>' +
          '<rect x="' + (x - 1.6) + '" y="' + (y - w * 1.5 - 12) + '" width="3.2" height="13" fill="' + p[4] + '"/>' +
          '<circle cx="' + x + '" cy="' + (y - w * 1.5 - 13) + '" r="3.4" fill="' + p[4] + '"/>';
      }
      s += '<rect x="110" y="150" width="180" height="80" fill="' + p[4] + '"/>' + dome(200, 150, 44);
      s += '<rect x="58" y="182" width="58" height="48" fill="' + p[4] + '"/>' + dome(87, 182, 26);
      s += '<rect x="284" y="182" width="58" height="48" fill="' + p[4] + '"/>' + dome(313, 182, 26);
      // arches
      for (var i = 0; i < 5; i++) {
        var ax = 126 + i * 34;
        s += '<path d="M' + ax + ' 228 L' + ax + ' 200 Q' + (ax + 10) + ' 186 ' + (ax + 20) + ' 200 L' + (ax + 20) + ' 228Z" fill="' + p[2] + '" opacity=".9"/>';
      }
      s += '<path d="M74 228 L74 208 Q84 197 94 208 L94 228Z" fill="' + p[2] + '" opacity=".8"/>';
      s += '<path d="M300 228 L300 208 Q310 197 320 208 L320 228Z" fill="' + p[2] + '" opacity=".8"/>';
      return g + s;
    },
    // backwaters with a houseboat
    backwater: function (p, r) {
      var g = sky(p[0], p[1], 'sk');
      var s = '<rect width="400" height="300" fill="url(#sk)"/>' + sun(300, 88, 26, p[2]);
      s += birds(r, p[3]);
      s += '<path d="M0 196 Q70 172 140 190 T280 182 T400 196 L400 300 L0 300Z" fill="' + p[4] + '" opacity=".35"/>';
      s += '<rect y="204" width="400" height="96" fill="' + p[0] + '" opacity=".9"/>';
      for (var i = 0; i < 6; i++) {
        var y = 220 + i * 13, w = 46 + r() * 90, x = r() * 300;
        s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="2.4" rx="1.2" fill="' + p[3] + '" opacity=".28"/>';
      }
      // houseboat
      s += '<path d="M132 226 Q152 208 218 208 Q262 208 276 226Z" fill="' + p[4] + '"/>';
      s += '<path d="M126 226 L282 226 Q276 246 250 246 L158 246 Q132 246 126 226Z" fill="' + p[2] + '"/>';
      s += '<rect x="164" y="214" width="16" height="10" fill="' + p[0] + '" opacity=".7"/>';
      s += '<rect x="196" y="214" width="16" height="10" fill="' + p[0] + '" opacity=".7"/>';
      s += '<rect x="228" y="214" width="16" height="10" fill="' + p[0] + '" opacity=".7"/>';
      // coconut fringe
      for (var k = 0; k < 7; k++) {
        var px = 14 + k * 62, py = 200 + r() * 6;
        s += '<path d="M' + px + ' ' + py + ' q-3 -26 4 -40" stroke="' + p[4] + '" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
          '<circle cx="' + (px + 4) + '" cy="' + (py - 42) + '" r="10" fill="' + p[4] + '" opacity=".85"/>';
      }
      return g + s;
    },
    // rolling hills / tea slopes
    hills: function (p, r) {
      var g = sky(p[0], p[1], 'sk');
      var s = '<rect width="400" height="300" fill="url(#sk)"/>' + sun(84, 74, 28, p[2]);
      s += birds(r, p[3]);
      s += '<path d="M0 300 L0 198 Q100 152 200 190 T400 176 L400 300Z" fill="' + p[4] + '" opacity=".5"/>';
      s += '<path d="M0 300 L0 232 Q110 190 220 226 T400 216 L400 300Z" fill="' + p[4] + '"/>';
      for (var i = 0; i < 9; i++) {
        var x = 12 + i * 44, y = 250 + (i % 3) * 12;
        s += '<path d="M' + x + ' ' + y + ' q-14 -8 -22 4 M' + x + ' ' + y + ' q14 -8 22 4" stroke="' + p[3] + '" stroke-width="1.6" fill="none" opacity=".3"/>';
      }
      s += '<path d="M300 216 l0 -34 M300 182 q-16 -4 -20 -20 M300 190 q16 -6 20 -22" stroke="' + p[3] + '" stroke-width="2.6" fill="none" opacity=".5" stroke-linecap="round"/>';
      return g + s;
    },
    // dunes
    desert: function (p, r) {
      var g = sky(p[0], p[1], 'sk');
      var s = '<rect width="400" height="300" fill="url(#sk)"/>' + sun(210, 96, 40, p[2]);
      s += '<path d="M0 300 L0 214 Q90 178 180 208 T400 190 L400 300Z" fill="' + p[2] + '" opacity=".55"/>';
      s += '<path d="M0 300 L0 246 Q120 208 230 244 T400 234 L400 300Z" fill="' + p[4] + '"/>';
      s += '<path d="M70 246 q10 -20 24 -2 q10 -16 20 4" stroke="' + p[3] + '" stroke-width="2" fill="none" opacity=".35"/>';
      return g + s;
    }
  };

  var Scene = {
    palettes: PALETTES,
    // par: how the artwork is cropped when the box is a different shape.
    //      default centres it; 'xMidYMax slice' keeps the horizon at the bottom,
    //      which is what wide banners want.
    make: function (type, paletteName, seed, par) {
      var p = PALETTES[paletteName] || PALETTES.dusk;
      var r = rng(seed || type);
      var body = (SCENES[type] || SCENES.mountain)(p, r);
      return '<svg viewBox="0 0 400 300" preserveAspectRatio="' + (par || 'xMidYMid slice') + '" ' +
        'xmlns="http://www.w3.org/2000/svg" role="img" ' +
        'aria-label="Illustration of ' + (seed || type) + '">' + body + '</svg>';
    }
  };

  global.Scene = Scene;
})(window);
