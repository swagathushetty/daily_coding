import { useEffect, useState } from 'react'
import { fetchOrderStatus } from '../api/client.js'

// (We fake an "order status feed" with dummyjson's /todos endpoint —
//  pretend `completed: true` means "Delivered".)

export default function OrderStatusPage() {
  const [orderId, setOrderId] = useState(1)

  // ==========================================================================
  // 📝 TASK 11 — Polling done right
  //             (concept: refetchInterval, refetchIntervalInBackground)
  // ==========================================================================
  // ❌ CURRENT PROBLEMS with the hand-rolled setInterval below:
  //    1. It polls even when the TAB IS HIDDEN — wasted requests all night.
  //    2. Interval + async don't compose: if a request takes longer than the
  //       interval, requests overlap and stale responses interleave.
  //    3. Changing orderId while a poll is in flight → response for the OLD
  //       order can land after the new one (no cleanup of in-flight work).
  //    4. Poll results don't update any shared cache — only this component.
  //
  // 💡 WHY REACT QUERY:
  //    useQuery({
  //      queryKey: ['order', orderId],
  //      queryFn: () => fetchOrderStatus(orderId),
  //      refetchInterval: (query) =>
  //        query.state.data?.completed ? false : 5000,  // 🔥 stop when done!
  //    })
  //    One option. Pauses when the tab is hidden by default (opt back in with
  //    refetchIntervalInBackground: true). The function form lets you STOP
  //    polling once the order is delivered — try doing that cleanly with
  //    setInterval.
  //
  // ✅ YOUR TASK: replace the effect with the query above. Show `isFetching`
  //    as a small "⟳ syncing" hint so you can SEE each poll tick.
  // ==========================================================================

  // ==========================================================================
  // 📝 TASK 12 — Retries & global defaults
  //             (concepts: retry, retryDelay, QueryClient defaultOptions)
  // ==========================================================================
  // ❌ CURRENT PROBLEM (try it!):
  //    Set the order id to 9999 → dummyjson returns 404 → this page shows a
  //    hard error INSTANTLY. And on flaky wifi a single dropped request =
  //    permanent error until the user manually reloads. Hand-rolled fetch has
  //    zero resilience.
  //
  // 💡 WHY REACT QUERY:
  //    Failed queries retry 3 times by default with exponential backoff —
  //    transient blips heal themselves. You tune it per-query or globally:
  //
  //    new QueryClient({
  //      defaultOptions: {
  //        queries: {
  //          staleTime: 30_000,
  //          retry: (failureCount, error) =>
  //            error.message.includes('404') ? false : failureCount < 3,
  //        },                     // ↑ don't retry 404s — they'll never heal
  //      },
  //    })
  //
  // ✅ YOUR TASK:
  //    1. Enter a bad order id and watch devtools: state cycles
  //       fetching → retrying with growing delays → error.
  //    2. Add the smart retry above to your QueryClient in main.jsx (Task 0).
  //    3. Render `failureCount` while retrying ("attempt 2 of 3…").
  // ==========================================================================

  const [order, setOrder] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    setOrder(null)
    setError(null)

    function poll() {
      fetchOrderStatus(orderId)
        .then(setOrder)
        .catch((e) => setError(e.message)) // 🐛 one blip = permanent error
    }

    poll()
    const t = setInterval(poll, 5000) // 🐛 polls forever, even hidden tabs,
    return () => clearInterval(t) //     even after "delivery"
  }, [orderId])

  return (
    <section>
      <h2>Order Status</h2>
      <label>
        Order #
        <input
          type="number"
          min="1"
          value={orderId}
          onChange={(e) => setOrderId(Number(e.target.value))}
        />
      </label>
      {error && <p className="status error">Error: {error}</p>}
      {!order && !error && <p className="status">Loading order…</p>}
      {order && (
        <div className="order">
          <p>“{order.todo}”</p>
          <p>
            Status:{' '}
            {order.completed ? '✅ Delivered' : '🚚 Out for delivery (polling every 5s)'}
          </p>
        </div>
      )}
    </section>
  )
}
