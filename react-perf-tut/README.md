# PulseBoard 📈 — Learn React Performance by Fixing a Janky App

A deliberately slow crypto dashboard: 5000 coins, live price ticks every 2s,
search, watchlist. No API — data is generated locally (`src/data.js`).

Every performance sin is real, reproducible, and annotated with a numbered
`📝 TASK` comment (❌ what's wrong → 💡 the concept → ✅ what to do).
`TASKS.md` is the index. Prerequisite: the React DevTools browser extension.

```bash
npm install
npm run dev
```

Start with **Task 0** in `src/main.jsx` — it teaches you to measure, which is
the whole game.
