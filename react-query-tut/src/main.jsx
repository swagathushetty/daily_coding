import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'


const queryClient = new QueryClient({
       defaultOptions: {
         queries: {
           staleTime: 30_000,
           retry: (failureCount, error) =>
             error.message.includes('404') ? false : failureCount < 3,
         },                     // ↑ don't retry 404s — they'll never heal
       },
     })
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
