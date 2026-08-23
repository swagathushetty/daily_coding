import { Link } from 'react-router-dom'

// ============================================================================
// 📝 TASK 7 — Prefetch on hover
//             (concept: queryClient.prefetchQuery)
// ============================================================================
// ❌ CURRENT PROBLEM:
//    Click any product → the detail page shows a spinner while it fetches.
//    But the user TOLD us their intent ~300ms earlier: they hovered the card.
//    We waste that time doing nothing.
//
// 💡 WHY REACT QUERY:
//    queryClient.prefetchQuery({ queryKey, queryFn, staleTime }) fetches into
//    the cache WITHOUT a component subscribing. When the detail page mounts a
//    moment later, its useQuery finds warm data → renders instantly.
//    (Do Task 5 first so the detail page actually uses useQuery.)
//
// ✅ YOUR TASK:
//    const queryClient = useQueryClient()
//    <Link
//      onMouseEnter={() =>
//        queryClient.prefetchQuery({
//          queryKey: ['product', String(product.id)],   // MUST match the
//          queryFn: () => fetchProduct(product.id),     // detail page's key!
//          staleTime: 30_000, // don't re-prefetch on every hover twitch
//        })
//      }
//      ...
//    Then hover a card, wait a beat, click — no spinner. Check devtools:
//    the entry exists before you ever navigated.
// ============================================================================

export default function ProductCard({ product }) {
  return (
    <Link to={`/product/${product.id}`} className="card">
      <img src={product.thumbnail} alt={product.title} loading="lazy" />
      <h3>{product.title}</h3>
      <p>
        ${product.price} · ⭐ {product.rating}
      </p>
    </Link>
  )
}
