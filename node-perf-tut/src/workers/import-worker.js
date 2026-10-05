import { Worker } from 'bullmq'
import { connection } from '../queue.js'

// ============================================================================
// 📝 TASK 21 — The worker: stream-parse the file, batch-insert, report progress
//             Run as its OWN process:  npm run worker
// ============================================================================
// This consumes 'imports' jobs. It must NOT repeat the server's sins.
//
// 💡 STREAM-PARSE, don't readFile (Task 18/19's lesson, worker-side):
//    fs.createReadStream(filePath) → a streaming CSV parser (csv-parse, or
//    exceljs's streaming reader for real .xlsx) → process row by row. If you
//    readFileSync a 500MB file here, you just moved the OOM from the web tier
//    to the worker. Same bug, new address.
//
// 💡 BATCH INSERTS, don't insert per row:
//    Buffer ~1000 rows, do ONE multi-row INSERT, repeat. Per-row inserts over
//    200k rows = 200k round trips (Task 5's N+1 in loop form). Use a pooled
//    client; for max speed discuss COPY.
//
// 💡 PROGRESS: await job.updateProgress({ processed, total, failed }) every
//    batch. BullMQ persists it → polling (Task 22) sees it. ALSO publish to
//    Redis pub/sub so SSE/WS (Tasks 22/23) can push it live.
//
// 💡 PARTIAL FAILURE: row 5,000 is malformed — do you abort all 200k, or
//    collect errors and continue? (Usually: continue, report a failed-rows
//    summary. Decide and defend. Wrap each batch so one bad row ≠ whole job.)
//
// 💡 CONCURRENCY: the { concurrency } option below is the "max N jobs at once"
//    lever. Too high → you overwhelm Postgres (ties back to pool sizing,
//    Task 6). Tune it against your pool.
//
// 🤔 IDEMPOTENCY / retries: if the worker crashes at row 150k and BullMQ
//    retries the job, do rows 1-150k get inserted twice? Design for re-run
//    safety (upsert / staging table / track offset). This is the hardest and
//    most-asked part of bulk import — have an answer.
//
// ✅ YOUR TASK: implement the processor below per the notes. For now it's a
//    stub that just simulates progress so the pipeline is wired end-to-end.
// ============================================================================

const worker = new Worker(
  'imports',
  async (job) => {
    const { filePath } = job.data
    // STUB — replace with streaming parse + batch insert.
    const total = 100
    for (let processed = 0; processed <= total; processed += 10) {
      await job.updateProgress({ processed, total, failed: 0 })
      await new Promise((r) => setTimeout(r, 200)) // pretend work
    }
    return { filePath, processed: total }
  },
  { connection, concurrency: 2 },
)

worker.on('completed', (job) => console.log(`job ${job.id} done`))
worker.on('failed', (job, err) => console.log(`job ${job?.id} failed:`, err.message))

// 📝 TASK 26 — the worker needs graceful shutdown TOO (Task 8's sibling):
//    process.on('SIGTERM', async () => { await worker.close(); process.exit(0) })
//    Otherwise a deploy kills a job mid-flight → half-imported file. worker
//    .close() lets the current job finish (or requeues it) first.
console.log('import worker started, waiting for jobs…')
