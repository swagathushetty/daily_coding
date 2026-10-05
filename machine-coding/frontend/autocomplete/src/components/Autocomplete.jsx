// ============================================================================
// components/Autocomplete.jsx — you build this file across STEPS 2, 4, 5, 6,
// 7 and 9. Do them IN ORDER; each step has a ✅ CHECK to verify before moving
// on. Hints are at the bottom of each step — try without them first.
// ============================================================================

// ============================================================================
// 📝 STEP 2 — Static skeleton: input + dropdown (no API yet)
// ----------------------------------------------------------------------------
// Build the component with your STEP 1 contract. For now:
//   - useState for the input text (controlled input).
//   - useState for "is the dropdown open".
//   - Render a FAKE hardcoded suggestions array so you can build the list UI:
//     open the dropdown when the input has focus & text, render items with
//     getLabel/getKey, clicking an item calls onSelect + fills input + closes.
//
// 🤔 DESIGN QUESTION to answer before coding: when an item is clicked, should
//    the component or the parent decide what goes into the input? (Convention:
//    component fills it with getLabel(item) — simple contract. Know why.)
//
// ✅ CHECK: type anything → fake list shows; click item → input filled,
//    list closed, App shows the selection.
//
// 💡 HINT (structure only):
//    <div className="ac">
//      <input className="ac-input" ... />
//      {open && <ul className="ac-list"> ... <li className="ac-item"> ... </ul>}
//    </div>
// ============================================================================

// ============================================================================
// 📝 STEP 4 — Real API + the four states (do STEP 3, the debounce hook, first)
// ----------------------------------------------------------------------------
// Wire the debounced query to fetchSuggestions in a useEffect.
//   - Fetch ONLY when debouncedQuery.trim().length >= minChars, else clear.
//   - You need a status: 'idle' | 'loading' | 'error' | 'success'. ONE state
//     field, not three booleans (isLoading+isError+isEmpty = impossible-state
//     bugs — this exact point impresses interviewers).
//   - Render: loading → "Searching…", error → message + Retry button,
//     success + [] → "No matches", success → the list. Use .ac-status.
//
// 🤔 DESIGN QUESTION: results state lives inside Autocomplete, not App — why?
//    (Who else needs it? Nobody. Colocation. Be able to defend this.)
//
// ✅ CHECK: type "phone" → real results. Type "zzzz" → "No matches". Turn on
//    devtools Network→Offline → error + Retry appears, Retry works when back
//    online. Fewer than minChars characters → no request fired at all.
// ============================================================================

// ============================================================================
// 📝 STEP 5 — Race conditions: latest-request-wins (THE key requirement)
// ----------------------------------------------------------------------------
// Reproduce the bug first: throttle network to "Slow 3G", type "p", wait a
// beat, quickly type "hone". Old responses can land AFTER new ones and
// overwrite them. Your debounce reduces this; it does NOT eliminate it.
//
// Fix it in the same useEffect. Two independent layers — implement BOTH and
// be able to explain why each exists:
//   Layer 1 (correctness): the effect-cleanup flag. Cleanup runs before the
//     next effect → flip a boolean the .then() checks before setState.
//   Layer 2 (efficiency): AbortController — actually cancel the old HTTP
//     request. Create one per effect run, pass controller.signal to
//     fetchSuggestions (this is why STEP 1 hinted the fetcher's signature!),
//     abort in cleanup. Catch must IGNORE AbortError (it's not a failure —
//     don't paint the error state red because the user kept typing).
//
// 🤔 FOLLOW-UP you must be able to answer: why is Layer 1 alone sufficient
//    for correctness, and what does Layer 2 add? (bandwidth + server load)
//
// ✅ CHECK: on Slow 3G, mash keys — the rendered results ALWAYS match the
//    current input, and devtools Network shows earlier requests as (canceled).
// ============================================================================

// ============================================================================
// 📝 STEP 6 — Keyboard navigation
// ----------------------------------------------------------------------------
// One more piece of state: activeIndex (number, -1 = nothing active).
// onKeyDown on the INPUT (focus never leaves the input — the list is purely
// visual; this is also how a11y wants it):
//   ↓ / ↑  move with wrapping (last → first). Modulo arithmetic is neat, but
//          watch out: JS % of a negative number is negative. Handle it.
//   Enter  select the active item (guard: only when list open & index valid;
//          also e.preventDefault() — inputs inside forms submit on Enter).
//   Esc    close the dropdown.
//
// 🤔 EDGE CASES you must decide (interviewers probe exactly these):
//   - New results arrive → what happens to activeIndex? (reset it — stale
//     index on a shorter list = crash on Enter)
//   - Mouse hover and keyboard both set "active"? (yes — one source of truth,
//     onMouseEnter sets activeIndex; never two competing highlight states)
//
// ✅ CHECK: full flow with hands off the mouse: type → ↓↓↓ (wraps) → Enter.
//    Esc closes. Hovering with mouse moves the same highlight.
//    Style the active row via className={... index === activeIndex ? 'active' : ''}
// ============================================================================

// ============================================================================
// 📝 STEP 7 — Highlight the matched text
// ----------------------------------------------------------------------------
// Inside each row, wrap the matched substring in <mark className="mark">.
// Write a tiny helper (a function or micro-component) that splits
// getLabel(item) around the query, case-INSENSITIVELY, but renders the
// original casing ("iPhone" matched by "iph" highlights "iPh").
//
// 🤔 THINK: indexOf on lowered copies gives you the split points; slice the
//    ORIGINAL string with them. (Regex also works — if you go regex, you must
//    escape the user's input. Say the word "escaping" and the interviewer
//    relaxes.) Highlight first occurrence only — fine, state the limitation.
//
// ✅ CHECK: searching "pho" shows "iPhone 9" with "Pho" highlighted, casing
//    preserved. Searching "(" doesn't crash (regex path only).
// ============================================================================

// ============================================================================
// 📝 STEP 9 — Production polish: cache, outside-click, a11y
//             (do STEP 8 — the hook extraction — first)
// ----------------------------------------------------------------------------
// a) CACHE: a Map of normalized-query → results. Where does an
//    every-render-surviving, never-rendered value live? NOT useState (why? —
//    setting it would re-render for nothing) → useRef. Check the cache before
//    fetching; on hit, skip the network entirely.
//    ✅ CHECK: search "phone", clear, search "phone" again → Network tab
//       shows no second request.
// b) OUTSIDE CLICK: close the dropdown when clicking elsewhere. useEffect →
//    document.addEventListener('mousedown', ...), check
//    containerRef.current.contains(e.target), REMOVE the listener in cleanup.
//    (Alternative worth knowing: onBlur — but blur fires before the item's
//    click registers unless you use onMouseDown ordering. The document
//    listener is the robust choice.)
//    ✅ CHECK: click outside → closes. Refocus input (with results) → reopens.
// c) A11Y (the senior differentiator — 5 minutes of attributes):
//    input:  role="combobox" aria-expanded={open} aria-controls={listId}
//            aria-activedescendant={active item's id or undefined}
//    list:   role="listbox" id={listId}
//    item:   role="option" id={`${listId}-${index}`} aria-selected={active}
//    Generate listId with useId() (two Autocompletes on one page must not
//    collide — that's WHY useId exists).
//    ✅ CHECK: devtools → Elements → inspect the input's accessibility pane
//       while arrowing: activedescendant follows.
// ============================================================================

export default function Autocomplete() {
  // STEP 2 starts here. Delete this placeholder.
  return <div className="ac">build me — see STEP 2 above</div>
}
