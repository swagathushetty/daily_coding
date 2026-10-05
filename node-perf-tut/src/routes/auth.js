import { Router } from 'express'
import crypto from 'node:crypto'
import { query } from '../db.js'

const router = Router()

// ============================================================================
// 📝 TASK 2 — ReDoS: a regex that can freeze your server
//             (security bug wearing an event-loop costume)
// ============================================================================
// ❌ The email regex below has CATASTROPHIC BACKTRACKING: nested quantifiers
//    ( ([...]+)+ ) make the engine try exponentially many paths on a
//    NON-matching input. Regex runs on the main thread → one crafted request
//    freezes the whole server. Try it (takes ~seconds, grows exponentially —
//    add one more 'a' and it doubles):
//      curl -X POST localhost:3000/auth/register -H 'content-type: application/json' \
//        -d '{"email":"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!","password":"x"}'
//    Run the Task 1 reproduction in parallel to watch everyone else starve.
//
// 💡 FIXES (know all three):
//    1. Never write clever regexes for emails — /^[^\s@]+@[^\s@]+\.[^\s@]+$/
//       is linear and fine (real validation happens via confirmation email).
//    2. Length-check BEFORE regexing (an email > 254 chars is invalid anyway
//       — reject in O(1) before the regex ever runs).
//    3. Ecosystem answer: validator libs (zod etc.) — or RE2 (linear-time
//       regex engine) for user-supplied patterns.
// ============================================================================
const EMAIL_RE = /^([a-zA-Z0-9._-]+)+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/ // 🐛

// ============================================================================
// 📝 TASK 4 — The hidden threads Node already has: the libuv threadpool
// ============================================================================
// GOOD NEWS: this login handler uses the ASYNC pbkdf2 — the event loop stays
// free (verify: the Task 1 reproduction doesn't die against /auth/login).
// ❌ BUT: load test it —  npx autocannon -c 32 -d 15 \
//      -m POST -H 'content-type: application/json' \
//      -b '{"email":"user1@shop.com","password":"pw1"}' localhost:3000/auth/login
//    Throughput plateaus around ~4 concurrent hashes no matter what. WHY?
//    Async crypto/zlib/fs/dns don't run on the event loop — they run on the
//    libuv THREADPOOL, which defaults to 4 THREADS TOTAL per process.
//    Request #5's hash waits in a queue behind the first four.
// ✅ YOUR TASK: UV_THREADPOOL_SIZE=16 npm run dev  → re-run the exact same
//    load test → throughput roughly quadruples. One env var.
// 🤔 DISCUSS: what's the ceiling on raising it? (real threads: memory + ctx
//    switching; size ≈ cores for CPU-ish work). And the interview
//    distinction you now own: event loop (network I/O via epoll — no threads)
//    vs threadpool (fs/crypto/zlib/dns) vs worker_threads (your JS, Task 3)
//    vs cluster (whole processes, Task 13).
// ============================================================================
router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) return res.status(400).json({ error: 'missing creds' })

  const { rows } = await query(
    'SELECT id, password_hash, salt FROM users WHERE email = $1',
    [email],
  )
  if (rows.length === 0) return res.status(401).json({ error: 'bad creds' })

  const user = rows[0]
  crypto.pbkdf2(password, user.salt, 100_000, 64, 'sha512', (err, derived) => {
    if (err) return res.status(500).json({ error: 'hash failed' })
    if (derived.toString('hex') !== user.password_hash)
      return res.status(401).json({ error: 'bad creds' })

    // ========================================================================
    // 📝 TASK 27 (part 1) — the planted crash: fire-and-forget async
    // ========================================================================
    // This "non-critical" audit log is async with NO await and NO .catch().
    // If it ever rejects (DB restart, pool exhausted…), that's an UNHANDLED
    // REJECTION — which KILLS the whole process on modern Node. One flaky
    // insert = your server dies mid-traffic. This exact pattern ships to
    // prod constantly ("it's just logging, don't block on it").
    // REPRODUCE: log in once while Postgres is stopped:
    //   docker compose stop postgres   (watch the process exit code)
    // ✅ FIX: .catch((e) => log.warn(e)) — fire-and-forget REQUIRES a catch.
    //   Then do TASK 27 part 2 in server.js (process-level nets).
    // ========================================================================
    logLoginEvent(user.id) // 🐛 no await, no catch

    res.json({ ok: true, userId: user.id })
  })
})

async function logLoginEvent(userId) {
  await query('INSERT INTO login_events (user_id) VALUES ($1)', [userId])
}

router.post('/register', async (req, res) => {
  const { email, password } = req.body ?? {}
  if (!email || !password) return res.status(400).json({ error: 'missing creds' })

  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'bad email' }) // 🐛 ReDoS

  const salt = crypto.randomBytes(16).toString('hex')
  crypto.pbkdf2(password, salt, 100_000, 64, 'sha512', async (err, derived) => {
    if (err) return res.status(500).json({ error: 'hash failed' })
    try {
      const { rows } = await query(
        'INSERT INTO users (email, password_hash, salt) VALUES ($1, $2, $3) RETURNING id',
        [email, derived.toString('hex'), salt],
      )
      res.status(201).json({ id: rows[0].id })
    } catch {
      res.status(409).json({ error: 'email exists' })
    }
  })
})

export default router
