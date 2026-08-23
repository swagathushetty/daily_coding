package com.swiftcart.basics;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// ============================================================================
// SPRING BOOT BASICS — read the files in this order:
//   1. SpringBasicsApplication.java   (this file — startup + what the magic is)
//   2. Note.java                      (a plain data object)
//   3. NoteRepository.java            (the data layer + @Repository/@Component)
//   4. NoteService.java               (business logic + dependency injection)
//   5. NoteController.java            (the HTTP layer + REST annotations)
//   6. application.yml                (configuration)
//
// Run it:  ./mvnw -pl spring-basics spring-boot:run     (needs NO docker/db)
// Then:    curl localhost:8090/notes
//          curl -X POST localhost:8090/notes -H 'content-type: application/json' -d '{"text":"hello"}'
//          curl localhost:8090/actuator/health
//
// Once this makes sense, catalog-service in ../services is the SAME shape with a
// real database — you'll recognize every annotation.
// ============================================================================

// @SpringBootApplication is three annotations in one:
//   @Configuration       — this class can define beans
//   @EnableAutoConfiguration — Boot auto-configures things it finds on the
//                          classpath (spring-web on the classpath → it starts an
//                          embedded Tomcat web server for you, no XML, no setup)
//   @ComponentScan       — scan THIS package and sub-packages for your
//                          @Component/@Service/@Repository/@RestController classes
//                          and register them in the "application context" (the
//                          container that creates and wires your objects).
@SpringBootApplication
public class SpringBasicsApplication {

    public static void main(String[] args) {
        // This one line boots the whole app: starts the container, scans for
        // your components, wires their dependencies, and launches the web
        // server on the port from application.yml. Watch the console logs.
        SpringApplication.run(SpringBasicsApplication.class, args);
    }
}
