# Yatra Kosh v2 — travel agency site

Built for the **Behavioural Data Analytics and UX** mini project. v2 rebuild:
16 destinations (up from 10), 6 fixed-departure package tours, an enquiry flow,
testimonials, advisors, and a mega-navigation menu — a genuine travel-agency
feel rather than a hotel-only booking site, plus a UI/UX pass throughout.

---

## Run it

**Do not open `index.html` by double-clicking it.** Some browsers block
`fetch` and storage on `file://` paths. Serve the folder instead:

```bash
cd yatra-kosh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Files

```
index.html            Home — hero, mega-nav, stat strip, packages, testimonials, advisors
destinations.html     16 destinations, region tabs + interest/length filters
destination.html      One destination + its stays + any package that covers it   ?id=goa
packages.html         6 package tours, theme filter                              
package.html          Day-by-day itinerary, inclusions/exclusions, sticky price   ?id=...
plan-trip.html         Custom-trip enquiry form (the second conversion funnel)
hotel.html             One property + price calculator                          ?id=goa-01
search.html            Unified search — hotels, destinations AND packages
booking.html            Hotel booking form
confirmation.html       Boarding-pass style confirmation
gallery.html             Generated posters — destinations or packages
login.html / register.html
contact.html / feedback.html / faq.html
about.html               Consent, two-track positioning, UX principles
analytics.html           Internal console — TWO funnels (booking + enquiry), export

assets/css/style.css     Design system + v2 components (mega-menu, package card,
                          itinerary timeline, testimonials, advisor cards, trust bar)
assets/js/config.js      >>> the only file you normally need to edit
assets/js/data.js        16 destinations, 67 hotels, 6 packages, testimonials, advisors
assets/js/scene.js       Generates every illustration as SVG (unchanged from v1)
assets/js/app.js         Nav (incl. mega-menu), all card renderers, unified search
assets/js/tracking.js    Tracking layer (unchanged — the generic event system
                          already covers every new page automatically)
docs/apps-script.gs      Google Sheets collector (unchanged)
```

There are no image files. Every visual is drawn in the browser.

---

## What changed from v1

- **10 → 16 destinations.** Added Munnar, Coorg, Pondicherry, Nainital,
  Darjeeling, Gangtok. `NOT_STOCKED` (the deliberate zero-result list) was
  updated so none of the new destinations collide with it.
- **New: package tours.** Six fixed-departure, multi-destination itineraries
  with day-by-day stops, named inclusions/exclusions, group size, and
  departure dates. This is the actual "travel agency" signal — a hotel-only
  site is an OTA, not an agency.
- **New: the enquiry funnel.** `plan-trip.html` is a second conversion path
  alongside hotel booking — the realistic one for a package tour, since nobody
  self-checkouts an 8-night private-car itinerary. Tracked in parallel to the
  booking funnel (`package_view → enquiry_start → enquiry_submit`).
  Both funnels are shown separately on `analytics.html`.
  Both funnels appear separately on `analytics.html`.
- **New: testimonials and advisors.** Both explicitly listed as optional
  content in the course brief; used here to make the site feel staffed rather
  than automated.
- **New: mega-navigation.** Destinations grouped by region (North / South /
  West / East / Northeast) in a hover menu — necessary once the catalogue
  doubled in size.
- **UI/UX pass:** utility top bar, a stat strip, a four-step "how it works"
  section, region tabs on the destinations page, theme pills on packages, a
  sticky sub-price panel with live totals on both hotel and package pages.

---

## Collecting data from other people

Same as v1 — events default to each visitor's own browser. Before Round 1,
set up `docs/apps-script.gs` as a Google Sheets sink and paste the `/exec`
URL into `assets/js/config.js` → `endpoint`. Verify a test row lands before
recruiting anyone.

## The two funnels

```
Hotel booking:   page_view → destination_view → hotel_view → booking_start → booking_complete
Package enquiry: page_view → package_view → enquiry_start → enquiry_submit
```

Both are visible as separate tables on `analytics.html`, and both export in
the same 36-column CSV (`event_type` distinguishes them).

## Console helpers

```js
YK.summary()    // counts by event type
YK.download()   // save this device's events as CSV
YK.events()     // the raw array
YK.reset()      // wipe local events
```

## Search failure is engineered on purpose

`NOT_STOCKED` in `data.js` lists ten popular places the catalogue deliberately
does not carry (Shimla, Mussoorie, Ooty, Kodaikanal, Auli, Dalhousie,
Lonavala, Mount Abu, Wayanad, Spiti). Search for them and get nothing — this
keeps the search-failure rate realistic. Say so in your methodology chapter.

## Where this maps to the marking scheme

Unchanged from v1 — see the marks table in the original brief. The package
tours and enquiry flow strengthen **Website Design & Development (20)** and
**Search Analytics & User Behaviour Analysis (10)** in particular, since you
now have two distinct conversion funnels to compare rather than one.

---

## v2.2 — real photos (zero setup)

Every destination card, all 67 hotel cards, all 6 package cards, and every
hero banner show a real photo instead of the generated illustration —
with no signup, no API key, and no config file edit. It just works the
moment the site is deployed.

### How it works

`assets/js/photos.js` requests a photo from **Picsum** (picsum.photos), a
keyless hotlinking CDN backed by real Unsplash photographers, chosen for
reliability over keyword relevance — it can't fetch "a photo of Goa"
specifically, but it very rarely goes down. Each entity gets a consistent
photo across visits (the URL is seeded from its own name), so a hotel
card doesn't reshuffle to a different photo on reload. If a photo ever
fails to load, the illustration underneath is untouched — nothing else on
the site depends on this working.

### If photos don't appear after deploying

Check whether the *service itself* is reachable from your network before
assuming the code is broken — open this directly in a browser tab:
```
https://picsum.photos/seed/test/400/300
```
If a photo loads there, the site's code is fine and it's worth a hard
refresh (`Cmd+Shift+R`) — browsers sometimes cache the previous "no
image" state. If that direct link also doesn't load, the block is on
your network's end (a content blocker, browser extension, or school/office
firewall blocking hotlinked images) — try a different network or browser
to confirm, then note in your report that the illustrations serve as the
tested fallback in that case, which is the intended behaviour.

### Turning it off (if you ever want to)

There's nothing to turn on, so there's also no key to remove. To go back
to illustrations only, delete this one line from every HTML file:
```html
<script src="assets/js/photos.js"></script>
```
or simply delete `assets/js/photos.js` itself — every page falls back to
the illustration immediately, no other changes needed.

### One thing worth knowing

LoremFlickr sources real Flickr photos matching the tags, not photos
specifically of Goa or your hotel — it's real, relevant-*ish* photography
rather than verified on-location shots. Say so in your report if you
present this: "real, keyword-matched stock photography" is accurate,
"photos of our actual properties" would not be, since these are fictional
hotels.

### What still doesn't use photos

`gallery.html` is deliberately left as pure generated art — it's the
page that explicitly showcases the illustration system, so real photos
there would undercut the point of the page.
