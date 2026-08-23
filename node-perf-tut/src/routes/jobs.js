import { Router } from 'express'
import { importQueue } from '../queue.js'

const router = Router()

// ============================================================================
// 📝 TASK 22 — Job status: the progress-reporting arc (polling → SSE → WS)
// ============================================================================
// After Task 20 enqueues work, the client needs to know how it's going.
// Build progress reporting THREE ways, in order, and understand the tradeoffs
// — "why did you pick X?" is the interview.
//
// 💡 STAGE 1 — POLLING (this endpoint):
//    Return the job's state + progress from BullMQ:
//      const job = await importQueue.getJob(id)
//      const state = await job.getState()
//      res.json({ id, state, progress: job.progress, ... })
//    Client polls every 1-2s. Simple, works everywhere, stateless (survives
//    Task 13 multi-instance for free). Cons: latency + wasted requests when
//    nothing changed. Fine for a slow import — say so.
//
// 💡 STAGE 2 — SSE (Server-Sent Events), see /jobs/:id/stream below.
//
// 💡 STAGE 3 — WebSocket, see src/ws.js (Task 23).
// ============================================================================
router.get('/:id', async (req, res) => {
  // TASK 22 STAGE 1: implement with importQueue.getJob(req.params.id)
  res.status(501).json({ todo: 'TASK 22: return BullMQ job state + progress' })
})

// ============================================================================
// 📝 TASK 22 STAGE 2 — SSE: pushed progress over plain HTTP
// ============================================================================
// ❌ Polling wastes requests. For ONE-WAY server→client updates, SSE beats
//    WebSocket: it's just HTTP, has AUTO-RECONNECT built in, and needs no
//    protocol upgrade. This is the "know when NOT to use WebSocket" lesson —
//    a killer interview answer.
// ✅ YOUR TASK:
//    res.setHeader('Content-Type', 'text/event-stream')
//    res.setHeader('Cache-Control', 'no-cache')
//    res.setHeader('Connection', 'keep-alive')
//    res.setHeader('X-Accel-Buffering', 'no')   // ← or nginx buffers it (T18b)!
//    Subscribe to job progress (via BullMQ QueueEvents or Redis pub/sub the
//    worker publishes to) and write(`data: ${JSON.stringify(p)}\n\n`) on each
//    tick. Clean up the subscription on req 'close' (client gone → don't leak
//    — echoes Task 24!).
// 🤔 WHEN is WebSocket actually right instead? → when you need the client to
//    send too (pause/cancel the job from the UI), or very high-frequency
//    bidirectional messages. That's Task 23's dashboard.
// ============================================================================
router.get('/:id/stream', async (_req, res) => {
  res.status(501).json({ todo: 'TASK 22 STAGE 2: implement SSE' })
})

export default router
