package com.swiftcart.basics;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import org.springframework.stereotype.Repository;

// ============================================================================
// THE DATA LAYER. @Repository marks this as a Spring-managed bean (a
// specialization of @Component) whose job is data access. Because it's a bean,
// Spring creates ONE instance and can inject it wherever it's needed (see
// NoteService). In the real services this is a Spring Data JPA interface talking
// to Postgres; here we fake storage with an in-memory Map so there's zero setup.
//
// 📝 NOTE for the real course: catalog-service's ProductRepository is just
//   `interface ProductRepository extends JpaRepository<Product, Long> {}` —
//   Spring Data generates the implementation (findAll, save, findById) for you.
//   Same ROLE as this class, far less code.
// ============================================================================
@Repository
public class NoteRepository {

    private final Map<Long, Note> store = new ConcurrentHashMap<>();
    private final AtomicLong seq = new AtomicLong(0);

    public List<Note> findAll() {
        return List.copyOf(store.values());
    }

    public Note save(String text) {
        long id = seq.incrementAndGet();
        Note note = new Note(id, text);
        store.put(id, note);
        return note;
    }
}
