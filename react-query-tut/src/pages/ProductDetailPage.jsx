import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchProduct, fetchProductsByCategory } from '../api/client.js'

export default function ProductDetailPage() {
  const { id } = useParams()

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

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // fetch #1: the product itself
  useEffect(() => {
    setLoading(true)
    setProduct(null) // manual reset so old product doesn't flash 🙄
    setRelated([])
    fetchProduct(id)
      .then((data) => {
        setProduct(data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [id])

  // fetch #2: hand-rolled "dependent query" — waits on product.category
  useEffect(() => {
    if (!product?.category) return
    fetchProductsByCategory(product.category)
      .then((data) =>
        setRelated(data.products.filter((p) => String(p.id) !== id)),
      )
      .catch(() => {
        /* 🐛 swallowed error — user never knows related failed */
      })
  }, [product?.category, id])

  if (loading) return <p className="status">Loading product…</p>
  if (error) return <p className="status error">Error: {error}</p>
  if (!product) return null

  return (
    <section>
      <Link to="/">← back</Link>
      <div className="detail">
        <img src={product.thumbnail} alt={product.title} />
        <div>
          <h2>{product.title}</h2>
          <p className="price">${product.price}</p>
          <p>{product.description}</p>
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
