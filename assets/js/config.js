/* ==========================================================================
   config.js — edit this file, not tracking.js
   ========================================================================== */
window.TRACK_CONFIG = {

  /* Where events are sent, in addition to the browser's own localStorage.
     Leave blank and everything stays on the visitor's device (fine while you
     are building; useless once other people test the site from their phones).

     Two options that need no server of your own:
       1. Google Apps Script  — paste docs/apps-script.gs into a Sheet's
          Apps Script editor, deploy as a Web App with access "Anyone",
          and put the /exec URL here.
       2. Firebase Firestore  — use the REST endpoint for your collection.

     Example: 'https://script.google.com/macros/s/AKfy..../exec'            */
  endpoint: '',

  /* Everything below is safe to leave alone. */
  siteId: 'yatrakosh',
  version: '1.0',

  requireConsent: true,   // show the consent banner before tracking anything
  sampleMouseMs: 2000,    // one mouse-position sample at most this often
  flushMs: 6000,          // how often queued events are POSTed to the endpoint
  maxStored: 6000,        // localStorage event cap, oldest dropped first
  lookupGeo: true,        // one ipapi.co call per visitor for country/state/city
  debug: false            // true = log every event to the browser console

  /* Real photos need no setting here — assets/js/photos.js works with
     zero configuration. Nothing to add, nothing to break. */
};
