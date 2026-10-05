import { Router } from 'express'
import { query } from '../db.js'
import { redis } from '../redis.js'

const router = Router()

// ============================================================================
// 📝 TASK 5 — N+1 queries (this belongs to the DB course too, but the
//             connection/latency cost is a server lesson)
// ============================================================================
// ❌ PROBLEM: /products/with-orders makes 1 query for products, then 1 MORE
//    query PER product for its order count. 50 products = 51 round trips,
//    each paying network + (currently, pre-Task-6) a new connection. Watch
//    the Task 28 request log explode, or count with the pg log.
// 💡 FIX: a single JOIN + GROUP BY. (The deep dive — indexes, EXPLAIN,
//    keyset pagination — is the upcoming DB course; here just kill the N+1
//    and feel the latency drop.)
// ✅ YOUR TASK: rewrite as one query with LEFT JOIN orders ... GROUP BY.
// ============================================================================
router.get('/with-orders', async (_req, res) => {
  const { rows: products } = await query('SELECT id, name FROM products LIMIT 50')
  for (const p of products) {
    const { rows } = await query(
      'SELECT COUNT(*)::int AS c FROM orders WHERE product_id = $1',
      [p.id],
    ) // 🐛 N+1
    p.orderCount = rows[0].c
  }
  res.json(products)
})

// ============================================================================
// 📝 TASK 9 — Caching arc: no cache → in-memory → Redis → stampede
// ============================================================================
// This is a multi-step tier. Do the parts in order, load testing each.
//
// ❌ PART 0 (current): every hit runs the full query. autocannon it, note
//    req/s and the DB load.
//
// 💡 PART A — naive in-memory cache:
//    const cache = new Map(); check it, set it with a timestamp for TTL.
//    Re-test → huge req/s jump. THEN: run TWO instances (Task 13) behind
//    nginx and curl repeatedly → you get STALE/'inconsistent answers from
//    different PIDs. Lesson: in-process cache doesn't survive horizontal
//    scaling. (Also: an unbounded Map is Task 24's cousin — a memory leak.)
//
// 💡 PART B — Redis cache-aside (the standard pattern):
//    key 'products:top'; GET → hit? return. miss? query, SETEX with a TTL,
//    return. Now all instances share one cache. This is 90% of real caching.
//
// 💡 PART C — invalidation: POST /products (below) must bust the cache.
//    "There are only two hard things…" — decide: delete the key, or write
//    -through? Do delete-on-write and discuss the race it opens.
//
// 💡 PART D — 📝 CACHE STAMPEDE (the senior differentiator):
//    Simulate: FLUSH the key, then fire 500 concurrent requests
//    (autocannon -c 500). They ALL miss simultaneously and hammer the DB —
//    the cache didn't protect you at the worst moment. Fixes to implement/
//    discuss: (1) a short lock (SET NX) so one request repopulates while
//    others wait/serve stale; (2) 'stale-while-revalidate'; (3) jittered
//    TTLs so keys don't all expire at once. Reproduce the DB spike, then
//    show the lock flattening it.
// ============================================================================
router.get('/top', async (_req, res) => {
  const { rows } = await query(
    'SELECT id, name, price_cents FROM products ORDER BY rating DESC LIMIT 20',
  )
  res.json(rows)
})

router.get('/', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100)
  const { rows } = await query(
    'SELECT id, name, price_cents, rating FROM products ORDER BY id LIMIT $1',
    [limit],
  )
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { name, priceCents } = req.body ?? {}
  const { rows } = await query(
    'INSERT INTO products (name, price_cents, rating) VALUES ($1, $2, 0) RETURNING id',
    [name, priceCents],
  )
  // TASK 9 PART C: invalidate 'products:top' / 'products:*' here once cached.
  res.status(201).json({ id: rows[0].id })
})

export default router
