import { useEffect, useState } from 'react'
import { AppContext } from './context.js'
import { generateCoins, tickPrices } from './data.js'
import Header from './components/Header.jsx'
import SearchBar from './components/SearchBar.jsx'
import StatsPanel from './components/StatsPanel.jsx'
import CoinList from './components/CoinList.jsx'
import Watchlist from './components/Watchlist.jsx'
// 📝 TASK 10 (part 1): this import eagerly bundles the "heavy" analytics code
// into the main chunk even though it's hidden behind a button. See below.
import AnalyticsPanel from './components/AnalyticsPanel.jsx'

// ============================================================================
// PulseBoard 📈 — an intentionally JANKY crypto dashboard. 5000 coins, live
// price ticks, search, watchlist. Every performance sin is real and visible.
//
// THE COURSE (Task 0 is in src/main.jsx — do it first, it teaches measuring):
//   Task 0  main.jsx            Profiler + "Highlight updates" (measure first!)
//   Task 1  App.jsx (here)      state colocation — the ticking clock
//   Task 2  CoinRow.jsx         React.memo
//   Task 3  CoinList.jsx        referential equality — useCallback/useMemo props
//   Task 4  CoinList.jsx        expensive compute without useMemo
//   Task 5  context.js          context splitting + memoized provider value
//   Task 6  App.jsx (here)      composition: children as a memo alternative
//   Task 7  Watchlist.jsx       index-as-key bugs
//   Task 8  CoinList.jsx        windowing / virtualization (react-window)
//   Task 9  SearchBar/CoinList  useTransition & useDeferredValue
//   Task 10 App.jsx (here)      code splitting with React.lazy + Suspense
//   Task 11 Header.jsx          useRef for non-render values
//
// RULE: run the Profiler before AND after every task. No guessing.
// ============================================================================

export default function App() {
  // ==========================================================================
  // 📝 TASK 1 — State colocation: the ticking clock nukes the whole app
  //             (concept: "lift state DOWN" — put state where it's used)
  // ==========================================================================
  // ❌ CURRENT PROBLEM:
  //    `time` lives HERE, at the root, but only the tiny <Header> clock shows
  //    it. setTime fires every second → App re-renders → ALL children
  //    re-render → 5000 rows reconcile every single second, forever, even
  //    when the user does nothing. Turn on "Highlight updates" — the whole
  //    page pulses like a heartbeat.
  //
  // 💡 THE FIX:
  //    The cheapest optimization in React is moving state DOWN into the
  //    smallest component that needs it. No memo needed, nothing to
  //    invalidate — renders that never happen are free.
  //
  // ✅ YOUR TASK:
  //    Create components/Clock.jsx, move `time` + its interval INTO it,
  //    render <Clock /> inside Header. App should never re-render from time
  //    again. Verify: highlight-updates now flashes only the clock text.
  // ==========================================================================
  const [time, setTime] = useState(() => new Date().toLocaleTimeString())
  useEffect(() => {
    const t = setInterval(
      () => setTime(new Date().toLocaleTimeString()),
      1000,
    )
    return () => clearInterval(t)
  }, [])

  const [theme, setTheme] = useState('dark')
  const [search, setSearch] = useState('')
  const [watchlist, setWatchlist] = useState([])

  // Live market: ~20 of the 5000 coin prices change every 2 seconds.
  // (This state legitimately belongs here — CoinList, StatsPanel and
  //  Watchlist all need it. The problem is what re-renders BECAUSE of it.)
  const [coins, setCoins] = useState(generateCoins)
  useEffect(() => {
    let tick = 1
    const t = setInterval(() => setCoins((c) => tickPrices(c, tick++)), 2000)
    return () => clearInterval(t)
  }, [])

  const [showAnalytics, setShowAnalytics] = useState(false)

  // 🐛 TASK 5 (see context.js): inline object → new identity every render →
  // every context consumer re-renders every time App renders. Also,
  // toggleWatch is a new function each render (relevant in Task 3 too).
  function toggleWatch(id) {
    setWatchlist((w) =>
      w.includes(id) ? w.filter((x) => x !== id) : [...w, id],
    )
  }

  return (
    <AppContext.Provider value={{ theme, setTheme, watchlist, toggleWatch }}>
      {/* ====================================================================
          📝 TASK 6 — Composition: children don't re-render with the parent
          ====================================================================
          💡 CONCEPT (do after Task 1, it's the same family):
             When a parent re-renders, React re-renders the components it
             CREATES in its own JSX — but a `children` prop passed from
             further up is the SAME element object as last time, so React can
             skip it. Wrapping static subtrees in a layout component often
             beats sprinkling React.memo.

          ✅ YOUR TASK:
             1. Create components/ThemeShell.jsx that owns the `theme` state
                itself and renders:
                   <div className={`app ${theme}`}>
                     <button onClick={...}>toggle theme</button>
                     {children}
                   </div>
             2. In App, wrap everything in <ThemeShell> ... </ThemeShell> and
                DELETE the theme state here.
             3. Observe: toggling theme re-renders ThemeShell but NOT the
                children (they arrive via props — same element identity).
                Compare with today's behaviour, where the theme button
                re-renders the entire app. Profiler proof, as always.
          ==================================================================== */}
      <div className={`app ${theme}`}>
        <Header time={time} />
        <SearchBar search={search} onSearch={setSearch} />
        <div className="layout">
          <div>
            <StatsPanel coins={coins} />
            <CoinList coins={coins} search={search} />
          </div>
          <aside>
            <Watchlist coins={coins} />
            {/* ==============================================================
                📝 TASK 10 — Code splitting with React.lazy
                ==============================================================
                ❌ CURRENT PROBLEM:
                   AnalyticsPanel is a fat component (pretend it drags in a
                   charting library) that 99% of visits never open — yet it
                   ships in the FIRST JavaScript bundle everyone downloads.
                   Run `npm run build` and look at the single chunk size.

                💡 THE FIX:
                   const AnalyticsPanel = lazy(() => import('./components/AnalyticsPanel.jsx'))
                   ...
                   {showAnalytics && (
                     <Suspense fallback={<p>Loading analytics…</p>}>
                       <AnalyticsPanel coins={coins} />
                     </Suspense>
                   )}

                ✅ YOUR TASK: convert the top import to React.lazy + Suspense.
                   Rebuild — vite now emits a separate chunk that loads only
                   when the button is clicked (watch the Network tab).
                ============================================================== */}
            <button onClick={() => setShowAnalytics((s) => !s)}>
              {showAnalytics ? 'Hide' : 'Show'} analytics
            </button>
            {showAnalytics && <AnalyticsPanel coins={coins} />}
          </aside>
        </div>
      </div>
    </AppContext.Provider>
  )
}
