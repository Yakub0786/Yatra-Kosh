# Testing round checklist

Run this before each round of user testing. A tracking bug found on testing
day costs you the whole round.

## Before Round 1

- [ ] `endpoint` set in `assets/js/config.js` and a test row appears in the Sheet
- [ ] Site is live on a public URL (GitHub Pages), not localhost
- [ ] Opened the site on an actual phone — nav collapses, booking form usable
- [ ] Consent banner appears on a fresh browser profile
- [ ] Declining consent produces zero rows
- [ ] Walked the full funnel once and confirmed all of these appear in the Sheet:
      `session_start` `page_view` `search` `search_no_result` `destination_view`
      `hotel_view` `booking_start` `form_start` `form_error` `form_submit`
      `booking_complete` `confirmation_view` `page_exit` `scroll_depth`
      `hover` `download` `filter` `feedback_submit`
- [ ] Downloaded the Sheet as CSV and opened it in R/pandas without errors

## Recruiting

Target 40–60 sessions. Split testers into two groups and record which group
each person was in — you will need the column later.

- **Group A — task**: "You are planning a 3-day trip to Goa for two people
  under Rs 8,000. Find a hotel and book it."
- **Group B — free browse**: "Spend five minutes on this site however you like."

Group A gives you enough conversions to analyse. Group B gives you natural
navigation paths. Comparing the two is a stronger findings chapter than one
undifferentiated dataset.

Deliberately recruit across both mobile and desktop — roughly half each, or
your device comparison has nothing to compare.

## After Round 1

- [ ] Exported and backed up the CSV as `round1.csv` (do not overwrite it)
- [ ] Added a `round` column with value 1
- [ ] Cleared the Sheet before Round 2, or filter by date later

## Between rounds

Pick three fixes from your findings. Suggested candidates, in order of how
easily they show up in the numbers:

1. Price and rating filters on the destination page (moves bounce rate)
2. Suggested alternatives on a zero-result search (moves search success rate)
3. Fewer fields or a progress hint on the booking form (moves form completion
   rate and time-to-complete)

## Before Round 2

- [ ] Changes are live
- [ ] Same recruitment split, similar device mix
- [ ] `round` column set to 2

## Analysis

Stack both CSVs into one dataframe and compare by `round`:

| Metric | How to compute |
|---|---|
| Bounce rate | sessions with 1 `page_view` ÷ all sessions |
| Conversion rate | sessions with `booking_complete` ÷ all sessions |
| Search success rate | 1 − (`search_no_result` ÷ `search`) |
| Form completion rate | `form_submit` ÷ `form_start` |
| Time to complete | mean `event_value` of `form_submit` |
| Scroll completion | sessions reaching `scroll_depth` 100 ÷ all sessions |

Statistical tests that work on this data:

- **Chi-square** — device type vs. whether the session converted
- **t-test** — mobile vs. desktop mean `time_on_page` on hotel pages
- **Correlation** — max `scroll_depth` vs. reaching `booking_start`
- **Paired comparison** — Round 1 vs. Round 2 on any rate above
