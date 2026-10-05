# React Query Course — Task Index

> **The real course lives in the code.** Every task below is a `📝 TASK` comment
> block in a source file, sitting directly above intentionally-bad code. Each
> block explains ❌ what's wrong, 💡 why React Query fixes it, and ✅ what to do.
> This file is only a map so you can track progress.

Run the app: `npm install && npm run dev` — it works fully WITHOUT React Query
(that's the point — you'll feel every problem first, then fix it).

## Order of tasks

| # | File | Concept |
|---|------|---------|
| 0 | `src/main.jsx` | QueryClient, QueryClientProvider, Devtools |
| 1 | `src/pages/ProductListPage.jsx` | useQuery basics: isPending / isError / data |
| 2 | `src/pages/ProductListPage.jsx` | Cache lifecycle: staleTime vs gcTime, refetchOnWindowFocus |
| 3 | `src/pages/ProductListPage.jsx` | Query keys as dependency arrays |
| 4 | `src/pages/ProductListPage.jsx` | Pagination: placeholderData + keepPreviousData |
| 5 | `src/pages/ProductDetailPage.jsx` | Dependent queries: `enabled` |
| 6 | `src/pages/ProductDetailPage.jsx` | initialData vs placeholderData (seeding from another query) |
| 7 | `src/components/ProductCard.jsx` | Prefetching on hover: prefetchQuery |
| 8 | `src/pages/SearchPage.jsx` | Conditional fetch, debouncing, race conditions, isFetching vs isPending |
| 9 | `src/pages/CartPage.jsx` | useMutation + invalidateQueries |
| 10 | `src/pages/CartPage.jsx` | Optimistic updates: onMutate / cancelQueries / rollback / onSettled |
| 11 | `src/pages/OrderStatusPage.jsx` | Polling: refetchInterval (function form, stop-when-done) |
| 12 | `src/pages/OrderStatusPage.jsx` | Retries, retryDelay, global defaultOptions |
| 13 | `src/pages/ReviewsPage.jsx` | useInfiniteQuery: getNextPageParam, fetchNextPage, hasNextPage |
| 14 | `src/pages/DashboardPage.jsx` | Parallel queries, useQueries, request deduplication |
| 15 | `src/pages/DashboardPage.jsx` | `select` (derived data + render optimization) |
| 16 | `src/pages/DashboardPage.jsx` (comment) | Custom hooks + query-key factories |

## Ground rules while doing tasks

- **Server state → React Query. Client state (inputs, toggles) → useState.**
  Don't migrate the search input box or the page counter itself.
- Keep the React Query **Devtools open for every task** — watch entries go
  fresh → stale → inactive → gone.
- After each task, delete the dead useState/useEffect. The victory condition
  for the whole course: **zero data-fetching useEffects left in the app.**

## Checking yourself

Each task's comment contains the target code shape. If stuck, the official
docs map 1:1: tanstack.com/query/latest → "Guides & Concepts" (each task name
matches a guide page: Queries, Query Keys, Caching, Paginated Queries,
Dependent Queries, Placeholder Query Data, Prefetching, Disabling Queries,
Mutations, Invalidation, Optimistic Updates, Important Defaults, Infinite
Queries, Parallel Queries, Render Optimizations).
