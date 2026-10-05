import { Router } from 'express'
import multer from 'multer'
import { importQueue } from '../queue.js'

const router = Router()

// ============================================================================
// 📝 TASK 19 — Streaming upload: don't buffer a 500MB file into RAM
// ============================================================================
// ❌ PROBLEM: multer.memoryStorage() holds the ENTIRE uploaded file in a
//    Buffer in memory. One 500MB upload = 500MB RSS; 10 concurrent = OOM.
//    (Same disease as Task 18, inbound.) REPRODUCE: generate a big CSV
//    (npm run sample-csv makes one) and upload it while watching RSS.
//
// 💡 FIX: stream the request body straight to disk (or object storage) as it
//    arrives — never materialize it whole.
//    - Quick win: multer.diskStorage({ dest }) — streams to a temp file.
//    - Better/lower-level: busboy (installed) — pipe the file stream to
//      fs.createWriteStream via pipeline(); gives you true control and lets
//      you enforce a size limit MID-STREAM (abort at N bytes instead of
//      discovering it after buffering everything).
//
// 📝 TASK 25 — Upload SECURITY hardening (do together with Task 19):
//    a) SIZE LIMIT before consuming: multer { limits: { fileSize } } /
//       busboy limits → reject early with 413, don't read the whole body.
//    b) TYPE by MAGIC BYTES, not extension: "orders.csv" can be an .exe.
//       Sniff the first bytes (or a lib) — don't trust req.file.mimetype
//       (client-controlled) or the extension.
//    c) FILENAME sanitization: a name like "../../etc/cron.d/pwn" is a path
//       traversal. NEVER use the client filename for the stored path —
//       generate your own (uuid) and store the original only as metadata.
//    d) Store uploads OUTSIDE any statically-served/executable dir.
//    e) Awareness: zip/CSV bombs (tiny file, enormous when expanded) — cap
//       ROWS processed in the worker, not just bytes uploaded.
//
// ============================================================================
// 📝 TASK 20 — Don't do heavy work in the request: enqueue it
// ============================================================================
// ❌ PROBLEM: even after streaming to disk, this handler currently PARSES and
//    INSERTS all rows inline (see below) — a 200k-row upload holds the HTTP
//    connection for minutes, ties up a socket, and (Task 1!) hogs CPU.
//    Clients time out and RETRY, making it worse.
// 💡 THE PATTERN (this is how every real bulk-import works):
//    1. Stream file to disk (Task 19), do only CHEAP validation.
//    2. importQueue.add('import', { filePath, jobMeta }) — enqueue.
//    3. Respond 202 Accepted immediately with a jobId. The request is DONE
//       in milliseconds.
//    4. A separate worker process (src/workers/import-worker.js, Task 21)
//       does the slow work. The client polls GET /jobs/:id (Task 22) or gets
//       pushed progress (Task 23).
// 🤔 IDEMPOTENCY (they'll ask): user double-clicks / retries → same file
//    imported twice. Defend with a client-supplied idempotency key or a hash
//    of the file as the jobId (BullMQ dedupes by job id). Discuss.
// ============================================================================
const upload = multer({ storage: multer.memoryStorage() }) // 🐛 whole file in RAM

router.post('/orders', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'no file' })

  // 🐛 TASK 20: parsing + inserting inline, blocking the request for minutes.
  // (Replace this whole block with: write to disk → importQueue.add → 202.)
  const text = req.file.buffer.toString('utf8') // 🐛 also assumes it fits in RAM
  const lines = text.split('\n').filter(Boolean)
  let inserted = 0
  for (const line of lines.slice(1)) {
    const [productId, totalCents] = line.split(',')
    if (productId && totalCents) inserted++ // (pretend DB insert per row)
  }

  res.json({ inserted, note: 'TASK 20: this should be a 202 + queued job' })
})

export default router
