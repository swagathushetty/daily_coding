// ============================================================================
// 📝 STEP 3 — Build useDebouncedValue(value, delayMs) yourself
// ----------------------------------------------------------------------------
// GOAL: a hook that returns a copy of `value` that only updates after the
// value has stopped changing for `delayMs`. The input stays instant; the
// API query lags behind. ~10 lines.
//
// 🤔 DESIGN DECISION to make first: debounce the FUNCTION (lodash-style
//    debounced handler) or debounce the VALUE? In React, debouncing the value
//    wins: no stale closures, no useRef gymnastics, trivially testable.
//    Know the difference — it's a favorite follow-up.
//
// RECIPE (try before reading): useState (the lagged copy) + useEffect keyed
// on [value, delayMs] + setTimeout. THE WHOLE TRICK IS THE CLEANUP — each
// keystroke re-runs the effect, and the cleanup cancels the previous timer,
// so only the final pause survives.
//
// ✅ CHECK: in Autocomplete, console.log(query, debouncedQuery) — while
//    typing fast, query changes every keystroke; debouncedQuery changes once,
//    300ms after you stop.
//
// 🎤 VERBAL FOLLOW-UP to prep: "why debounce, not throttle?" → throttle =
//    at most once per X ms DURING activity (scroll handlers); debounce =
//    once AFTER activity settles (search). You want the settled query.
// ============================================================================

export function useDebouncedValue(value, delayMs = 300) {
  // your code here
  return value
}
