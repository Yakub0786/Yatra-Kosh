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

## v2.1 additions

Added on top of the travel-agency rebuild, per a features checklist:

- **Coupon codes** — `WELCOME10` (10% off, all bookings), `FIRST500` (₹500 off, all),
  `TRIP15` (15% off packages only), `STAY300` (₹300 off hotels only). Live on
  `booking.html` (real discount applied to total) and `package.html` (estimate
  shown, mentioned in the enquiry). Fires a `coupon_applied` event.
- **Reviews** — every hotel and package page shows guest reviews (deterministically
  seeded per entity, so the same property always shows the same reviews) plus a
  working "write a review" form. User-submitted reviews are stored in
  `localStorage` and merge with the seeded ones. Fires `review_submit`.
- **User profile** (`profile.html`) — shows the signed-in user, a stats strip
  (bookings, enquiries, nights, total value), full booking history, and full
  enquiry history, all read from `localStorage`. Prompts sign-in/register if
  the visitor isn't signed in. Nav now shows the signed-in name instead of
  "Sign in" once logged in — this also fixed a real bug where `register.html`
  displayed "You are signed in" but never actually persisted that state.
- **"Thank you, {name}!"** — the confirmation page now greets the guest by
  first name at the top of the boarding pass.
- **Location personalisation** — the homepage shows "📍 Browsing from {city}"
  using the same IP geolocation the tracker already captures.
- **Highlighted table headers** — `analytics.html` table headers are now dark
  with a marigold underline instead of a subtle grey, for readability when
  presenting the dashboard.
- **New vs. returning visitors** and **TTFV (time to first value)** — two new
  tables on `analytics.html`. TTFV is defined as seconds from `session_start`
  to the first `destination_view`, `hotel_view`, or `package_view` — i.e. the
  first moment a visitor looks at something specific rather than just browsing
  a listing page. State this definition in your report if you use the metric,
  since "value" is not a standardised term and graders may ask what you meant.
