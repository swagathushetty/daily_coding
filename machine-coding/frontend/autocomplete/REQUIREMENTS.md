# Machine Coding Round: Autocomplete / Typeahead

> This is the sheet the interviewer hands you. When you do your timed blank
> rebuild, use ONLY this file. Time box: **75 minutes**.

## Problem

Build a search-as-you-type autocomplete component that searches products from
`https://dummyjson.com/products/search?q=<query>` and lets the user pick one.

## Functional requirements (must-have)

1. Suggestions appear as the user types; API is NOT called on every keystroke
   (debounce ~300ms) and not for queries shorter than 2 characters.
2. Results dropdown shows product title with the **matched part highlighted**.
3. Full keyboard support: `↓`/`↑` move the active suggestion (wrapping),
   `Enter` selects it, `Esc` closes the dropdown. Mouse hover + click also work.
4. Selecting a suggestion fills the input and closes the dropdown; the
   selected product is shown below the input.
5. Handle ALL states visibly: loading, error (with retry), empty results
   ("no matches"), and idle.
6. Out-of-order responses must never show stale results (type fast: the
   response for "ip" must not overwrite results for "iphone").
7. Clicking outside closes the dropdown; refocusing the input reopens it if
   there are results.
8. Repeat searches for a term already fetched should not hit the network
   again (in-memory cache is fine).

## Non-functional (what you're actually graded on)

- The Autocomplete must be a **reusable component**: the demo page passes in
  the fetch function and how to render/extract a suggestion — no product
  specifics inside the component.
- Separation of concerns: data fetching logic outside the view component.
- Accessibility: proper combobox/listbox roles and aria-activedescendant.
- No UI libraries. Plain React + CSS.

## Follow-up questions they WILL ask (be ready verbally)

- How would you cancel in-flight requests? (AbortController)
- What if the list had 10,000 items? (virtualize)
- How would you test this? (RTL: fake timers for debounce, mock fetch)
- Why debounce and not throttle here?
