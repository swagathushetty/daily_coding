import fs from 'node:fs'

// Generates a big orders CSV for the upload tasks (19, 20, 21, 25).
// Uses a WRITE STREAM (not a giant string) — practicing what Task 18/19 preach.
//   node seed/make-sample-csv.js            → 200k rows
//   ROWS=1000000 node seed/make-sample-csv.js
const ROWS = Number(process.env.ROWS || 200_000)
const out = fs.createWriteStream(new URL('./sample-orders.csv', import.meta.url))

out.write('product_id,total_cents\n')
let i = 0
function writeChunk() {
  let ok = true
  while (i < ROWS && ok) {
    i++
    ok = out.write(`${1 + (i % 200)},${50 + (i % 90000)}\n`)
  }
  if (i < ROWS) out.once('drain', writeChunk) // respect backpressure!
  else out.end(() => console.log(`wrote ${ROWS} rows to sample-orders.csv`))
}
writeChunk()
