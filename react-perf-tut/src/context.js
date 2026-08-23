import { createContext } from 'react'

// ============================================================================
// 📝 TASK 5 — One giant context = one giant re-render bomb
//             (concepts: context splitting, memoizing the provider value)
// ============================================================================
// ❌ CURRENT PROBLEM:
//    ONE context carries theme + watchlist + actions. React re-renders EVERY
//    consumer whenever the context VALUE changes identity. Two consequences:
//
//    1. Unrelated coupling: toggling the THEME re-renders every component
//       that only cares about the WATCHLIST (watch StatsPanel flash when you
//       hit the theme button).
//    2. Worse — look at App.jsx: the provider passes an INLINE object
//       (value={{ theme, ... }}). A brand-new object every App render means
//       every consumer re-renders on EVERY App render, even when nothing
//       inside the value changed. The context is a re-render amplifier.
//
// 💡 THE FIX (two independent techniques — do both):
//    a) Memoize the value:  const value = useMemo(() => ({...}), [deps])
//       → consumers only re-render when the value actually changes.
//    b) SPLIT by change-frequency and by consumer:
//         ThemeContext          (changes rarely)
//         WatchlistContext      (the data — changes often)
//         WatchlistActionsContext (just {toggleWatch} — NEVER changes if
//                                  wrapped in useCallback → rows that only
//                                  need the action stop re-rendering when
//                                  the watchlist data changes!)
//       The data/actions split is the pro move: components that only WRITE
//       (CoinRow's ★ button) subscribe to the stable actions context and go
//       quiet forever.
//
// ✅ YOUR TASK:
//    Replace AppContext with the three contexts above. Update the consumers
//    (Header, CoinRow, Watchlist, StatsPanel) to subscribe only to what each
//    actually needs. Verify with "Highlight updates": theme toggle should now
//    flash ONLY the header and the root div.
// ============================================================================

export const AppContext = createContext(null)
