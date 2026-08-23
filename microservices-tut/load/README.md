# Load & chaos tests — TIER 6 (Resiliency)

Empty on purpose. This is where **tier 6** verification goes (Newman Ch 12):
scripts that PROVE your resiliency patterns work, not just that they compile.

Ideas to add when you get there:
- A load script (k6/autocannon) against `POST /orders` while you kill or slow
  `payment-service` — watch order-service's circuit breaker OPEN, fall back,
  then close as payment recovers.
- A "chaos" run: inject latency/500s in payment (the tier-6 task adds the
  toggle), and record throughput/error-rate before vs after adding timeouts +
  retries + bulkheads.
- Record the before/after numbers here — that comparison is the deliverable,
  same measure-first rule as the node-perf-tut course.
