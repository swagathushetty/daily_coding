// ============================================================================
// API layer — talks to https://dummyjson.com (a free fake e-commerce API).
// These functions are FINE as-is. React Query does NOT replace fetch —
// it replaces the *state management around* fetch (loading/error/cache/retry).
// You will reuse these exact functions inside useQuery/useMutation.
// ============================================================================

const BASE = 'https://dummyjson.com'

async function http(path, options) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    // Throwing on bad status matters: React Query decides "error state"
    // based on whether the promise rejects. fetch() does NOT reject on 404/500!
    throw new Error(`HTTP ${res.status} on ${path}`)
  }
  return res.json()
}

// --- Products ---------------------------------------------------------------
export const fetchProducts = ({ limit = 12, skip = 0 } = {}) =>
  http(`/products?limit=${limit}&skip=${skip}`)

export const fetchProduct = (id) => http(`/products/${id}`)

export const fetchCategories = () => http(`/products/category-list`)

export const fetchProductsByCategory = (category) =>
  http(`/products/category/${category}?limit=6`)

export const searchProducts = (q) =>
  http(`/products/search?q=${encodeURIComponent(q)}`)

// --- Cart (dummyjson simulates writes — nothing is really persisted) --------
export const fetchCart = (cartId = 1) => http(`/carts/${cartId}`)

export const addToCart = (productId, quantity = 1) =>
  http(`/carts/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: 1, products: [{ id: productId, quantity }] }),
  })

export const updateCart = (cartId, products) =>
  http(`/carts/${cartId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ merge: false, products }),
  })

// --- "Orders" (we reuse the todos endpoint to fake an order status feed) ----
export const fetchOrderStatus = (orderId = 1) => http(`/todos/${orderId}`)

// --- Reviews (we reuse comments as product reviews, paginated) --------------
export const fetchReviews = ({ limit = 10, skip = 0 } = {}) =>
  http(`/comments?limit=${limit}&skip=${skip}`)

// --- User profile ------------------------------------------------------------
export const fetchUser = (id = 1) => http(`/users/${id}`)
