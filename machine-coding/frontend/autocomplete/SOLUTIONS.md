# ⚠️ SOLUTIONS — open a section only AFTER attempting that step

Rule of thumb: struggle for 15+ minutes first. Peeking early converts a
building rep into a reading rep (and reading reps don't survive interviews).

---

<details>
<summary><strong>STEP 1 — App.jsx: contract + fetcher + usage</strong></summary>

```jsx
import { useState } from 'react'
import Autocomplete from './components/Autocomplete.jsx'

async function fetchProductSuggestions(query, signal) {
  const res = await fetch(
    `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}&limit=8`,
    { signal },
  )
  if (!res.ok) throw new Error(`HTTP ${res.status}`) // fetch doesn't reject on 4xx/5xx!
  const data = await res.json()
  return data.products // normalize: API shape stays out of the component
}

export default function App() {
  const [selected, setSelected] = useState(null)
  return (
    <main>
      <h1>🔎 Product Search</h1>
      <Autocomplete
        fetchSuggestions={fetchProductSuggestions}
        getKey={(p) => p.id}
        getLabel={(p) => p.title}
        onSelect={setSelected}
        placeholder="Search products…"
        minChars={2}
        debounceMs={300}
      />
      {selected && (
        <section className="selected">
          <h2>Selected</h2>
          <p>{selected.title} — ${selected.price}</p>
        </section>
      )}
    </main>
  )
}
```
</details>

<details>
<summary><strong>STEP 3 — useDebouncedValue</strong></summary>

```jsx
import { useEffect, useState } from 'react'

export function useDebouncedValue(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(t) // each keystroke cancels the previous timer
  }, [value, delayMs])
  return debounced
}
```
</details>

<details>
<summary><strong>STEPS 2, 4–7, 9 — the full Autocomplete component</strong></summary>

Final form (after the STEP 8 extraction — data logic lives in the hook):

```jsx
import { useId, useRef, useState, useEffect } from 'react'
import { useDebouncedValue } from '../hooks/useDebouncedValue.js'
import { useSuggestions } from '../hooks/useSuggestions.js'

// STEP 7: split label around the (case-insensitive) match, keep original casing
function Highlight({ text, query }) {
  const i = text.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1 || !query) return text
  return (
    <>
      {text.slice(0, i)}
      <mark className="mark">{text.slice(i, i + query.length)}</mark>
      {text.slice(i + query.length)}
    </>
  )
}

export default function Autocomplete({
  fetchSuggestions,
  getKey,
  getLabel,
  onSelect,
  placeholder,
  minChars = 2,
  debounceMs = 300,
}) {
  const [query, setQuery] = useState('')          // view state
  const [open, setOpen] = useState(false)         // view state
  const [activeIndex, setActiveIndex] = useState(-1) // view state
  const containerRef = useRef(null)
  const listId = useId() // unique per instance — two on a page won't collide

  const debouncedQuery = useDebouncedValue(query, debounceMs)
  const { status, data, error, retry } = useSuggestions(
    debouncedQuery,
    fetchSuggestions,
    minChars,
  )

  // STEP 6 edge case: new results → stale activeIndex would crash Enter
  useEffect(() => setActiveIndex(-1), [data])

  // STEP 9b: outside click closes
  useEffect(() => {
    function onDocMouseDown(e) {
      if (!containerRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [])

  function select(item) {
    onSelect(item)
    setQuery(getLabel(item)) // component fills input — simple contract
    setOpen(false)
  }

  // STEP 6: focus stays on the input; the list is purely visual
  function onKeyDown(e) {
    if (!open || data.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % data.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      // JS % is negative for negatives — add length before the modulo
      setActiveIndex((i) => (i - 1 + data.length) % data.length)
    } else if (e.key === 'Enter') {
      e.preventDefault() // inputs inside forms submit on Enter
      if (activeIndex >= 0 && activeIndex < data.length) select(data[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const showList = open && query.trim().length >= minChars

  return (
    <div className="ac" ref={containerRef}>
      <input
        className="ac-input"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={
          activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined
        }
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {showList && (
        <ul className="ac-list" role="listbox" id={listId}>
          {status === 'loading' && <li className="ac-status">Searching…</li>}
          {status === 'error' && (
            <li className="ac-status error">
              {error} <button onClick={retry}>Retry</button>
            </li>
          )}
          {status === 'success' && data.length === 0 && (
            <li className="ac-status">No matches</li>
          )}
          {status === 'success' &&
            data.map((item, index) => (
              <li
                key={getKey(item)}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={`ac-item ${index === activeIndex ? 'active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)} // one highlight source
                onClick={() => select(item)}
              >
                <Highlight text={getLabel(item)} query={debouncedQuery} />
              </li>
            ))}
        </ul>
      )}
    </div>
  )
}
```
</details>

<details>
<summary><strong>STEPS 4, 5, 8, 9a — useSuggestions (fetch, states, races, abort, cache)</strong></summary>

```jsx
import { useEffect, useRef, useState } from 'react'

export function useSuggestions(query, fetchSuggestions, minChars) {
  const [state, setState] = useState({ status: 'idle', data: [], error: null })
  const [attempt, setAttempt] = useState(0) // bumping this re-runs the effect (retry)

  // STEP 9a: survives re-renders, never causes them → useRef, not useState
  const cacheRef = useRef(new Map())

  useEffect(() => {
    const q = query.trim().toLowerCase()

    if (q.length < minChars) {
      setState({ status: 'idle', data: [], error: null })
      return
    }

    if (cacheRef.current.has(q)) {
      setState({ status: 'success', data: cacheRef.current.get(q), error: null })
      return
    }

    // STEP 5 — two layers:
    const controller = new AbortController() // layer 2: cancel old request
    let ignore = false                       // layer 1: correctness guarantee

    setState((s) => ({ ...s, status: 'loading', error: null }))

    fetchSuggestions(q, controller.signal)
      .then((results) => {
        cacheRef.current.set(q, results)
        if (!ignore) setState({ status: 'success', data: results, error: null })
      })
      .catch((err) => {
        if (err.name === 'AbortError') return // cancelled ≠ failed
        if (!ignore) setState({ status: 'error', data: [], error: err.message })
      })

    return () => {
      ignore = true
      controller.abort()
    }
  }, [query, minChars, attempt, fetchSuggestions])

  const retry = () => {
    cacheRef.current.delete(query.trim().toLowerCase())
    setAttempt((n) => n + 1)
  }

  return { ...state, retry }
}
```

Why `attempt` for retry: the effect's real deps didn't change, so we add a
counter dep whose only job is forcing a re-run — a clean, honest pattern
(vs. sneaky state-identity tricks).
</details>

---

## Self-grading rubric (what interviewers score)

- [ ] Works end-to-end with keyboard only
- [ ] No stale-response bug under Slow 3G
- [ ] One `status` field, not boolean soup
- [ ] Component is generic (could search users with 3 changed lines in App)
- [ ] Data logic separated from view logic
- [ ] Can verbally answer: debounce vs throttle, why AbortError is ignored,
      why cache is a ref, why activeIndex resets on new data
</details>
