import pg from 'pg'
import { config } from './config.js'

// ============================================================================
// 📝 TASK 6 — One TCP connection per request = death under load
//             (concept: connection pooling)
// ============================================================================
// ❌ CURRENT PROBLEM:
//    Every query() call below creates a BRAND NEW pg Client: TCP handshake +
//    TLS + Postgres auth on EVERY request (~5-20ms of pure overhead), and
//    under load you exhaust Postgres max_connections (default 100) →
//    "sorry, too many clients already" → 500s.
//    PROVE IT: npx autocannon -c 150 -d 10 localhost:3000/products
//    Watch errors appear and throughput crater.
//
// 💡 THE FIX — pg.Pool:
//    const pool = new pg.Pool({ ...config.pg, max: 10 })
//    export const query = (text, params) => pool.query(text, params)
//    The pool keeps `max` warm connections and queues excess requests.
//
// 🤔 SIZING (they WILL ask): bigger is NOT better. Postgres does real work
//    per connection; 10-20 per app instance is typical. Rule of thumb:
//    connections ≈ cores × 2 (per DB), split across instances. Load test
//    max: 5 vs 10 vs 50 and note where it stops helping / starts hurting.
//    Also: 4 instances × max 25 = 100 = the DB's ceiling. Do that math aloud.
//
// ✅ YOUR TASK: switch to a Pool. Re-run the same autocannon → no errors,
//    massively higher req/s. Keep getPoolClient() for transactions (Task 7).
// ============================================================================

export async function query(text, params) {
  const client = new pg.Client(config.pg) // 🐛 new connection per query
  await client.connect()
  try {
    return await client.query(text, params)
  } finally {
    await client.end()
  }
}

// For multi-statement transactions you need a DEDICATED client (a pool
// checkout). Used by Task 7 — which contains a planted bug. After Task 6,
// implement as: export const getPoolClient = () => pool.connect()
export async function getPoolClient() {
  const client = new pg.Client(config.pg)
  await client.connect()
  return client
}
