package com.swiftcart.basics;

// A plain immutable data carrier. A Java `record` auto-generates the
// constructor, getters (id(), text()), equals/hashCode, toString. Spring uses
// Jackson to convert between JSON and objects like this automatically:
//   incoming JSON {"text":"hi"}  ->  Note   (@RequestBody, see NoteController)
//   returned Note                ->  JSON   (whatever a @RestController returns)
public record Note(Long id, String text) {
}
