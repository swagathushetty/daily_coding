package com.swiftcart.basics;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// ============================================================================
// THE HTTP LAYER. @RestController = @Controller + @ResponseBody: every method's
// return value is serialized straight to the HTTP response body as JSON.
// @RequestMapping("/notes") sets the base path for all methods here.
//
// The controller should be THIN: parse the request, call the service, return the
// result. No business logic here (that's NoteService's job).
// ============================================================================
@RestController
@RequestMapping("/notes")
public class NoteController {

    private final NoteService service;   // injected — same DI as NoteService

    public NoteController(NoteService service) {
        this.service = service;
    }

    // GET /notes
    @GetMapping
    public List<Note> all() {
        return service.list();
    }

    // POST /notes  with body {"text":"..."}. @RequestBody deserializes the JSON
    // into CreateNote (via Jackson). The returned Note becomes JSON automatically.
    @PostMapping
    public Note create(@RequestBody CreateNote body) {
        return service.add(body.text());
    }

    // A small DTO for the request body — keep the API's input shape separate
    // from your internal model.
    public record CreateNote(String text) {}

    // ========================================================================
    // 📝 EXERCISES (do these to make the basics stick):
    //   1. Add GET /notes/{id} using @PathVariable Long id. Return 404 when
    //      missing (return ResponseEntity<Note>, like catalog-service does).
    //   2. Add DELETE /notes/{id} (@DeleteMapping) + a delete method down the
    //      layers (controller → service → repository).
    //   3. The empty-text case currently throws → a 500. Add an
    //      @ExceptionHandler (or @ControllerAdvice) that maps
    //      IllegalArgumentException to a clean 400 Bad Request.
    //   4. Add a @Value("${greeting:hi}") field and an endpoint that returns it;
    //      then set `greeting:` in application.yml. That's externalized config —
    //      the foundation of the microservices' application.yml files.
    // When these feel easy, open ../services/catalog-service — it's this exact
    // shape with a real database, and you'll recognize every annotation.
    // ========================================================================
}
