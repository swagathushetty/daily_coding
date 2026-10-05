# SwiftCart Microservices — Task Index (Newman, *Building Microservices* 2e)

> The course lives in the code as `📝 TASK` comments. You start with a working
> **distributed monolith** (the anti-pattern) and evolve it into real
> microservices, one tier per book chapter — feeling why each pattern exists
> because you lived without it. Log every tradeoff in `DECISIONS.md` as you go;
> that log is what makes the project interview-defensible.

## New to Spring? Start with the on-ramp

If Spring Boot itself is unfamiliar (vs. just Java), do **`spring-basics/`
first** — a zero-infra primer (in-memory, no Docker) that teaches
`@SpringBootApplication`, `@RestController/@Service/@Repository`, dependency
injection, REST mappings, and `application.yml`, in the same layered shape the
real services use:

```bash
./mvnw -pl spring-basics spring-boot:run
```

Already comfortable with Spring? Skip it and go straight to the setup below.

## Setup

```bash
docker compose up -d postgres            # tier 2 needs only postgres
# tiers 5+ also need kafka/jaeger:  docker compose up -d

# run each service on your host (dev mode — fast restarts):
./mvnw -pl services/catalog-service      spring-boot:run   # :8081
./mvnw -pl services/payment-service      spring-boot:run   # :8083
./mvnw -pl services/notification-service spring-boot:run   # :8084
./mvnw -pl services/order-service        spring-boot:run   # :8082
./mvnw -pl services/gateway              spring-boot:run   # :8080
```
(First `./mvnw` run downloads Maven + deps. Or open the root `pom.xml` in
IntelliJ, which handles everything.)

Smoke test the starting point:
```bash
curl localhost:8081/products
curl -X POST localhost:8082/orders -H 'content-type: application/json' -d '{"productId":1,"quantity":2}'   # CONFIRMED
curl -X POST localhost:8082/orders -H 'content-type: application/json' -d '{"productId":4,"quantity":4}'   # PAYMENT_FAILED
```

## Tiers → Newman chapters

| Tier | Where | Concept (chapter) |
|---|---|---|
| 1 | `CONCEPTS.md`, DECISIONS #1–2 | Boundaries, DDD, coupling & cohesion (Ch 1–2) |
| 2 | `order-service` (`OrderService.java`) | The distributed-monolith anti-pattern — the 5 sins (Ch 3) |
| 3 | `OrderService`, `gateway` | Communication: REST/OpenFeign, service discovery, API gateway (Ch 4–5) |
| 4 | `ProductPeek.java`, `application.yml`, compose | **Database-per-service** — delete the shared-DB crime (Ch 3–4) |
| 5 | order/payment/notification | **Sagas** + async events (Kafka), idempotency (Ch 6) |
| 6 | `OrderService`, `payment-service` | **Resiliency**: timeouts, retries, bulkheads, circuit breakers (Ch 12) |
| 7 | all `application.yml`, `jaeger` | **Observability**: distributed tracing, metrics, logs (Ch 10) |
| 8 | new test sources | Testing pyramid + **consumer-driven contracts** (Ch 9) |
| 9 | `gateway`, all services | **Security**: edge auth, service-to-service JWT, zero trust (Ch 11) |
| 10 | `k8s/` | Deployment & scaling: containers, k8s, progressive delivery (Ch 8, 13) — optional |
| — | `CONCEPTS.md` | People/org chapters: Conway's Law, org structures, evolutionary architect, UIs (Ch 14–16) |

## The 5 sins of tier 2 (all in `OrderService.createOrder`)

1. Reads/writes catalog's data via the **shared database** (`ProductPeek`)
2. Check-then-act **race** on stock, no transaction across services
3. **Synchronous, unprotected** call to payment (no timeout/retry/breaker)
4. **Temporal coupling** to notifications (sync, inline — should be an event)
5. **No saga / no compensation** — partial failures leak stock & mislead users

You already saw sin 5 live: the expensive order returned `PAYMENT_FAILED` but
stock was still decremented and a notification still sent. That inconsistency
is the motivation for the whole rest of the course.

## Order of tiers

1 → 2 (understand the sins) → 3 → 4 (the pivotal one: real service boundaries)
→ 5 → 6 → 7 → 8 → 9 → 10. Read the conceptual chapters (`CONCEPTS.md`)
alongside — ideally Ch 1–2 before tier 2, Ch 15–16 whenever.
