import { Router } from 'express'
import { query } from '../db.js'

const router = Router()

// ============================================================================
// 📝 TASK 18 — Streaming a huge export: DB cursor → CSV → gzip → response
//             (the canonical Node streams lesson)
// ============================================================================
// ❌ REPRODUCE THE PROBLEM (visceral — do it):
//    This handler loads ALL orders into a JS array, builds ONE giant string,
//    and sends it. Seed a big table (npm run seed uses 500k orders) then:
//      node --inspect src/server.js   (or log process.memoryUsage().rss)
//      curl -o /dev/null localhost:3000/export/orders.csv
//    Watch RSS spike by hundreds of MB for ONE request. Ten concurrent = OOM.
//    Also note: time-to-first-byte is terrible — the client waits for the
//    ENTIRE result set to be built before a single byte moves.
//
// 💡 THE FIX — a streaming pipeline with near-CONSTANT memory:
//    import QueryStream from 'pg-query-stream'
//    import { pipeline } from 'node:stream/promises'
//    import { Transform } from 'node:stream'
//    import { createGzip } from 'node:zlib'
//
//    const client = await getPoolClient()        // dedicated conn (Task 6/7!)
//    const dbStream = client.query(new QueryStream('SELECT ... FROM orders'))
//    const toCsv = new Transform({
//      objectMode: true,
//      transform(row, _enc, cb) { cb(null, `${row.id},${row.total_cents}\n`) },
//    })
//    res.setHeader('Content-Type', 'text/csv')
//    res.setHeader('Content-Encoding', 'gzip')          // Task 15 tie-in
//    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"')
//    try {
//      await pipeline(dbStream, toCsv, createGzip(), res)  // ← the whole point
//    } finally {
//      client.release()                                    // ALWAYS (Task 7)
//    }
//
// 🤔 WHY pipeline() and not .pipe().pipe()? — pipeline propagates errors and
//    destroys every stream on failure (no leaks). Raw .pipe() leaks the DB
//    cursor if the client disconnects mid-download. This is THE reason
//    pipeline exists — say it.
//
// 💡 BACKPRESSURE, made observable (the concept interviewers love):
//    In the browser, throttle the download to "Slow 3G" and log rows emitted.
//    The DB cursor SLOWS DOWN to match the client — Node isn't buffering
//    500k rows in memory; the pipeline pauses the source when res is full.
//    That automatic pause/resume IS backpressure. Contrast: the current
//    array version has to hold everything because there's no flow control.
//
// 📝 TASK 18b lives in nginx.conf: proxy_buffering defeats this over :8080.
// ============================================================================
router.get('/orders.csv', async (_req, res) => {
  const { rows } = await query('SELECT id, total_cents FROM orders') // 🐛 all in RAM

  let csv = 'id,total_cents\n'
  for (const r of rows) csv += `${r.id},${r.total_cents}\n` // 🐛 one huge string

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"')
  res.send(csv)
})

export default router
