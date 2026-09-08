# Yatra Kosh — travel & stays across India

A travel-agency website: fixed-departure package tours and hand-picked
hotels across 20 Indian destinations, with a booking flow, a trip-enquiry
flow, user accounts, reviews, coupons, and a live analytics layer.

## Run it locally

Serve the folder (don't open index.html directly — some browsers block
storage on file:// paths):

```bash
cd yatra-kosh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)

Push the whole folder to a repo, then Settings → Pages → Deploy from
branch → main → / (root). No build step.

## Structure

```
index.html            Home
destinations.html     20 destinations, region tabs + filters
destination.html      One destination + its stays + related packages
packages.html         6 fixed-departure package tours
package.html          Day-by-day itinerary, inclusions, coupon, reviews
plan-trip.html        Custom-trip enquiry form
hotel.html            One property + price calculator + reviews
search.html           Unified search across hotels, destinations, packages
booking.html          Hotel booking (dates, guests, coupon, payment method)
confirmation.html     Boarding-pass style confirmation
gallery.html          Photo gallery — destinations, hotels, packages
profile.html          Signed-in user's bookings + enquiries
login.html / register.html
contact.html / feedback.html / faq.html / about.html
terms.html / privacy.html
404.html              Custom not-found page
analytics.html        Internal analytics console

assets/css/style.css  Design system
assets/js/config.js   Config (analytics endpoint, etc.)
assets/js/data.js     20 destinations, 83 hotels, 6 packages, reviews, coupons
assets/js/scene.js    Generated SVG illustrations (photo fallback)
assets/js/photos.js   Real photos from Wikipedia, per destination/neighbourhood
assets/js/app.js      Nav, cards, search, forms, reviews, coupons
assets/js/tracking.js Behavioural analytics layer
```

## Photos

Real photos come from Wikipedia's public API — destination cards use the
destination's own article, hotel cards search for the hotel's actual
neighbourhood (e.g. "Anjuna, Goa") and fall back to the destination photo
where a neighbourhood has no article. If a photo can't load, the
generated illustration underneath stays visible, so no card is ever blank.

## Analytics

`analytics.html` is an internal dashboard showing KPIs, two conversion
funnels (hotel booking + package enquiry), new-vs-returning split, and
time-to-first-value, all exportable as CSV/JSON. Events are collected
with consent (banner on first visit) and never include names, emails, or
payment details.

---

## v2.5 — CORS-safe photos, 7 new destinations, analytics dataset

- **Photos now actually load on GitHub Pages.** Earlier versions used
  Wikipedia's REST endpoint, which does not send CORS headers to a static
  host — so photos silently failed. This version uses the MediaWiki Action
  API (`/w/api.php?...&origin=*`), which Wikipedia explicitly supports for
  anonymous cross-origin browser requests. That is the change that makes
  real photos appear on the deployed site.
- **7 new destinations** added to the live catalogue: Sinhagad Fort,
  Raigad Fort, Diveagar Beach, Aamby Valley, Lonavala (all Maharashtra),
  Golden Temple (Punjab), and Ooty (Tamil Nadu) — each with 3–5 hotels.
  The catalogue is now 27 destinations / 110 stays.
- **Homepage stats auto-count.** The hero numbers (destinations, stays)
  are now computed from the data at load time, so they never go stale as
  the catalogue grows.
- **Synthetic analytics dataset** (`yatra-kosh-analytics-data.xlsx`, a
  separate file) for Tableau: four related sheets — Bookings (603),
  Website_Analytics (9,000 sessions), Clickstream (54,691 events), and a
  Destinations dimension table (27). All sheets share session_id /
  destination_id keys for joins, and every destination including the 7
  new ones appears. This is simulated data for building the analysis, not
  real user behaviour.
