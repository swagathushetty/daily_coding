import { useEffect, useState } from 'react'
import { fetchReviews } from '../api/client.js'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

const PAGE_SIZE = 10

export default function ReviewsPage() {
  // ==========================================================================
  // 📝 TASK 13 — Infinite scroll / "Load more"
  //             (concepts: useInfiniteQuery, getNextPageParam, fetchNextPage,
  //                        hasNextPage, isFetchingNextPage)
  // ==========================================================================
  // ❌ CURRENT PROBLEMS with the manual accumulation below:
  //    1. Pages are glued together with setReviews(prev => [...prev, ...new]) —
  //       if the effect ever runs twice (StrictMode does this in dev — try it!)
  //       you get DUPLICATED reviews. Manual accumulation is fragile.
  //    2. `skip`, `hasMore`, `loadingMore` — three interlocking state vars you
  //       must keep consistent by hand.
  //    3. Navigate away and back → the whole accumulated list is gone; user is
  //       dumped back to page 1.
  //    4. Double-click "Load more" → the same page is fetched twice.
  //
  // 💡 WHY REACT QUERY:
  //    useInfiniteQuery owns the page list for you:
  //
  //    const q = useInfiniteQuery({
  //      queryKey: ['reviews'],
  //      queryFn: ({ pageParam }) =>
  //        fetchReviews({ limit: PAGE_SIZE, skip: pageParam }),
  //      initialPageParam: 0,
  //      getNextPageParam: (lastPage) => {
  //        const next = lastPage.skip + lastPage.limit
  //        return next < lastPage.total ? next : undefined  // undefined = end
  //      },
  //    })
  //
  //    - q.data.pages is the array of pages → flatMap to render.
  //    - q.fetchNextPage() is idempotent-ish: it won't double-fire while one
  //      is in flight.
  //    - q.hasNextPage / q.isFetchingNextPage drive the button for free.
  //    - The WHOLE multi-page list is one cache entry → navigate away & back
  //      and every loaded page is still there.
  //
  // ✅ YOUR TASK: rewrite with useInfiniteQuery. Stretch goal: replace the
  //    button with an IntersectionObserver on a sentinel <div> that calls
  //    fetchNextPage() when it scrolls into view = true infinite scroll.
  // ==========================================================================

  // const [reviews, setReviews] = useState([])
  // const [skip, setSkip] = useState(0)
  // const [hasMore, setHasMore] = useState(true)
  // const [loadingMore, setLoadingMore] = useState(false)
  // const [error, setError] = useState(null)

  // useEffect(() => {
  //   setLoadingMore(true)
  //   fetchReviews({ limit: PAGE_SIZE, skip })
  //     .then((data) => {
  //       // 🐛 runs twice under StrictMode → duplicate keys warning + dupe rows
  //       setReviews((prev) => [...prev, ...data.comments])
  //       setHasMore(skip + PAGE_SIZE < data.total)
  //       setLoadingMore(false)
  //     })
  //     .catch((e) => {
  //       setError(e.message)
  //       setLoadingMore(false)
  //     })
  // }, [skip])

  const pagesQuery = useInfiniteQuery({
    queryKey:['reviews'],
    queryFn:({ pageParam }) => fetchReviews({ limit: PAGE_SIZE, skip: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>{
      const next = lastPage.skip + lastPage.limit
      return next < lastPage.total ? next : undefined  // undefined = end
    } 

  })


  if (pagesQuery.isError) return <p className="status error">Error: {pagesQuery.error.message}</p>
   const isPending = pagesQuery.isPending

  if(isPending){
    return (
      <div>
        Loading ...............................
      </div>
    )
  }
  //. With useInfiniteQuery, data is { pages: [...], pageParams: [...] } — not an array. You need to flatten:
  const reviews = pagesQuery.data.pages.flatMap((p) => p.comments)  
  const hasMore =pagesQuery.hasNextPage
  const isFetchingNextPage = pagesQuery.isFetchingNextPage
  
  return (
    <section>
      <h2>Product Reviews</h2>
      <ul className="reviews">
        {reviews.map((r) => (
          <li key={r.id}>
            <strong>{r.user.username}</strong>: {r.body}
          </li>
        ))}
      </ul>
      <button
        disabled={!hasMore || isFetchingNextPage}
        onClick={() => pagesQuery.fetchNextPage()}
      >
        {isFetchingNextPage ? 'Loading…' : hasMore ? 'Load more' : 'No more reviews'}
      </button>
    </section>
  )
}
