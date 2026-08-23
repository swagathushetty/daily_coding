// ============================================================================
// 📝 TASK 24 — THE MEMORY LEAK. Do NOT read this file to "solve" it.
//             Find it the way you would in production — from the outside.
// ============================================================================
// The symptom: under sustained traffic, this process's memory climbs and
// NEVER comes back down, even when traffic stops. Eventually the OOM killer
// (or a container memory limit) kills it. Restart "fixes" it for a while.
// This is the single most common prod incident on-call engineers handle.
//
// ✅ YOUR DIAGNOSIS TASK (this IS the skill — practice the process, not the
//    answer):
//   1. OBSERVE: add a line that logs process.memoryUsage().heapUsed every
//      5s (or scrape Task 29's /metrics). Then pound the server:
//        npx autocannon -c 50 -d 60 localhost:3000/products
//      Watch heapUsed climb. Stop the load. Does it drop? (No → leak, not
//      just churn.) Force GC to be sure: run node with --expose-gc and call
//      global.gc() — a real leak survives a forced collection.
//   2. CAPTURE: start with  node --inspect src/server.js , open
//      chrome://inspect → Memory. Take a heap snapshot, apply load, take a
//      second snapshot, then "Comparison" view sorted by delta. The
//      retained objects that keep growing point at the culprit's shape.
//   3. TRACE the retainers: the snapshot shows WHAT is retained and the
//      retention path (WHO holds the reference). Follow it to this module.
//   4. Alternative tooling to try: clinic.js doctor / heapprofiler; the
//      'why is this retained' path is the same idea.
//
// 💡 THE UNDERLYING BUG PATTERN (general lesson, applies to your own code):
//    a module-scoped collection that only ever GROWS. Common real forms:
//      - an in-memory cache/Map with no eviction and no TTL (unbounded keys)
//      - pushing to a module-level array on every request "for analytics"
//      - registering event listeners / setInterval per request without
//        cleanup (EventEmitter leak — Node even warns at 11 listeners)
//      - closures captured by long-lived timers holding big request objects
//
// ✅ THE FIX (once you've FOUND it via snapshots, not by reading ahead):
//    bound it. Options and their tradeoffs, be able to argue one:
//      - LRU cache with a max size (e.g. lru-cache) — bounded memory
//      - a TTL so entries expire
//      - move the state OUT of the process into Redis (also fixes the
//        multi-instance problem from Task 9/13 — notice the theme:
//        per-process mutable state is the root of many scaling bugs)
//      - if it's truly just metrics, aggregate to counters, don't retain rows
// ============================================================================

const requestLog = [] // 🐛 grows forever, one entry per request, never trimmed

export function analytics(req, _res, next) {
  requestLog.push({
    at: Date.now(),
    method: req.method,
    url: req.url,
    headers: req.headers, // 🐛 retains the whole header object per request too
  })
  next()
}
