import { Router } from 'express'
import crypto from 'node:crypto'
import { query } from '../db.js'

const router = Router()

// ============================================================================
// 📝 TASK 1 — THE Node lesson: one blocked event loop starves EVERYONE
// ============================================================================
// ❌ REPRODUCE FIRST (this demo is unforgettable):
//    Terminal A:  npx autocannon -c 10 -d 15 localhost:3000/products
//    Terminal B (mid-test):  curl localhost:3000/report/sales
//    → watch Terminal A's req/s fall off a CLIFF to ~0. ONE request froze
//    the entire server, because this handler runs CPU work on the one thread
//    that must also accept sockets, parse requests, and run every callback.
//
// The three sins below, in ascending subtlety:
//   sin #1: crypto.pbkdf2Sync — sync crypto blocks for its entire runtime
//   sin #2: a giant hot loop — pure CPU in JS blocks just the same
//   sin #3: JSON.stringify of a huge object — ALSO sync CPU! (people forget
//           serialization; it's a classic hidden blocker on big responses)
//
// 💡 FIXES, in order of preference — do each, measure each:
//   1. Don't do the work per-request (precompute/cache — this report changes
//      hourly at best; tie in with the caching tier later).
//   2. Make blocking APIs async: crypto.pbkdf2 (callback version) runs on the
//      libuv THREADPOOL, off the main thread (→ Task 4 explores that pool).
//   3. For unavoidable CPU-in-JS: 📝 TASK 3 — move it to a worker_thread.
//      Piscina is installed: create a piscina pool over a worker file that
//      does the loop + stringify, and `await pool.run(params)` here.
//      Re-run the reproduction: Terminal A barely notices now.
// 🤔 DISCUSS: why is a worker POOL important vs `new Worker()` per request?
//    (thread spawn ~ms + memory per thread; unbounded threads = self-DoS)
// ============================================================================
router.get('/sales', async (_req, res) => {
  const { rows } = await query('SELECT id, total_cents FROM orders LIMIT 50000')

  // sin #1: sync key derivation ("signing" the report)
  const signature = crypto
    .pbkdf2Sync('report-secret', 'salt', 200_000, 64, 'sha512')
    .toString('hex')

  // sin #2: CPU-heavy aggregation in a hot loop
  let weighted = 0
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < 2_000; j++) weighted += (rows[i].total_cents * j) % 97
  }

  // sin #3: serializing a huge payload is ALSO sync CPU
  const blob = JSON.stringify({ rows, weighted, signature })
  res.type('application/json').send(blob)
})

export default router
