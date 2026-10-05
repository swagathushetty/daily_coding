import { Queue } from 'bullmq'
import { config } from './config.js'

// ============================================================================
// 📝 TASK 20 (support) — the queue definition.
// ============================================================================
// BullMQ needs a raw ioredis-style connection object with
// maxRetriesPerRequest: null (blocking ops can't use a retrying connection).
// The QUEUE (producer) lives with the API; the WORKER (consumer) lives in a
// SEPARATE process (import-worker.js) so slow jobs never touch the web tier.
// That producer/consumer separation is the whole point — you can scale
// workers independently of API instances.
export const connection = {
  host: 'localhost',
  port: 6379,
  maxRetriesPerRequest: null,
}

export const importQueue = new Queue('imports', { connection })

// 🤔 CONFIG worth discussing when you wire jobs (Task 21):
//   - attempts + backoff (retry transient failures; don't retry poison jobs
//     forever — dead-letter after N)
//   - removeOnComplete / removeOnFail (or Redis fills up — a real incident)
//   - concurrency on the Worker (Task 21) — the "max N at once" lever
