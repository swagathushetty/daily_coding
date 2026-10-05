// ============================================================================
// 🏗️ BUILD-IT-YOURSELF: Autocomplete (machine coding round)
//
// You write ALL the code. Files only contain the guide. Build order:
//
//   STEP 0  (here)                    plan on paper — 10 minutes, no code
//   STEP 1  (here)                    design the component's props contract
//   STEP 2  components/Autocomplete.jsx   input + dropdown rendering (static)
//   STEP 3  hooks/useDebouncedValue.js    debounce the query
//   STEP 4  components/Autocomplete.jsx   API call + loading/error/empty states
//   STEP 5  components/Autocomplete.jsx   race conditions + request cancel
//   STEP 6  components/Autocomplete.jsx   keyboard navigation
//   STEP 7  components/Autocomplete.jsx   highlight the matched text
//   STEP 8  hooks/useSuggestions.js       extract data logic out of the view
//   STEP 9  components/Autocomplete.jsx   cache, outside-click, a11y polish
//
// Styling is NOT the exercise — styles.css already has every class you need
// (.ac, .ac-input, .ac-list, .ac-item, .ac-item.active, .ac-status, .mark).
// ============================================================================

// ============================================================================
// 📝 STEP 0 — Plan like it's the real round (NO CODE YET)
// ----------------------------------------------------------------------------
// Read REQUIREMENTS.md fully. Then write on paper (or in a comment here):
//   1. The component tree (it's tiny — that's the point, say it anyway).
//   2. Every piece of state you think you need, and WHERE it lives.
//   3. The trickiest requirement (hint: out-of-order responses) and your plan.
// In a real round, narrating this plan in the first 10 minutes is worth as
// much as the code. Practice saying it out loud. Seriously — out loud.
// ============================================================================

// ============================================================================
// 📝 STEP 1 — Design the props contract BEFORE building the component
// ----------------------------------------------------------------------------
// The #1 grading axis is reusability: Autocomplete must not know about
// "products". Decide your props by answering:
//
//   Q1. How does the component get data without hardcoding the URL?
//       → the parent passes an async function. What arguments should it
//         receive? (think: what does the component KNOW that the fetcher
//         NEEDS — and peek at STEP 5: cancellation wants to ride along…)
//   Q2. Suggestions are arbitrary objects. What two "accessor" props do you
//       need to render a list of unknown things? (react to how <select> or
//       any list library solves this)
//   Q3. How does the parent learn about a selection?
//   Q4. Which behaviors should be configurable numbers? (two of them are in
//       REQUIREMENTS.md)
//
// ✅ CHECK: your contract should land close to:
//    fetchSuggestions, getKey, getLabel, onSelect, minChars, debounceMs,
//    placeholder — if you have 15 props, you over-designed; if the component
//    imports the API URL, you failed Q1.
//
// YOUR TASK for this file: render <Autocomplete /> below with your contract,
// write the fetcher for https://dummyjson.com/products/search?q=<q>&limit=8
// (normalize: return data.products — keep API shape OUT of the component),
// and show the selected product under the input (lift selection via onSelect
// into useState here).
// ============================================================================

export default function App() {
  return (
    <main>
      <h1>🔎 Product Search</h1>
      {/* your <Autocomplete ... /> here */}
      <p className="ac-status">Start with STEP 0 — read the comments above.</p>
    </main>
  )
}
