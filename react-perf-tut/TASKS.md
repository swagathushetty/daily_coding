# React Performance Course — Task Index

> **The course lives in the code** — every `📝 TASK` comment sits above the
> slow code it describes, with ❌ problem / 💡 concept / ✅ fix. This file is
> just the map.

Run it: `npm install && npm run dev`. The app WORKS — it's just janky. Feel
the jank first (type in search, watch the highlight-updates pulse), then fix.

**Iron rule (Task 0):** profile before AND after every task. Never guess.

| # | File | Concept |
|---|------|---------|
| 0 | `src/main.jsx` | Measuring: React DevTools Profiler, highlight updates, "why did this render?" |
| 1 | `src/App.jsx` | State colocation — move the clock DOWN |
| 2 | `src/components/CoinRow.jsx` | `React.memo` (and why it appears broken at first) |
| 3 | `src/components/CoinList.jsx` | Referential equality: `useCallback`, hoisted objects, stable props |
| 4 | `src/components/CoinList.jsx` + `StatsPanel.jsx` | `useMemo` for expensive derived data |
| 5 | `src/context.js` | Context splitting + memoized provider value (data vs actions contexts) |
| 6 | `src/App.jsx` | Composition: `children` don't re-render with the parent |
| 7 | `src/components/Watchlist.jsx` | index-as-key — a correctness bug disguised as a list |
| 8 | `src/components/CoinList.jsx` | Virtualization with `react-window` |
| 9 | `src/components/SearchBar.jsx` + `CoinList.jsx` | `useTransition` / `useDeferredValue` |
| 10 | `src/App.jsx` | Code splitting: `React.lazy` + `Suspense` |
| 11 | `src/components/Header.jsx` | `useRef` for non-render values |

## Suggested order & why

0 → 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11.
Tasks 2 and 3 are deliberately a trap-then-payoff pair: memo first, watch it
do nothing, then learn prop stability. Task 8 (virtualization) lands last of
the "big three" so you can compare: architecture change vs micro-memoization.

## Victory conditions

- Idle app: NOTHING flashes except the clock text and ~20 ticked rows every 2s.
- Typing in search: input echoes instantly; list may lag slightly behind (deferred).
- Starring a coin: exactly 1 row + the two watch panels render.
- Theme toggle: header/shell only.
- `npm run build`: analytics ships as its own lazy chunk.
- Watchlist notes survive un-starring other coins (key fix).
