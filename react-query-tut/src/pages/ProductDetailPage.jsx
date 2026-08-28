import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct, fetchProductsByCategory } from '../api/client.js'
import { useQuery, useQueryClient } from '@tanstack/react-query'

export default function ProductDetailPage() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  // ==========================================================================
  // 📝 TASK 5 — Dependent (chained) queries
  //             (concept: the `enabled` option)
  // ==========================================================================
  // ❌ CURRENT PROBLEMS:
  //    Below there are TWO fetches with a hand-rolled waterfall: "related
  //    products" can only be fetched once we know the product's category.
  //    The coordination lives in a second useEffect keyed on
  //    `product?.category` — fragile, and if the product errors, the second
  //    effect just silently never runs. Also note the duplicated
  //    loading/error state, AGAIN (see Task 1).
  //
  // 💡 WHY REACT QUERY:
  //    Dependent queries are declarative:
  //
  //    const productQ = useQuery({
  //      queryKey: ['product', id],
  //      queryFn: () => fetchProduct(id),
  //    })
  //    const category = productQ.data?.category
  //    const relatedQ = useQuery({
  //      queryKey: ['products', 'category', category],
  //      queryFn: () => fetchProductsByCategory(category),
  //      enabled: !!category,       // ← query simply won't run until truthy
  //    })
  //
  //    `enabled: false` keeps a query idle; the moment `category` appears the
  //    query fires. No effects, no manual ordering. Bonus: visiting another
  //    product in the SAME category reuses the cached related list instantly.
  //
  // ✅ YOUR TASK: rewrite this page as the two queries above.
  // ==========================================================================

  // ==========================================================================
  // 📝 TASK 6 — Instant detail render from list data
  //             (concept: initialData / placeholderData from another query)
  // ==========================================================================
  // ❌ CURRENT PROBLEM:
  //    Even after Task 5, first visit to a product shows a spinner — yet the
  //    products LIST page already has this product's title, price and image
  //    sitting in the cache. We're showing a spinner for data we possess.
  //
  // 💡 WHY REACT QUERY:
  //    You can seed a query from another query's cached data:
  //
  //    placeholderData: () =>
  //      queryClient
  //        .getQueryData(['products', 0])          // page you came from
  //        ?.products.find((p) => String(p.id) === id)
  //
  //    placeholderData = "show this, but it's fake → still fetch & replace"
  //    initialData     = "this IS real data → counts toward staleTime"
  //    Use placeholderData here because the list version is partial (no
  //    description). The page paints instantly, description fills in.
  //
  // ✅ YOUR TASK: add placeholderData as above (getQueryData needs
  //    useQueryClient()). Guard the description with a fallback while partial.
  // ==========================================================================

  // const [product, setProduct] = useState(null)
  // const [related, setRelated] = useState([])
  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState(null)

  const productQuery = useQuery({
    queryKey:['product', id],
    queryFn: () => fetchProduct(id),
    staleTime: 30_000, // match the hover prefetch, else mounting refetches immediately
    placeholderData: () => { // we displaay possibly stale data at start from the listing page till we get fresh from api call
      // look through EVERY cached ['products', ...] page, not just page 0
      const cached = queryClient.getQueriesData({ queryKey: ['products'] })
      for (const [, data] of cached) {
        const hit = data?.products?.find((p) => String(p.id) === id)
        if (hit) return hit
      }
      return undefined
    },
  })

  const category = productQuery.data?.category

  const relatedQuery = useQuery({
    queryKey: ['products','category',category],
    queryFn: () => fetchProductsByCategory(category),
    enabled: !!category,
  })

  if (productQuery.isPending) return <p className="status">Loading product…</p>
  if (productQuery.isError) return <p className="status error">Error: {productQuery.error.message}</p>
  if (!productQuery.data) return null

  const product = productQuery.data
  const related = (relatedQuery.data?.products || []).filter(
    (p) => String(p.id) !== id,
  )
  console.log("Product",product)
  console.log("related",related)

  return ( 
    <section>
      <Link to="/">← back</Link>
      <div className="detail">
        <img src={product.thumbnail} alt={product.title} />
        <div>
          <h2>{product.title}</h2>
          <p className="price">${product.price}</p>
          <p>{product.description ?? 'Loading description…'}</p>
          <p>
            ⭐ {product.rating} · {product.stock} in stock ·{' '}
            <em>{product.category}</em>
          </p>
        </div>
      </div>

      <h3>Related in “{product.category}”</h3>
      {related.length === 0 ? (
        <p className="status">Loading related…</p>
      ) : (
        <ul>
          {related.map((p) => (
            <li key={p.id}>
              <Link to={`/product/${p.id}`}>
                {p.title} — ${p.price}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
