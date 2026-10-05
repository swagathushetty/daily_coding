# Load Testing — TASK 0: measure before you touch anything

> The iron rule of this whole course. Every fix must be justified by a
> number that moved. Guessing at performance makes things slower.

## Tools

- **autocannon** (installed as a dev dep) — quick HTTP throughput/latency.
  `npx autocannon <opts> <url>`
- **k6** (optional, install separately) — scripted scenarios, ramping load.
  Scripts in `load/*.js` are k6 scripts; run `k6 run load/products.js`.

## Method (do this for EVERY task)

1. Record a BASELINE before the fix: req/s, latency p99, error count.
2. Apply the fix.
3. Re-run the EXACT same command. Compare.
4. Write both numbers in a comment or a notes file. That comparison is the
   deliverable — not just "it feels faster".

## A note on honesty of numbers

- Localhost numbers are NOISY and dev mode ≠ prod. What's valid is the
  RELATIVE change on the same machine, same command, back-to-back. Don't
  quote absolute req/s as if it were production capacity.
- Close other apps. Run each test twice, use the second (warm) run.
- For anything CPU-bound, also watch `htop` / Activity Monitor cores and
  `process.memoryUsage()` — throughput alone hides event-loop starvation and
  memory leaks.

## Handy commands per tier

```bash
# TASK 1 — event loop starvation (run BOTH at once, two terminals)
npx autocannon -c 10 -d 20 localhost:3000/products
curl localhost:3000/report/sales      # watch the autocannon above collapse

# TASK 4 — libuv threadpool ceiling
npx autocannon -c 32 -d 15 -m POST -H 'content-type: application/json' \
  -b '{"email":"user1@shop.com","password":"pw1"}' localhost:3000/auth/login
# then: UV_THREADPOOL_SIZE=16 npm run dev  and re-run

# TASK 6 — connection exhaustion → pooling
npx autocannon -c 150 -d 10 localhost:3000/products

# TASK 9 — caching (and stampede at PART D)
npx autocannon -c 50  -d 10 localhost:3000/products/top   # cache warm/cold
npx autocannon -c 500 -d 5  localhost:3000/products/top   # stampede on cold key

# TASK 16 — rate limit (through nginx)
npx autocannon -c 20 -d 5 -m POST localhost:8080/auth/login  # expect 503s

# TASK 18 — streaming export (watch memory, not req/s)
node --inspect src/server.js
curl -o /dev/null localhost:3000/export/orders.csv   # RSS spike before fix

# TASK 24 — memory leak
npx autocannon -c 50 -d 60 localhost:3000/products    # heapUsed climbs & stays
```
