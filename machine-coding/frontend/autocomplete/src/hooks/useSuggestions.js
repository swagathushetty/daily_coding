// ============================================================================
// 📝 STEP 8 — Refactor: pull ALL data logic out of the view
// ----------------------------------------------------------------------------
// By now Autocomplete.jsx mixes rendering/keyboard handling with fetching,
// status, races, abort (and soon cache). In the round, doing this extraction
// ~20 minutes in — OUT LOUD — is a big rubric win ("separation of concerns").
//
// GOAL: move the fetch effect + status state (+ cache, once STEP 9a is done)
// into:
//
//   useSuggestions(debouncedQuery, fetchSuggestions, minChars)
//     → { status, data, error, retry }
//
// The view keeps ONLY view concerns: input text, open/closed, activeIndex.
// Nothing else changes — this is a pure cut-and-paste refactor. If it isn't
// (you find view state tangled into the effect), that tangle was a design
// smell worth noticing.
//
// ✅ CHECK: everything still works; Autocomplete.jsx no longer imports
//    anything fetch-related.
//
// 🎤 TALKING POINT: "in production this hook is roughly what React Query's
//    useQuery does — cache, races, retries — I'm hand-rolling it because
//    that's the exercise." Interviewers love hearing you know the ecosystem
//    equivalent of what you're building.
//
// 🧪 BONUS: this split makes testing easy — this hook tests with a mocked
//    fetcher + fake timers; the view tests with hardcoded data. That's your
//    answer to "how would you test this?"
// ============================================================================

export function useSuggestions(query, fetchSuggestions, minChars) {
  // your code here (STEP 8 — extraction, not new logic)
  return { status: 'idle', data: [], error: null, retry: () => {} }
}
