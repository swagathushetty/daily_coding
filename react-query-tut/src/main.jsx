import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

// ============================================================================
// 📝 TASK 0 — Set up React Query (concept: QueryClient + QueryClientProvider)
// ============================================================================
// ❌ CURRENT PROBLEM:
//    There is no cache in this app at all. Every component owns its own
//    fetched data in useState. Nothing is shared, nothing survives unmount,
//    and the same URLs get re-fetched over and over as you navigate around.
//
// 💡 WHY REACT QUERY:
//    React Query gives you ONE app-wide cache (the QueryClient). Components
//    subscribe to cache entries via query keys instead of owning data.
//
// ✅ YOUR TASK:
//    1. npm i is already done — @tanstack/react-query is in package.json.
//    2. Create a QueryClient here:  const queryClient = new QueryClient()
//    3. Wrap <App /> in <QueryClientProvider client={queryClient}>.
//    4. Also render <ReactQueryDevtools initialIsOpen={false} /> inside the
//       provider (from '@tanstack/react-query-devtools') — you'll use the
//       devtools panel in EVERY later task to watch cache entries go
//       fresh → stale → inactive → garbage-collected.
//    5. (Later, Task 12) pass defaultOptions to the QueryClient to tune
//       retries and staleTime globally.
// ============================================================================


const queryClient = new QueryClient()
window.__TANSTACK_QUERY_CLIENT__ = queryClient

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
     
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
          <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
