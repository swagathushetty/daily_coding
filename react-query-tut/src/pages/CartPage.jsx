import { useEffect, useState } from 'react'
import { fetchCart, updateCart } from '../api/client.js'

const CART_ID = 1

export default function CartPage() {
  // ==========================================================================
  // 📝 TASK 9 — Writes belong to useMutation, then invalidate
  //             (concepts: useMutation, queryClient.invalidateQueries)
  // ==========================================================================
  // ❌ CURRENT PROBLEMS:
  //    1. `changeQty` below hand-manages saving/error state AND manually
  //       re-fetches the cart afterwards (`loadCart()`), AND other pages that
  //       show cart data (none yet — imagine a badge in the header) would
  //       have NO idea the cart changed. Server state changed but only THIS
  //       component knows.
  //    2. Double-click "＋" fast → two overlapping PUTs, last-write-wins chaos.
  //    3. No pending indicator per-action; the whole page just blocks.
  //
  // 💡 WHY REACT QUERY:
  //    Reads → useQuery. Writes → useMutation. After a successful write you
  //    declare WHAT is now out-of-date, not HOW to refresh it:
  //
  //    const qc = useQueryClient()
  //    const cartQ = useQuery({ queryKey: ['cart', CART_ID], queryFn: () => fetchCart(CART_ID) })
  //    const qtyMutation = useMutation({
  //      mutationFn: ({ products }) => updateCart(CART_ID, products),
  //      onSuccess: () => qc.invalidateQueries({ queryKey: ['cart', CART_ID] }),
  //    })
  //
  //    invalidateQueries marks matching cache entries stale and refetches the
  //    active ones — every subscribed component updates automatically. This
  //    invalidate-after-mutate pattern is THE core React Query pattern.
  //    Also use `qtyMutation.isPending` to disable buttons while in flight.
  //
  // ✅ YOUR TASK: convert the read to useQuery and changeQty to useMutation
  //    with invalidation. NOTE: dummyjson doesn't really persist writes, so
  //    the refetch resets quantities — that's fine, watch the NETWORK/devtools
  //    behaviour, that's the lesson. (Task 10 fixes the visual part.)
  // ==========================================================================

  // ==========================================================================
  // 📝 TASK 10 — Optimistic updates
  //             (concepts: onMutate, cancelQueries, snapshot & rollback,
  //                        onError, onSettled)
  // ==========================================================================
  // ❌ CURRENT PROBLEM:
  //    Click "＋" → UI freezes for the round-trip before the number changes.
  //    Feels laggy. Users expect a cart counter to move INSTANTLY.
  //
  // 💡 WHY REACT QUERY:
  //    The full optimistic recipe on the mutation:
  //
  //    onMutate: async (newProducts) => {
  //      await qc.cancelQueries({ queryKey: ['cart', CART_ID] })   // don't let an
  //      const previous = qc.getQueryData(['cart', CART_ID])       // in-flight
  //      qc.setQueryData(['cart', CART_ID], (old) => ({            // refetch
  //        ...old, products: newProducts,                          // clobber us
  //      }))
  //      return { previous }                        // → context for rollback
  //    },
  //    onError: (_err, _vars, ctx) =>
  //      qc.setQueryData(['cart', CART_ID], ctx.previous),         // rollback!
  //    onSettled: () =>
  //      qc.invalidateQueries({ queryKey: ['cart', CART_ID] }),    // re-sync
  //
  //    UI updates instantly; if the server rejects, state snaps back and you
  //    can toast an error. Test the rollback by turning on network "Offline"
  //    in devtools and clicking ＋.
  //
  // ✅ YOUR TASK: add onMutate/onError/onSettled to Task 9's mutation.
  // ==========================================================================

  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function loadCart() {
    setLoading(true)
    fetchCart(CART_ID)
      .then((data) => {
        setCart(data)
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }

  useEffect(loadCart, [])

  function changeQty(productId, delta) {
    const products = cart.products
      .map((p) =>
        p.id === productId ? { ...p, quantity: p.quantity + delta } : p,
      )
      .filter((p) => p.quantity > 0)
      .map((p) => ({ id: p.id, quantity: p.quantity }))

    setSaving(true) // blocks the WHOLE page — no per-row pending state
    updateCart(CART_ID, products)
      .then(() => {
        setSaving(false)
        loadCart() // manual refetch; nobody else in the app learns of this
      })
      .catch((e) => {
        setSaving(false)
        setError(e.message) // 🐛 no rollback concept — UI and server disagree
      })
  }

  if (loading) return <p className="status">Loading cart…</p>
  if (error) return <p className="status error">Error: {error}</p>

  return (
    <section>
      <h2>Your Cart {saving && <small>(saving…)</small>}</h2>
      <ul className="cart">
        {cart.products.map((p) => (
          <li key={p.id}>
            <span>{p.title}</span>
            <span>
              <button disabled={saving} onClick={() => changeQty(p.id, -1)}>
                −
              </button>
              {p.quantity}
              <button disabled={saving} onClick={() => changeQty(p.id, +1)}>
                ＋
              </button>
            </span>
            <span>${p.total}</span>
          </li>
        ))}
      </ul>
      <p className="price">Total: ${cart.total}</p>
    </section>
  )
}
