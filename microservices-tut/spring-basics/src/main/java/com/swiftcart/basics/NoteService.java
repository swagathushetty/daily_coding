package com.swiftcart.basics;

import java.util.List;
import org.springframework.stereotype.Service;

// ============================================================================
// THE BUSINESS-LOGIC LAYER + DEPENDENCY INJECTION (the core Spring idea).
//
// @Service is another @Component — a Spring-managed bean for business logic.
//
// DEPENDENCY INJECTION: this class NEEDS a NoteRepository, but it does NOT
// create one (`new NoteRepository()`). Instead it declares the dependency in
// its CONSTRUCTOR, and Spring passes in the single repository bean it created.
// That's "inversion of control": the framework owns object creation and wiring.
// Why it matters: loose coupling + trivial testing (inject a fake repo in a
// test). Constructor injection (this style) is the recommended form.
// ============================================================================
@Service
public class NoteService {

    private final NoteRepository repository;

    // Spring sees this constructor and automatically supplies the NoteRepository
    // bean. (With one constructor you don't even need @Autowired.)
    public NoteService(NoteRepository repository) {
        this.repository = repository;
    }

    public List<Note> list() {
        return repository.findAll();
    }

    public Note add(String text) {
        // business rules live here, not in the controller (thin controllers)
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("note text must not be empty");
        }
        return repository.save(text.trim());
    }
}
