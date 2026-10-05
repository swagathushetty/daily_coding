# Architecture Decision Log

> Fill one entry per real decision AS YOU BUILD. This is the single most
> valuable interview artifact in the project — senior interviewers probe *why*,
> not *what*. For each: the context, the options you weighed, what you chose,
> and the tradeoff you knowingly accepted. Keep them short and honest.
>
> Format (lightweight ADR):
> **Status** · **Context** · **Options** · **Decision** · **Consequences**

---

## ADR 1 — Monorepo (multi-module Maven) vs polyrepo
- **Status:** accepted (course default)
- **Context:** N services, one learner, one machine.
- **Options:** (a) one repo per service (polyrepo), (b) one multi-module Maven repo.
- **Decision:** multi-module monorepo, one parent pom + one Maven wrapper.
- **Consequences:** far less boilerplate and easy to run; BUT a monorepo can
  encourage coupling (shared modules, lockstep releases) — the opposite of
  independent deployability. Mitigation: **no service imports another's module.**
  *Interview note: know when polyrepo is right — many teams, independent release
  cadences, strict ownership boundaries (Newman Ch 7).*

## ADR 2 — Service boundaries (why these four services)
- **Status:** TODO (tier 1)
- **Prompt:** Justify catalog / order / payment / notification as bounded
  contexts. Which type of coupling does each pair have (domain, pass-through,
  common, content)? Where did you deliberately NOT split, and why (avoid
  nano-services)?

## ADR 3 — Broker: Kafka vs RabbitMQ
- **Status:** accepted — **Kafka**
- **Context:** async events for the saga + notifications (tier 5).
- **Decision:** Kafka.
- **Consequences:** interview-standard, great for event streaming/replay;
  heavier to run and reason about than RabbitMQ. *Be able to argue when RabbitMQ
  (or SQS) would be the better fit: simple work queues, per-message ack/retry,
  no replay need.*

## ADR 4 — Stock reservation: sync request/response vs event-driven
- **Status:** TODO (tier 3/5)
- **Prompt:** When order needs stock reserved, is a synchronous
  `POST /products/{id}/reserve` better, or an async `ReserveStock` event? Weigh
  consistency/latency (sync) vs decoupling/resilience (async). What does your
  saga choose and why?

## ADR 5 — Saga style: orchestration vs choreography
- **Status:** TODO (tier 5)
- **Prompt:** Order flow = reserve stock → take payment → confirm, with
  compensations (release stock, refund). Orchestrated (order-service drives) or
  choreographed (services react to each other's events)? State the tradeoff:
  orchestration = visible central logic but a coordinator to own; choreography =
  loose coupling but emergent, hard-to-trace flow. Why did you pick yours?

## ADR 6 — Gateway responsibility boundary
- **Status:** TODO (tier 3/9)
- **Prompt:** What lives in the gateway (routing, auth, rate limiting, CORS)
  and what must NOT (business logic)? How do you keep it from becoming a smart
  monolith / deployment bottleneck?

## ADR 7 — Database-per-service migration
- **Status:** TODO (tier 4)
- **Prompt:** How did you break the shared DB? What data did order-service lose
  direct access to, and how does it get it now (API call vs local read model /
  data duplication)? Any consistency implications you accepted?

## ADR 8 — Resiliency defaults
- **Status:** TODO (tier 6)
- **Prompt:** Your chosen timeout, retry count/backoff, and circuit-breaker
  thresholds for the payment call — and the reasoning. Why retries can be
  DANGEROUS without idempotency. What's your fallback when the breaker is open?

## ADR 9 — Delivery semantics & idempotency
- **Status:** TODO (tier 5)
- **Prompt:** Kafka is at-least-once → consumers can see duplicates. How does
  each consumer dedupe? How does the order endpoint handle client retries
  (idempotency key)?

*(Add more as they come up. An empty "Prompt" entry is a task; fill it in when
you reach that tier.)*
