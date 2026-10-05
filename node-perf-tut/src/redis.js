import Redis from 'ioredis'
import { config } from './config.js'

// Shared Redis connection for cache (Task 9), rate limiting (Task 16 app-side),
// pub/sub (Task 23), and BullMQ (Tasks 20-22).
// NOTE (worth knowing): BullMQ needs its OWN connections with
// maxRetriesPerRequest: null — a blocking consumer can't share a command
// connection. You'll create those in queue.js.
export const redis = new Redis(config.redisUrl)

redis.on('error', (e) => console.error('redis error', e.message))
