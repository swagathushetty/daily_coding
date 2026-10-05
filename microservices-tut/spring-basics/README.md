# spring-basics — Spring Boot fundamentals (do this FIRST if Spring is new)

A zero-infrastructure primer: no database, no Kafka, no Docker. Just the
framework fundamentals you need before the real microservices course. A tiny
in-memory "notes" API, structured in the same Controller → Service → Repository
layers the real services use, with every annotation explained in comments.

## Run

```bash
./mvnw -pl spring-basics spring-boot:run      # from the microservices-tut root
```

```bash
curl localhost:8090/notes
curl -X POST localhost:8090/notes -H 'content-type: application/json' -d '{"text":"first note"}'
curl localhost:8090/actuator/health
```

## Read in this order

1. `SpringBasicsApplication.java` — startup, and what `@SpringBootApplication`
   actually does (component scan, auto-config, embedded server)
2. `Note.java` — a data record; JSON ⇄ object conversion
3. `NoteRepository.java` — the data layer, `@Repository`, beans
4. `NoteService.java` — business logic + **dependency injection** (the core idea)
5. `NoteController.java` — REST endpoints; `@GetMapping`/`@PostMapping`/
   `@RequestBody`/`@PathVariable` — plus **exercises** at the bottom
6. `application.yml` — externalized configuration

When this feels easy, open `../services/catalog-service` — it's this exact
shape backed by a real Postgres database, and you'll recognize everything. Then
start the main course at `../TASKS.md`.
