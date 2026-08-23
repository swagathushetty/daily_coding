# SwiftCart Microservices — Learn Microservices by Evolving a Distributed Monolith

A hands-on companion to Sam Newman's **_Building Microservices_ (2nd ed)**. The
system starts as a deliberately-wrong **distributed monolith** (services sharing
one database, synchronous unprotected calls, no sagas, no resilience) and you
evolve it into real microservices one tier per chapter — feeling *why* each
pattern exists because you first lived without it.

Every problem is a numbered `📝 TASK` comment in the code (❌ what's wrong →
💡 the concept → ✅ what to do). `TASKS.md` is the index, `DECISIONS.md` is your
tradeoff log (the key interview artifact), `CONCEPTS.md` covers the
non-code chapters.

## Stack

Java 21 · Spring Boot 3 · Spring Cloud · Postgres · Redis · Kafka · Spring
Cloud Gateway · Jaeger/OpenTelemetry · Docker Compose. Multi-module Maven
monorepo (one `./mvnw`).

## Services

| Service | Port | Role |
|---|---|---|
| gateway | 8080 | API gateway / front door |
| catalog-service | 8081 | products (the clean reference service) |
| order-service | 8082 | orders — the orchestrator you evolve the most |
| payment-service | 8083 | payments (has a deterministic decline path) |
| notification-service | 8084 | notifications (sync now → async event later) |

## Quick start

```bash
docker compose up -d postgres     # tier 2 needs only postgres (tiers 5+: `up -d` all)
./mvnw -pl services/catalog-service      spring-boot:run
./mvnw -pl services/payment-service      spring-boot:run
./mvnw -pl services/notification-service spring-boot:run
./mvnw -pl services/order-service        spring-boot:run
```

```bash
curl localhost:8081/products
curl -X POST localhost:8082/orders -H 'content-type: application/json' -d '{"productId":1,"quantity":2}'
```

Then open `TASKS.md` and start at tier 1. Build verified: all six modules
compile and the tier-2 flow runs end to end.

## Putting this on your CV

Legitimate — under **Projects**, framed honestly as a learning build. Its value
comes from *you owning it*: keep `DECISIONS.md` current, run it, and be able to
explain every pattern from scratch (interviewers drill CV projects hard). List
only patterns you can whiteboard without the code in front of you.
