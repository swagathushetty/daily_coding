import express from 'express'
import { config } from './config.js'
import { analytics } from './middleware/analytics.js'
import productsRouter from './routes/products.js'
import reportRouter from './routes/report.js'
import authRouter from './routes/auth.js'
import exportRouter from './routes/export.js'
import uploadRouter from './routes/upload.js'
import jobsRouter from './routes/jobs.js'

// ============================================================================
// SwiftCart API 🛒 — a deliberately janky Node/Express server.
// TASKS.md is the index; every task lives as a comment above the bad code.
// Iron rule (TASK 0, in load/README.md): load-test BEFORE and AFTER each fix.
// ============================================================================

const app = express()

// 📝 TASK 12a — no body size limit: curl a 2GB JSON body at this and watch
// memory. Fix: express.json({ limit: '100kb' }) — and know WHY the default
// (100kb in Express 4) matters. While here: add helmet() (Task 12b) and look
// at which headers appear on responses afterwards (curl -I).
app.use(express.json({ limit: Infinity })) // 🐛 explicitly disabled the guard

// 📝 TASK 28 — console.log is not production logging.
//    ❌ PROBLEMS: unstructured (can't query "all 500s for user X"), no
//    request IDs (can't correlate the 3 log lines of one request among 1000
//    concurrent ones), and console.log is SYNCHRONOUS to stdout — it can
//    genuinely slow a hot path (load test with/without!).
//    ✅ YOUR TASK: pino + pino-http (already installed). Generate/propagate a
//    request id (uuid or nginx's $request_id header — see nginx.conf), log
//    one structured line per request, child loggers with { reqId } inside
//    handlers. Grep one request's full story from mixed logs to verify.
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`) // 🐛
  next()
})

// 📝 TASK 24 (part 1) — this innocent-looking middleware is a planted memory
// leak. DON'T read it yet. Diagnose first — instructions in TASKS.md tier 8.
app.use(analytics)

// 📝 TASK 17 — Node shoveling static bytes (move to nginx; task in nginx.conf)
app.use('/public', express.static('public'))

app.get('/whoami', (req, res) => {
  res.json({ pid: process.pid, port: config.port })
})

// 📝 TASK 29 — there is NO health endpoint. Ops 101, and every orchestrator
// (k8s, ECS, nginx upstream checks) needs one. Add TWO — and know why two:
//   GET /healthz  (liveness: "process is alive" — return 200, check nothing)
//   GET /readyz   (readiness: "can serve traffic" — ping pg AND redis with a
//                  short timeout; 503 if either fails)
// 🤔 Why must liveness NOT check the DB? (a DB blip would make the
// orchestrator restart perfectly healthy processes — cascading failure)
// Then TASK 29b: expose GET /metrics with prom-client (already installed):
// default metrics + a histogram of request durations. curl it under load.

app.use('/products', productsRouter)
app.use('/report', reportRouter)
app.use('/auth', authRouter)
app.use('/export', exportRouter)
app.use('/import', uploadRouter)
app.use('/jobs', jobsRouter)

// 📝 TASK 27 (part 2) — there are no process-level safety nets. After you've
// found the crash planted in auth.js, add:
//   process.on('unhandledRejection', ...)  → log + rethrow/exit(1)
//   process.on('uncaughtException', ...)   → log + exit(1)  (state is
//                                            corrupt — NEVER keep serving)
// 🤔 Then answer: if the fix is "crash anyway", why add handlers at all?
// (to LOG the reason — and because your process manager restarts you; that's
// the real safety net. Which is Task 13's PM2/cluster territory.)

// ============================================================================
// 📝 TASK 13 — One process = (cores - 1) idle CPUs
// ============================================================================
// ❌ PROBLEM: run `node -e "console.log(require('os').cpus().length)"`. Now
//    load test /auth/login — one core does everything; the rest watch.
// ✅ YOUR TASK (both variants, in order):
//    a) node:cluster right here: primary forks os.cpus().length workers,
//       re-forks on 'exit' (crash resilience — ties into Task 27!).
//    b) Then throw (a) away and run TWO instances the ops way:
//       PORT=3000 npm start & PORT=3001 npm start — and balance them with
//       nginx (Task 14). This is what PM2/k8s do for you in prod.
// 🤔 DISCUSS: which in-process state silently broke when you went
//    multi-instance? (Task 9's in-memory cache, Task 23's WS connections —
//    both get their reckoning later. Statelessness is the price of scaling.)
// ============================================================================

// ============================================================================
// 📝 TASK 8 — No timeouts, no graceful shutdown
// ============================================================================
// ❌ PROBLEMS:
//    1. Default server timeouts are generous-to-infinite: a client that opens
//       a socket and trickles bytes holds it forever (slowloris).
//    2. Ctrl+C mid-load-test = every in-flight request gets a reset. In prod
//       (deploys!) that's dropped orders. SIGTERM should mean "drain".
// ✅ YOUR TASK:
//    1. server.requestTimeout = 30_000; server.headersTimeout = 31_000;
//       server.keepAliveTimeout = 5_000 (and WHY it must be < any LB idle
//       timeout in front of you — the 502-on-keepalive-race war story).
//    2. process.on('SIGTERM'): stop accepting (server.close(cb)), let
//       in-flight finish, close pg pool + redis, THEN exit. Test: start a
//       slow request (/report/sales), `kill -TERM <pid>`, request completes,
//       new requests refused, process exits clean.
// ============================================================================
app.listen(config.port, () => {
  console.log(`SwiftCart API on :${config.port} (pid ${process.pid})`)
})
