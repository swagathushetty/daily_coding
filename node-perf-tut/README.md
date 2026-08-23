# SwiftCart API 🛒 — Learn Node at Scale by Fixing a Janky Server

A deliberately unscalable Express API (Postgres + Redis + nginx via
docker-compose). Every real-world scaling and reliability problem is present,
reproducible under load, and annotated with a numbered `📝 TASK` comment
(❌ what's wrong → 💡 the concept → ✅ what to do). `TASKS.md` is the index.

**The whole method is measure → break → fix → re-measure.** Start with
`load/README.md` (Task 0).

## What it covers

Event-loop blocking · ReDoS · worker_threads · libuv threadpool · cluster ·
connection pooling · timeouts & graceful shutdown · Redis caching &
stampede · nginx reverse proxy / load balancing / compression / rate limiting ·
streaming huge downloads & uploads with backpressure · BullMQ job queue ·
polling vs SSE vs WebSocket (+ scaling WS with Redis pub/sub) · finding a
memory leak from heap snapshots · crash safety · structured logging ·
health checks & Prometheus metrics.

## Prerequisites

- Docker (for Postgres, Redis, nginx)
- Node 20+
- Optional: k6 (scripted load), Chrome (heap snapshots), clinic.js

## Quick start

```bash
docker compose up -d
npm install
npm run seed        # ~500k orders — see seed for ORDER_COUNT tuning
npm run dev         # http://localhost:3000  (nginx: http://localhost:8080)
```

Then open `TASKS.md` and go down the list. Login test user after seeding:
`user1@shop.com` / `pw1`.

## Companion courses (planned, same style)

- **DB / query optimization** — indexes, EXPLAIN ANALYZE, keyset pagination.
- **Application security** — OWASP top 10, auth/JWT/sessions, CSRF/XSS.
```
