import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/client.js'
import ProductCard from '../components/ProductCard.jsx'

const PAGE_SIZE = 12

export default function ProductListPage() {
  // ==========================================================================
  // 📝 TASK 1 — Replace this whole block with useQuery
  //             (concept: useQuery basics — isPending / isError / data)
  // ==========================================================================
  // ❌ CURRENT PROBLEMS with the code below:
  //    1. THREE pieces of state (data / loading / error) that must be kept in
  //       sync by hand. Forget one setState in one branch → impossible UI
  //       states like "loading AND showing stale data AND error".
  //    2. The useEffect has a subtle BUG that almost every hand-rolled fetch
  //       has: no cleanup. If the component unmounts mid-request, setState
  //       fires on an unmounted component. If `page` changes fast, an OLD
  //       slow response can overwrite a NEW fast one (race condition).
  //    3. This exact boilerplate is copy-pasted in every page of this app.
  //
  // 💡 WHY REACT QUERY:
  //    useQuery collapses all of this into one declarative line and gives you
  //    machine-managed status flags: isPending, isError, isSuccess, error,
  //    data, isFetching. Races and unmounts are handled internally.
  //
  // ✅ YOUR TASK:
  //    const { data, isPending, isError, error } = useQuery({
  //      queryKey: ['products', page],        // ← see TASK 3 about the key!
  //      queryFn: () => fetchProducts({ limit: PAGE_SIZE, skip: page * PAGE_SIZE }),
  //    })
  //    Then DELETE all the useState/useEffect below and render from `data`.
  // ==========================================================================

  // ==========================================================================
  // 📝 TASK 2 — Observe caching: staleTime vs gcTime
  //             (concept: the cache lifecycle — fresh → stale → inactive → gc)
  // ==========================================================================
  // ❌ CURRENT PROBLEM (try it!):
  //    Navigate Products → Cart → back to Products. The list re-fetches and
  //    you stare at "Loading..." AGAIN even though you saw this data 2 seconds
  //    ago. Raw useEffect has no memory: unmount = data gone.
  //
  // 💡 WHY REACT QUERY:
  //    Cached data is shown INSTANTLY on remount, and re-fetched in the
  //    background only if "stale". Two independent knobs:
  //      staleTime — how long data counts as fresh (fresh = no refetch at all).
  //                  Default 0 → always stale → background refetch on mount,
  //                  window focus, reconnect.
  //      gcTime    — how long UNUSED (inactive) data stays in the cache before
  //                  being garbage collected. Default 5 min.
  //
  // ✅ YOUR TASK (after Task 1 works):
  //    1. Navigate away & back. Notice: data appears instantly, but a
  //       background refetch still happens (watch devtools + the network tab).
  //       That's stale-while-revalidate — the default behaviour.
  //    2. Add `staleTime: 60_000` to the query → now navigating back within a
  //       minute does ZERO network requests.
  //    3. Also observe `refetchOnWindowFocus`: tab away and back with default
  //       settings — React Query silently re-syncs. Try turning it off.
  //    4. In devtools, watch this query go fresh → stale → inactive when you
  //       leave the page, and disappear after gcTime.
  // ==========================================================================

  // ==========================================================================
  // 📝 TASK 3 — Query keys are your dependency array
  //             (concept: query keys identify cache entries)
  // ==========================================================================
  // ❌ CURRENT PROBLEM:
  //    Below, `page` sits in useEffect's dep array, and the response for page
  //    2 OVERWRITES page 1 in this component's state. Go back to page 1 →
  //    full re-fetch, data you already downloaded is gone.
  //
  // 💡 WHY REACT QUERY:
  //    ['products', 1] and ['products', 2] are SEPARATE cache entries. When
  //    any value in the key changes, React Query automatically fetches the new
  //    entry — and old pages stay cached, so going BACK a page is instant.
  //    Rule of thumb: every variable your queryFn uses belongs in the key
  //    (like an ESLint-enforced dependency array for server state).
  //
  // ✅ YOUR TASK:
  //    Make sure `page` is part of the queryKey from Task 1, then flip between
  //    pages and revisit old ones — instant, no spinner.
  // ==========================================================================

  // ==========================================================================
  // 📝 TASK 4 — Smooth pagination
  //             (concept: placeholderData: keepPreviousData, isPlaceholderData)
  // ==========================================================================
  // ❌ CURRENT PROBLEM (visible even after Tasks 1–3):
  //    Clicking "Next" on a never-visited page blanks the whole list into a
  //    spinner. The page JUMPS: content → spinner → content. Horrible UX.
  //
  // 💡 WHY REACT QUERY:
  //    placeholderData: keepPreviousData (import from '@tanstack/react-query')
  //    keeps showing the PREVIOUS page's data while the next page loads in the
  //    background, and exposes `isPlaceholderData` so you can dim the old list
  //    and disable "Next" until real data lands.
  //
  // ✅ YOUR TASK:
  //    Add `placeholderData: keepPreviousData` to the query. Use
  //    `isPlaceholderData` to add e.g. style={{ opacity: 0.5 }} to the grid.
  // ==========================================================================

  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)

  useEffect(() => {
    setLoading(true) // forgot to reset error here? classic hand-rolled bug 🐛
    fetchProducts({ limit: PAGE_SIZE, skip: page * PAGE_SIZE })
      .then((data) => {
        // 🐛 No check whether this response is for the CURRENT page — a slow
        // page-1 response can land after a fast page-2 response and win.
        setProducts(data.products)
        setTotal(data.total)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
    // 🐛 No cleanup / AbortController. setState after unmount is possible.
  }, [page])

  if (loading) return <p className="status">Loading products…</p>
  if (error) return <p className="status error">Error: {error}</p>

  return (
    <section>
      <h2>Products (page {page + 1})</h2>
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      <div className="pager">
        <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
          ← Prev
        </button>
        <button
          disabled={(page + 1) * PAGE_SIZE >= total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next →
        </button>
      </div>
    </section>
  )
}
