# Machine Coding Problem Bank (Frontend)

The master list. Each problem gets its own folder under `frontend/` as an
annotated reference tutorial (📐 DESIGN DECISION comments in the code).
Study the reference → then rebuild from a blank folder, timed (60–90 min),
using only its REQUIREMENTS.md. A problem isn't "banked" until you've done
the blank rebuild.

## Tier 1 — The classics (asked constantly)

- [x] **Autocomplete / typeahead** — debounce, keyboard nav (↑↓ Enter Esc),
      highlight matches, caching, race conditions, a11y combobox. → `frontend/autocomplete/`
- [ ] **Nested comments (Reddit-style)** — recursive data + recursive
      components, reply/edit/delete at any depth, collapse threads.
- [ ] **Todo / Kanban board** — CRUD, filters, drag-and-drop between columns,
      localStorage persistence.
- [ ] **Star rating + product card grid** — reusable component API design,
      hover preview, half-stars, controlled vs uncontrolled.
- [ ] **Infinite scroll list** — IntersectionObserver, loading/error states,
      scroll restoration.

## Tier 2 — State-machine heavy (modeling; where candidates crack)

- [ ] **Tic-tac-toe, extendable to N×N / M-in-a-row** — never hardcode 3.
- [ ] **Snake game / memory match** — game loop, keyboard input, pause/resume,
      collision.
- [ ] **Multi-step form wizard** — per-step validation, back/next with state
      preservation, progress, conditional steps.
- [ ] **Poll / quiz widget with timer** — countdown per question, score,
      review screen.
- [ ] **OTP input** — auto-advance, backspace semantics, paste handling.

## Tier 3 — Data + UI coordination (senior-leaning)

- [ ] **File explorer / folder tree** — nested expand/collapse,
      create/rename/delete, breadcrumbs.
- [ ] **Data table** — sort, filter, pagination, column & row selection with
      select-all semantics.
- [ ] **Calendar / event scheduler** — month grid generation, overlapping
      event layout.
- [ ] **Shopping cart + checkout** — derived totals, coupons, quantity edges.
- [ ] **Transfer list / dual listbox** — selection across panels, move-all.

## Tier 4 — Async & systems flavor (differentiators)

- [ ] **Task scheduler with concurrency limit** — max N promises at once,
      queue, live statuses.
- [ ] **Toast/notification system** — imperative API (`toast.show()`),
      auto-dismiss, stacking, portal.
- [ ] **Modal manager / nested modals** — focus trap, Esc, scroll lock, a11y.
- [ ] **Undo/redo (drawing pad or editor)** — command pattern, history stacks.
- [ ] **Live chat UI with polling** — optimistic send, retry, scroll-to-bottom.

## Recommended build order (covers ~80% of recombined skills)

autocomplete → nested comments → multi-step form → concurrency scheduler →
then pick by weakness.
