import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchProducts } from '../api/client.js'
import { useQuery } from '@tanstack/react-query'

function useDebouncedValue(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}


export default function SearchPage() {

  // ==========================================================================
  // 📝 TASK 8 — Search: conditional fetching, debouncing, race conditions
  //             (concepts: `enabled`, query-key-driven refetch, isFetching)
  // ==========================================================================
  // ❌ CURRENT PROBLEMS (all real, all reproducible):
  //    1. RACE CONDITION: type "phone" quickly. Five requests fire — p, ph,
  //       pho, phon, phone. They resolve in ARBITRARY order; whichever lands
  //       LAST wins setResults. You can end up seeing results for "ph" while
  //       the box says "phone". The `ignore` flag below is the classic manual
  //       fix — easy to forget, easy to get wrong.
  //    2. Fires a request for EVERY keystroke, even single letters.
  //    3. Searching the same term twice hits the network twice — no cache.
  //    4. Yet another copy of loading/error boilerplate.
  //
  // 💡 WHY REACT QUERY:
  //    - queryKey: ['search', debouncedQuery] → each term is its own cache
  //      entry; repeated searches are instant.
  //    - React Query only delivers data belonging to the CURRENT key, so the
  //      stale-response race disappears without any `ignore` flag.
  //    - enabled: debouncedQuery.length >= 2 → no request until it's worth it.
  //
  // ✅ YOUR TASK:
  //    1. Keep `query` as controlled-input state (that's client state — React
  //       Query is for SERVER state; the input box stays useState!).
  //    2. Write a tiny useDebouncedValue(query, 400) hook (useState +
  //       useEffect + setTimeout) — debouncing is not React Query's job.
  //    3. useQuery({
  //         queryKey: ['search', debounced],
  //         queryFn: () => searchProducts(debounced),
  //         enabled: debounced.trim().length >= 2,
  //         staleTime: 60_000,
  //       })
  //    4. Show a subtle "searching…" hint with `isFetching` (background
  //       activity) vs a full skeleton only with `isPending` — learn the
  //       difference: isPending = no data yet AT ALL; isFetching = any
  //       in-flight request, including background refreshes of cached data.
  // ==========================================================================


  const [query, setQuery] = useState('')
  const debouncedQuery = useDebouncedValue(query, 400)

  const searchQuery = useQuery({
    queryKey : ['search',debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 60_000,

  })


  const products = searchQuery.data?.products || []


  return (
    <section>
      <h2>Search</h2>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products… (try 'phone')"
      />
      {searchQuery.isPending && <p className="status">Searching…</p>}
      {searchQuery.isError && <p className="status error">Error: {searchQuery.error.message}</p>}
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <Link to={`/product/${p.id}`}>
              {p.title} — ${p.price}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
