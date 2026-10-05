import { Routes, Route, NavLink } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import CartPage from './pages/CartPage.jsx'
import OrderStatusPage from './pages/OrderStatusPage.jsx'
import ReviewsPage from './pages/ReviewsPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

// ============================================================================
// ShopSmart 🛒 — an intentionally BADLY-written e-commerce app.
//
// HOW THIS COURSE WORKS:
//   Every page does data fetching the "raw useEffect" way. Each pain point
//   is marked with a numbered `📝 TASK` comment explaining:
//     ❌ what's wrong  →  💡 which React Query concept fixes it  →  ✅ what to do
//
//   Do them roughly in order (Task 0 is in src/main.jsx):
//     Task 0  main.jsx              QueryClient + Provider + Devtools
//     Task 1  ProductListPage       useQuery basics (isPending/isError/data)
//     Task 2  ProductListPage       caching, staleTime vs gcTime
//     Task 3  ProductListPage       query keys as dependency arrays
//     Task 4  ProductListPage       pagination + placeholderData (keepPreviousData)
//     Task 5  ProductDetailPage     dependent queries (`enabled`)
//     Task 6  ProductDetailPage     initialData / placeholderData from cache
//     Task 7  ProductCard           prefetching on hover
//     Task 8  SearchPage            enabled + debouncing + race conditions
//     Task 9  CartPage              useMutation + invalidateQueries
//     Task 10 CartPage              optimistic updates (onMutate/onError/onSettled)
//     Task 11 OrderStatusPage       polling with refetchInterval
//     Task 12 OrderStatusPage       retries + global defaultOptions
//     Task 13 ReviewsPage           useInfiniteQuery (infinite scroll)
//     Task 14 DashboardPage         parallel queries + useQueries
//     Task 15 DashboardPage         the `select` option (data transformation)
//     Task 16 everywhere            extract custom hooks (useProducts, useCart…)
// ============================================================================

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>🛒 ShopSmart</h1>
        <nav>
          <NavLink to="/">Products</NavLink>
          <NavLink to="/search">Search</NavLink>
          <NavLink to="/cart">Cart</NavLink>
          <NavLink to="/orders">Order Status</NavLink>
          <NavLink to="/reviews">Reviews</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/orders" element={<OrderStatusPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </div>
  )
}
