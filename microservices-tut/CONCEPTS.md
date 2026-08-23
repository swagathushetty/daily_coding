# Concepts Companion — the chapters you can't "run"

> Newman's book is ~half buildable patterns (the tiers in `TASKS.md`) and ~half
> architectural/organizational judgement. Code can't teach the second half, so
> here it is as summaries + interview prompts. Read these alongside the tiers.
> Answer each prompt in your own words — ideally out loud — as if in an interview.

## Ch 1 — What Are Microservices?
Independently deployable services modeled around a business domain, owning their
own state. Key: **independent deployability** is the whole point; if you can't
deploy one without the others, you have a distributed monolith (which is what
this project starts as).
- **Prompt:** Give three concrete costs microservices add over a monolith. When
  is a modular monolith the *right* answer? (Newman: usually start there.)

## Ch 2 — Modeling (DDD)
Bounded contexts, aggregates, ubiquitous language. Good boundaries maximize
**cohesion** inside a service and minimize **coupling** between services.
Coupling types, worst→best: content → common → pass-through → domain.
- **Prompt:** Which coupling does the shared DB in tier 2 create, and why is it
  the worst kind? What is "information hiding" at a service boundary?

## Ch 3 — Splitting the Monolith
Incremental migration; the **Strangler Fig**, **Parallel Run**, **Feature
Toggle** patterns. The monolith is rarely the enemy — big-bang rewrites are.
- **Prompt:** Describe how you'd strangler-fig one capability out of a monolith
  with zero downtime. How do you split the *data*, which is the hard part?

## Ch 7 — Build
CI/CD per service; mapping source to builds; monorepo vs polyrepo (see ADR 1).
- **Prompt:** One pipeline per service vs one giant pipeline — tradeoffs?

## Ch 8 — Deployment (partly hands-on in tier 10)
Containers, orchestration (k8s), progressive delivery (blue-green, canary).
Principles: isolated, automated, one service per deployable unit.
- **Prompt:** Blue-green vs canary — when each? What does k8s give you that
  raw containers don't?

## Ch 13 — Scaling
The four axes / scale cube: vertical, horizontal duplication, data partitioning
(sharding), functional decomposition. Plus caching and autoscaling.
- **Prompt:** Your read-heavy catalog is slow. Walk the four axes in order of
  what you'd try first and why.

## Ch 14 — User Interfaces
Micro frontends, page/widget decomposition, **Backend for Frontend (BFF)**.
- **Prompt:** Why might a mobile app and a web app each need their own BFF
  instead of sharing one gateway API?

## Ch 15 — Organizational Structures
**Conway's Law**: system design mirrors org communication structure. Stream-
aligned teams own services end to end; platform teams pave the road (Team
Topologies). Two-pizza teams.
- **Prompt:** How does Conway's Law predict you'll fail if a separate "DB team"
  owns all schemas in a microservices org?

## Ch 16 — The Evolutionary Architect
Architect as gardener, not dictator: set principles + a paved road, enable
teams, govern lightly. Manage technical debt deliberately.
- **Prompt:** A team wants to introduce a 5th language. As the architect, how do
  you decide — and what's your "paved road" argument?

## Ch 11 — Security (concept side; hands-on in tier 9)
Zero trust vs implicit trust; defense in depth; the **confused deputy** problem;
data in transit/at rest; SSO gateway; JWT propagation.
- **Prompt:** What is the confused deputy problem in a service mesh, and how do
  you prevent service A from using service B to reach data it shouldn't?
