/* ==========================================================================
   app.js — shared interface behaviour for every page (v2)
   ========================================================================== */
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const param = k => new URLSearchParams(location.search).get(k) || '';
  const inr = n => '₹' + Number(n).toLocaleString('en-IN');
  const stars = n => '★'.repeat(Math.round(n)) + '☆'.repeat(5 - Math.round(n));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const today = () => new Date().toISOString().slice(0, 10);
  const plus = d => new Date(Date.now() + d * 864e5).toISOString().slice(0, 10);
  const initials = s => s.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  window.App = { $, $$, param, inr, stars, esc, today, plus, initials };

  /* ---------- header / footer ---------- */
  const NAV = [
    ['destinations.html', 'Destinations'],
    ['packages.html', 'Package Tours'],
    ['gallery.html', 'Gallery'],
    ['search.html', 'Search'],
    ['about.html', 'About'],
    ['contact.html', 'Contact']
  ];

  const MARK = '<svg class="brand-mark" viewBox="0 0 32 32" aria-hidden="true">' +
    '<circle cx="16" cy="16" r="15" fill="#E8A33D"/>' +
    '<path d="M4 21 L11 12 L15 17 L20 9 L28 21Z" fill="#0F1E38"/>' +
    '<circle cx="23" cy="9" r="3" fill="#0F1E38"/></svg>';

  function destinationsMega() {
    const byRegion = {};
    REGIONS.forEach(r => byRegion[r] = []);
    DESTINATIONS.forEach(d => (byRegion[d.region] = byRegion[d.region] || []).push(d));
    const cols = REGIONS.filter(r => byRegion[r] && byRegion[r].length).map(r => `
      <div class="mega-col">
        <h4>${r}</h4>
        <ul>${byRegion[r].map(d => `<li><a href="destination.html?id=${d.id}" data-track="mega nav ${esc(d.name)}">${esc(d.name)}</a></li>`).join('')}</ul>
      </div>`).join('');
    return `
    <div class="mega" role="menu" aria-label="Destinations by region">
      <div class="mega-grid">${cols}</div>
      <div class="mega-foot">
        <span class="muted" style="font-size:.85rem">${DESTINATIONS.length} destinations, ${HOTELS.length} stays</span>
        <a class="btn btn-ghost btn-sm" href="destinations.html" data-track="mega nav see all">See all destinations</a>
      </div>
    </div>`;
  }

  function header() {
    const here = (location.pathname.split('/').pop() || 'index.html');
    const links = NAV.map(([h, t]) => {
      const active = h === here ? ' is-active' : '';
      if (h === 'destinations.html') {
        return `<li class="has-mega"><a href="${h}" class="${active}">${t}</a>${destinationsMega()}</li>`;
      }
      return `<li><a href="${h}" class="${active}">${t}</a></li>`;
    }).join('');
    const user = currentUser();
    const accountLink = user
      ? `<li><a href="profile.html" data-track="header profile" style="margin-left:6px">${esc(user.split('@')[0])}</a></li>`
      : `<li><a href="login.html" data-track="header sign in" style="margin-left:6px">Sign in</a></li>`;
    return `
<a class="skip-link" href="#main">Skip to content</a>
<div class="topbar">
  <div class="wrap">
    <div class="topbar-links">
      <span>+91 22 4000 1200</span>
      <span>hello@yatrakosh.in</span>
    </div>
    <div class="topbar-links">
      <a href="assets/downloads/yatra-kosh-travel-guide.pdf" download data-track="topbar brochure">Travel guide (PDF)</a>
      <a href="faq.html" data-track="topbar faq">Help</a>
    </div>
  </div>
</div>
<header class="site-header">
  <div class="wrap nav">
    <a class="brand" href="index.html" data-track="logo">${MARK}
      <span>Yatra Kosh<small>India · trips &amp; stays</small></span></a>
    <button class="nav-toggle" aria-expanded="false" aria-controls="navlinks" data-track="menu toggle">☰</button>
    <ul class="nav-links" id="navlinks">${links}
      <li><a href="plan-trip.html" class="nav-cta" data-track="header plan a trip">Plan my trip</a></li>
      ${accountLink}
    </ul>
  </div>
</header>`;
  }

  function footer() {
    return `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div>
        <a class="brand" href="index.html" style="margin-bottom:14px">${MARK}<span>Yatra Kosh</span></a>
        <p style="max-width:34ch">A student-built travel agency site — hotels and fixed-departure package tours across India. Properties are fictional; no payment is ever taken.</p>
      </div>
      <div><h4>Explore</h4><ul>
        <li><a href="destinations.html">Destinations</a></li>
        <li><a href="packages.html">Package tours</a></li>
        <li><a href="gallery.html">Gallery</a></li>
        <li><a href="search.html">Search stays</a></li></ul></div>
      <div><h4>Company</h4><ul>
        <li><a href="about.html">About us</a></li>
        <li><a href="plan-trip.html">Plan a custom trip</a></li>
        <li><a href="faq.html">FAQ</a></li>
        <li><a href="feedback.html">Leave feedback</a></li></ul></div>
      <div><h4>Account</h4><ul>
        <li><a href="login.html">Sign in</a></li>
        <li><a href="register.html">Create account</a></li>
        <li><a href="contact.html">Contact</a></li>
        <li><a href="analytics.html">Analytics console</a></li></ul></div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Yatra Kosh · B.Sc. Data Science mini project</span>
      <span>Behavioural data collected with consent</span>
    </div>
  </div>
</footer>`;
  }

  function mountChrome() {
    const h = $('#site-header'), f = $('#site-footer');
    if (h) h.innerHTML = header();
    if (f) f.innerHTML = footer();
    const btn = $('.nav-toggle'), list = $('.nav-links');
    if (btn && list) btn.addEventListener('click', () => {
      const open = list.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
    });
  }

  /* ---------- card renderers ---------- */
  function destCard(d) {
    return `
<a class="dest reveal" href="destination.html?id=${d.id}" data-hover="destination ${d.name}" data-track="destination card ${d.name}" data-cat="destination">
  <div class="dest-art" data-photo-q="${esc(d.name)} India travel">${Scene.make(d.scene, d.palette, d.id)}</div>
  <div class="dest-body">
    <h3>${esc(d.name)}</h3>
    <p class="dest-meta">${esc(d.state).toUpperCase()} · ${d.nights} NIGHTS SUGGESTED</p>
    <p style="margin:10px 0 0;font-size:.92rem;color:var(--muted)">${esc(d.tagline)}</p>
    <div class="dest-foot">
      <span class="muted">${d.hotelCount} stays</span>
      <span class="dest-price">from <b>${inr(d.fromPrice)}</b></span>
    </div>
  </div>
</a>`;
  }

  function hotelTicket(h) {
    const am = h.amenities.slice(0, 4).map(a => `<li>${esc(AMENITY_LABELS[a] || a)}</li>`).join('');
    const hotelQ = `${h.destName} India ${h.amenities.includes('beachfront') ? 'beach resort' : h.amenities.includes('houseboat') ? 'houseboat' : h.amenities.includes('camping') ? 'desert camp' : h.amenities.includes('heritage') ? 'heritage hotel' : 'hotel'}`;
    return `
<article class="ticket reveal" data-hover="hotel ${h.name}">
  <div class="ticket-art" data-photo-q="${esc(hotelQ)}">${Scene.make(h.scene, h.palette, h.id)}</div>
  <div class="ticket-main">
    <p class="ticket-loc">${esc(h.area)} · ${esc(h.destName)}</p>
    <h3>${esc(h.name)}</h3>
    <p style="margin:0;font-size:.9rem;color:var(--muted)">${esc(h.blurb)}</p>
    <ul class="ticket-amen">${am}</ul>
  </div>
  <div class="ticket-stub">
    <span class="stars" aria-label="${h.stars} star property">${stars(h.stars)}</span>
    <span class="rating-pill">${h.rating.toFixed(1)} <span style="opacity:.6">${h.reviews}</span></span>
    <span class="ticket-price">${inr(h.price)}<small>per night</small></span>
    <a class="btn btn-primary btn-sm" href="hotel.html?id=${h.id}" data-track="view hotel ${h.name}" data-cat="hotel">View stay</a>
  </div>
</article>`;
  }

  function packageCard(p) {
    return `
<a class="pkg reveal" href="package.html?id=${p.id}" data-hover="package ${p.name}" data-track="package card ${p.name}" data-cat="package">
  <div class="pkg-art" data-photo-q="${esc(p.destNames[0] || 'India')} India ${esc((p.theme||'').toLowerCase())} travel">
    ${Scene.make(p.scene, p.palette, p.id)}
    <span class="badge pkg-badge">${esc(p.theme)}</span>
    <span class="pkg-nights">${p.nights} nights</span>
  </div>
  <div class="pkg-body">
    <p class="pkg-route">${p.destNames.map(esc).join(' → ')}</p>
    <h3>${esc(p.name)}</h3>
    <p style="margin:0;font-size:.9rem;color:var(--muted)">${esc(p.tagline)}</p>
    <div class="pkg-foot">
      <span class="muted" style="font-size:.82rem">Group ${esc(p.groupSize)}</span>
      <span class="pkg-price"><b>${inr(p.price)}</b><small>per person</small></span>
    </div>
  </div>
</a>`;
  }

  function testimonialCard(t) {
    return `
<div class="quote-card reveal">
  <span class="stars">${stars(t.rating)}</span>
  <p>&ldquo;${esc(t.quote)}&rdquo;</p>
  <div class="quote-by">
    <span class="quote-avatar">${initials(t.name)}</span>
    <div><b>${esc(t.name)}</b><span>${esc(t.trip)}</span></div>
  </div>
</div>`;
  }

  function advisorCard(a) {
    return `
<div class="advisor reveal">
  <div class="advisor-art">${Scene.make(a.scene, a.palette, a.name)}</div>
  <div class="advisor-body">
    <h3>${esc(a.name)}</h3>
    <p class="advisor-role">${esc(a.role)}</p>
    <p>${esc(a.bio)}</p>
  </div>
</div>`;
  }

  window.App.destCard = destCard;
  window.App.hotelTicket = hotelTicket;
  window.App.packageCard = packageCard;
  window.App.testimonialCard = testimonialCard;
  window.App.advisorCard = advisorCard;

  /* ---------- unified search across hotels, destinations, packages ---------- */
  function runSearch(q) {
    const t = q.trim().toLowerCase();
    if (!t) return { hotels: [], dests: [], packages: [], q: '' };
    const dests = DESTINATIONS.filter(d =>
      (d.name + ' ' + d.state + ' ' + d.tags.join(' ') + ' ' + d.tagline).toLowerCase().includes(t));
    const hotels = HOTELS.filter(h =>
      (h.name + ' ' + h.area + ' ' + h.destName + ' ' + h.state + ' ' + h.blurb + ' ' +
        h.amenities.map(a => AMENITY_LABELS[a] || a).join(' ')).toLowerCase().includes(t));
    const packages = PACKAGES.filter(p =>
      (p.name + ' ' + p.theme + ' ' + p.tagline + ' ' + p.destNames.join(' ')).toLowerCase().includes(t));
    return { hotels, dests, packages, q: t };
  }
  window.App.runSearch = runSearch;

  function suggestFor(q) {
    const t = q.trim().toLowerCase();
    if (NOT_STOCKED.includes(t)) return `We do not list ${esc(q.trim())} yet. The nearest thing we have is below.`;
    return '';
  }
  window.App.suggestFor = suggestFor;

  /* ---------- form validation ---------- */
  function validate(form) {
    let ok = true, firstBad = null;
    $$('[data-rule]', form).forEach(inp => {
      const field = inp.closest('.field');
      const rule = inp.getAttribute('data-rule');
      const v = inp.value.trim();
      let msg = '';
      if (rule.includes('required') && !v) msg = 'This field is required.';
      else if (rule.includes('email') && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = 'Enter an email address like you@example.com.';
      else if (rule.includes('phone') && v && !/^[0-9]{10}$/.test(v.replace(/\D/g, '').slice(-10))) msg = 'Enter a 10-digit phone number.';
      else if (rule.includes('pw') && v && v.length < 6) msg = 'Use at least 6 characters.';
      else if (rule.includes('future') && v && v < today()) msg = 'Pick a date from today onwards.';

      if (msg) {
        ok = false;
        if (field) { field.classList.add('has-error'); const e = $('.field-error', field); if (e) e.textContent = msg; }
        if (!firstBad) firstBad = inp;
        form.dispatchEvent(new CustomEvent('yk:formerror', { detail: { field: inp.name || inp.id } }));
      } else if (field) field.classList.remove('has-error');
    });
    if (firstBad) firstBad.focus();
    return ok;
  }
  window.App.validate = validate;

  /* ---------- FAQ accordion ---------- */
  function faqInit(root) {
    $$('.faq-q', root).forEach(q => q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const open = item.classList.toggle('open');
      q.setAttribute('aria-expanded', String(open));
      if (window.YK) YK.track('faq_toggle', { category: 'engagement', label: q.textContent.trim().slice(0, 60), value: open ? 'open' : 'close' });
    }));
  }
  window.App.faqInit = faqInit;

  /* ---------- reviews: seeded + user-submitted (localStorage) ---------- */
  function userReviews(entityId){
    try { return JSON.parse(localStorage.getItem('yk_reviews_'+entityId) || '[]'); }
    catch(e){ return []; }
  }
  function addUserReview(entityId, review){
    const list = userReviews(entityId);
    list.unshift(review);
    try { localStorage.setItem('yk_reviews_'+entityId, JSON.stringify(list)); } catch(e){}
  }
  function daysAgoLabel(n){
    if (n <= 1) return 'Yesterday';
    if (n < 30) return n + ' days ago';
    const m = Math.round(n/30);
    return m + (m===1 ? ' month ago' : ' months ago');
  }
  function reviewsBlock(entityId, seedCount){
    const seeded = seededReviews(entityId, seedCount).map(r => ({
      name: r.name, rating: r.rating, text: r.text, dateLabel: daysAgoLabel(r.daysAgo)
    }));
    const own = userReviews(entityId).map(r => ({
      name: r.name + ' (you)', rating: r.rating, text: r.text, dateLabel: 'Just now'
    }));
    const all = own.concat(seeded);
    const avg = (all.reduce((s,r)=>s+r.rating,0) / all.length).toFixed(1);
    const list = all.map(r => `
      <div class="review">
        <div class="review-head">
          <span class="review-name">${esc(r.name)}</span>
          <span class="stars">${stars(r.rating)}</span>
        </div>
        <span class="review-date">${esc(r.dateLabel)}</span>
        <p>${esc(r.text)}</p>
      </div>`).join('');
    return { html: list, avg, count: all.length };
  }
  function reviewFormHtml(){
    return `
    <form class="panel panel-tight review-form" data-form="review" novalidate style="margin-top:18px">
      <span class="eyebrow">Write a review</span>
      <div class="form-grid">
        <div class="field"><label for="rv-name">Your name</label>
          <input type="text" id="rv-name" name="name" data-rule="required"><p class="field-error"></p></div>
        <div class="field"><label for="rv-rating">Rating</label>
          <select id="rv-rating"><option value="5">5 — Excellent</option><option value="4">4 — Good</option>
            <option value="3">3 — Okay</option><option value="2">2 — Poor</option><option value="1">1 — Bad</option></select></div>
      </div>
      <div class="field"><label for="rv-text">Your review</label>
        <textarea id="rv-text" name="text" data-rule="required" placeholder="What stood out, good or bad?"></textarea>
        <p class="field-error"></p></div>
      <button class="btn btn-ink btn-sm" type="submit" data-track="submit review">Post review</button>
      <div id="rv-done"></div>
    </form>`;
  }
  function wireReviewForm(entityId, onPosted){
    const form = $('#rv-form-anchor')?.querySelector('form') || document.querySelector('form[data-form="review"]');
    if (!form) return;
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!validate(form)) return;
      const review = { name: $('#rv-name').value.trim(), rating: parseInt($('#rv-rating').value,10),
        text: $('#rv-text').value.trim() };
      addUserReview(entityId, review);
      if (window.YK) YK.track('review_submit', { category:'reviews', label: entityId, value: review.rating });
      $('#rv-done').innerHTML = '<div class="notice notice-ok" style="margin-top:12px">Thanks — your review is live below.</div>';
      form.reset();
      if (onPosted) onPosted();
    });
  }
  window.App.reviewsBlock = reviewsBlock;
  window.App.reviewFormHtml = reviewFormHtml;
  window.App.wireReviewForm = wireReviewForm;

  /* ---------- coupons ---------- */
  function applyCoupon(code, subtotal, kind){
    const c = COUPONS[code.trim().toUpperCase()];
    if (!c) return { ok:false, message:'That code is not valid.' };
    if (c.appliesTo !== 'all' && c.appliesTo !== kind) {
      return { ok:false, message:'That code does not apply to this booking type.' };
    }
    const discount = c.type === 'percent' ? Math.round(subtotal * c.value / 100) : c.value;
    return { ok:true, message:`${code.toUpperCase()} applied — ${c.label}.`, discount, code: code.toUpperCase() };
  }
  window.App.applyCoupon = applyCoupon;

  /* ---------- location personalisation strip ---------- */
  function geoStrip(el){
    let geo = null;
    try { geo = JSON.parse(localStorage.getItem('yk_geo') || 'null'); } catch(e){}
    if (geo && geo.city && el) {
      el.textContent = `\u{1F4CD} Browsing from ${geo.city}${geo.country && geo.country!=='India' ? ', ' + geo.country : ''}`;
      el.classList.add('show');
    }
  }
  window.App.geoStrip = geoStrip;

  /* ---------- signed-in state for nav + profile ---------- */
  function currentUser(){
    try { return localStorage.getItem('yk_signedin') || null; } catch(e){ return null; }
  }
  window.App.currentUser = currentUser;

  /* ---------- real photos (progressive enhancement over the illustrations) ---------- */
  function fillPhotos(root) {
    if (!window.Photos || !Photos.enabled) return;
    $$('[data-photo-q]', root || document).forEach(el => {
      if (el.dataset.photoFilled) return;
      el.dataset.photoFilled = '1';
      Photos.fillPhoto(el, el.dataset.photoQ);
    });
  }
  window.App.fillPhotos = fillPhotos;

  /* ---------- scroll reveal ---------- */
  function reveals() {
    fillPhotos();
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('in')); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -40px 0px' });
    items.forEach(i => io.observe(i));
  }
  window.App.reveals = reveals;

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    mountChrome();
    if (typeof window.pageInit === 'function') window.pageInit();
    reveals();
  });
})();
