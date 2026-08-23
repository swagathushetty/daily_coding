# Node at Scale — Task Index (SwiftCart API)

> The course lives in the code as numbered `📝 TASK` comments (❌ problem →
> 💡 concept → ✅ fix), each reproducible with a load test. This is the map.
> **Iron rule (Task 0, `load/README.md`): measure before AND after every fix.**

## Setup

```bash
docker compose up -d          # postgres + redis + nginx
npm install
npm run seed                  # products, users, 500k orders (ORDER_COUNT=… to tune)
npm run dev                   # API on :3000    (nginx proxies :8080)
npm run worker                # BullMQ worker (separate process, from Task 21)
npm run sample-csv            # big CSV for upload tasks
```

## Tiers

### Tier 1 — The event loop (Node's defining topic)
| # | File | Concept |
|---|------|---------|
| 1 | `routes/report.js` | Blocking the event loop: sync crypto, hot loops, `JSON.stringify` |
| 2 | `routes/auth.js` | ReDoS — a regex that freezes the server (security × event loop) |

### Tier 2 — Multithreading (the 4-way distinction interviews probe)
| # | File | Concept |
|---|------|---------|
| 3 | `routes/report.js` | `worker_threads` (Piscina) for CPU-bound JS |
| 4 | `routes/auth.js` | The libuv **threadpool** & `UV_THREADPOOL_SIZE` |
| 13 | `server.js` | `cluster` / multi-process / PM2 — use all cores |

### Tier 3 — Connection management
| # | File | Concept |
|---|------|---------|
| 5 | `routes/products.js` | N+1 queries (latency cost; deep dive → DB course) |
| 6 | `db.js` | **Connection pooling** & pool sizing math |
| 7 | `db.js` + export/worker | Pool checkout/**release** in `finally` (leak) |
| 8 | `server.js` | Timeouts + **graceful shutdown** (SIGTERM drain) |

### Tier 4 — Caching arc
| # | File | Concept |
|---|------|---------|
| 9 | `routes/products.js` | No cache → in-memory → **Redis cache-aside** → invalidation → **stampede** |

### Tier 5 — nginx (reverse proxy)
| # | File | Concept |
|---|------|---------|
| 14 | `nginx/nginx.conf` | Reverse proxy + upstream load balancing + passive health checks |
| 15 | `nginx/nginx.conf` | Compression: Node middleware vs nginx (CPU placement) |
| 16 | `nginx/nginx.conf` | Rate limiting at the edge (+ app-layer discussion) |
| 17 | `nginx/nginx.conf` | Serving static files from nginx, not Node |

### Tier 6 — Streams (your two real-world scenarios)
| # | File | Concept |
|---|------|---------|
| 18 | `routes/export.js` (+ nginx 18b) | **Download**: DB cursor → CSV → gzip → response, backpressure, `proxy_buffering` |
| 19 | `routes/upload.js` | **Upload**: stream body to disk, don't buffer in RAM |
| 25 | `routes/upload.js` | Upload **security**: size limit, magic bytes, path traversal, bombs |

### Tier 7 — Queues & realtime (the capstone)
| # | File | Concept |
|---|------|---------|
| 20 | `routes/upload.js` | Enqueue heavy work, respond **202**; idempotency |
| 21 | `workers/import-worker.js` | Worker: stream-parse, **batch insert**, progress, partial failure, concurrency |
| 22 | `routes/jobs.js` | Progress: **polling → SSE** (and when NOT to use WebSocket) |
| 23 | `src/ws.js` (+ nginx 23b) | **WebSocket** dashboard, heartbeats, **Redis pub/sub across instances** |
| 26 | `workers/import-worker.js` | Worker graceful shutdown |

### Tier 8 — Production diagnosis & hygiene (what on-call does daily)
| # | File | Concept |
|---|------|---------|
| 24 | `middleware/analytics.js` | **Memory leak**: find it with heap snapshots (don't read the file!) |
| 27 | `routes/auth.js` + `server.js` | Unhandled rejection **crash**; process-level safety nets |
| 28 | `server.js` | Structured logging (pino), request IDs, correlation |
| 29 | `server.js` | **Health checks** (liveness vs readiness) + Prometheus `/metrics` |

## Suggested order

Straight down: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 13 → 14 → 15 → 16 → 17 →
18 → 19 → 25 → 20 → 21 → 22 → 23 → 26 → 24 → 27 → 28 → 29.
(Tier 8 diagnosis tasks — 24/27/28/29 — you can pull EARLY if you want the
observability tooling in hand while doing everything else. Many people add
logging + metrics + health first in real projects.)

## What "done" looks like (interview-ready)

You can, out loud, explain each of these with the demo that proves it:
- Why one endpoint froze the whole server, and three ways to fix it.
- Event loop vs threadpool vs worker_threads vs cluster — when each.
- Why a new DB connection per request kills you; how to size a pool.
- Cache-aside + the stampede problem + how you flattened the DB spike.
- Streaming a multi-GB export/import at constant memory; what backpressure is.
- Why bulk work goes to a queue; how you made it idempotent.
- Polling vs SSE vs WebSocket, and how you scaled WS across instances.
- How you found a memory leak from a heap snapshot.
- Graceful shutdown, health checks, structured logs — why each matters in prod.
```
