/**
 * Yatra Kosh — event collector
 * Turns a Google Sheet into the database for the behavioural tracker.
 *
 * SETUP
 *  1. Create a Google Sheet. Name the first tab: events
 *  2. Extensions → Apps Script. Delete anything there, paste this file, save.
 *  3. Deploy → New deployment → type "Web app"
 *       Execute as:        Me
 *       Who has access:    Anyone
 *  4. Copy the /exec URL it gives you.
 *  5. Paste that URL into assets/js/config.js as `endpoint`.
 *  6. Open the site, click around, then check the sheet.
 *
 * To get your dataset: File → Download → Comma-separated values (.csv)
 */

var COLS = ['event_id','user_id','session_id','timestamp','date','time','hour','weekday',
  'event_type','event_category','event_label','event_value',
  'page','page_title','click_x','click_y','scroll_depth','search_query','search_results',
  'time_on_page','session_time','pages_in_session','is_new_user','visitor_type','visit_number',
  'entry_page','referrer','device','browser','os','screen_resolution','viewport',
  'language','country','region','city'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName('events') || ss.insertSheet('events');
  if (sh.getLastRow() === 0) {
    sh.appendRow(COLS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var payload = JSON.parse(e.postData.contents);
    var events = payload.events || [];
    if (!events.length) return out_({ ok: true, written: 0 });

    var sh = sheet_();
    var rows = events.map(function (ev) {
      return COLS.map(function (c) {
        return ev[c] === undefined || ev[c] === null ? '' : ev[c];
      });
    });
    sh.getRange(sh.getLastRow() + 1, 1, rows.length, COLS.length).setValues(rows);
    return out_({ ok: true, written: rows.length });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* lets you open the /exec URL in a browser to check it is alive */
function doGet() {
  return out_({ ok: true, rows: Math.max(0, sheet_().getLastRow() - 1) });
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
