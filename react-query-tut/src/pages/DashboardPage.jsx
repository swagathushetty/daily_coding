import { useEffect, useState } from 'react'
import {
  fetchUser,
  fetchCart,
  fetchCategories,
  fetchProductsByCategory,
} from '../api/client.js'

export default function DashboardPage() {
  // ==========================================================================
  // 📝 TASK 14 — Parallel queries
  //             (concepts: multiple useQuery calls, useQueries for dynamic
  //                        lists, deduplication)
  // ==========================================================================
  // ❌ CURRENT PROBLEMS:
  //    1. Promise.all below is ALL-OR-NOTHING: if ONE of the three requests
  //       fails, the entire dashboard shows one big error, and the two
  //       successful payloads are thrown away.
  //    2. One shared spinner: the fast user fetch waits for the slow one.
  //    3. The cart is fetched here AND on CartPage — two components, two
  //       copies, two requests, possibly two different answers.
  //    4. Look at the SECOND effect: it fan-outs one request per category —
  //       a DYNAMIC number of parallel fetches glued together by hand.
  //
  // 💡 WHY REACT QUERY:
  //    a) Fixed set → just call useQuery three times. They run in parallel
  //       automatically, and each section gets its OWN isPending/isError, so
  //       one failure degrades one card, not the page:
  //         const userQ = useQuery({ queryKey: ['user', 1], queryFn: () => fetchUser(1) })
  //         const cartQ = useQuery({ queryKey: ['cart', 1], queryFn: () => fetchCart(1) })
  //         const catsQ = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })
  //       BONUS: ['cart', 1] is the SAME key CartPage uses → the two pages
  //       now share one cache entry, and concurrent mounts are DEDUPLICATED
  //       into a single network request.
  //    b) Dynamic list → useQueries:
  //         const catQs = useQueries({
  //           queries: (catsQ.data?.slice(0, 3) ?? []).map((c) => ({
  //             queryKey: ['products', 'category', c],
  //             queryFn: () => fetchProductsByCategory(c),
  //           })),
  //         })
  //       (You can't call useQuery in a loop — rules of hooks — useQueries
  //       exists exactly for this.)
  //
  // ✅ YOUR TASK: split into 3 useQuery calls + one useQueries, each card
  //    rendering its own pending/error state.
  // ==========================================================================

  // ==========================================================================
  // 📝 TASK 15 — Transform with `select`
  //             (concept: the select option + render optimization)
  // ==========================================================================
  // ❌ CURRENT PROBLEM:
  //    Look at `cheapestPerCategory` below — raw API payloads are massaged
  //    inline in the effect and the DERIVED shape is stored in state. Now the
  //    cache-of-record (none!) and the rendered shape have drifted apart, and
  //    the transform re-runs / re-allocates on every fetch.
  //
  // 💡 WHY REACT QUERY:
  //    `select` derives a view of cached data WITHOUT changing the cache:
  //      useQuery({
  //        queryKey: ['products', 'category', c],
  //        queryFn: () => fetchProductsByCategory(c),
  //        select: (data) =>
  //          data.products.reduce((min, p) => (p.price < min.price ? p : min)),
  //      })
  //    The cache keeps the FULL payload (shareable with other screens); this
  //    component re-renders only when the SELECTED slice changes. Also try
  //    select: (d) => d.total on the cart query — the component now ignores
  //    every cart change except the total.
  //
  // ✅ YOUR TASK: move the "cheapest product" logic into `select` inside
  //    Task 14's useQueries entries.
  // ==========================================================================

  // ==========================================================================
  // 📝 TASK 16 — Extract custom hooks (the pro pattern)
  // ==========================================================================
  // By now you've written useQuery({ queryKey: ['cart', 1], ... }) in TWO
  // places. Key typo in one of them = silent cache miss.
  //
  // ✅ YOUR TASK: create src/hooks/queries.js and centralize:
  //      export const cartKeys = { all: ['cart'], byId: (id) => ['cart', id] }
  //      export function useCart(id = 1) {
  //        return useQuery({ queryKey: cartKeys.byId(id), queryFn: () => fetchCart(id) })
  //      }
  //    …and same for useProducts(page), useProduct(id), useUser(id).
  //    Components stop knowing about keys entirely; mutations import
  //    cartKeys for invalidation. This "query key factory + custom hook per
  //    resource" combo is how real codebases use React Query.
  // ==========================================================================

  const [data, setData] = useState(null)
  const [cheapestPerCategory, setCheapest] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // 🐛 all-or-nothing: one failure kills the whole dashboard
    Promise.all([fetchUser(1), fetchCart(1), fetchCategories()])
      .then(([user, cart, categories]) => {
        setData({ user, cart, categories })
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!data?.categories) return
    // 🐛 hand-rolled dynamic parallel fan-out + inline transform
    Promise.all(
      data.categories.slice(0, 3).map((c) => fetchProductsByCategory(c)),
    )
      .then((results) =>
        setCheapest(
          results.map((r, i) => ({
            category: data.categories[i],
            product: r.products.reduce((min, p) =>
              p.price < min.price ? p : min,
            ),
          })),
        ),
      )
      .catch(() => {})
  }, [data?.categories])

  if (loading) return <p className="status">Loading dashboard…</p>
  if (error) return <p className="status error">Error: {error}</p>

  return (
    <section>
      <h2>Dashboard</h2>
      <div className="grid">
        <div className="card pad">
          <h3>👤 {data.user.firstName} {data.user.lastName}</h3>
          <p>{data.user.email}</p>
        </div>
        <div className="card pad">
          <h3>🛒 Cart</h3>
          <p>
            {data.cart.totalProducts} products — ${data.cart.total}
          </p>
        </div>
        <div className="card pad">
          <h3>🏷️ Categories</h3>
          <p>{data.categories.length} categories</p>
        </div>
      </div>
      <h3>Cheapest per category</h3>
      <ul>
        {cheapestPerCategory.map(({ category, product }) => (
          <li key={category}>
            <em>{category}</em>: {product.title} (${product.price})
          </li>
        ))}
      </ul>
    </section>
  )
}
