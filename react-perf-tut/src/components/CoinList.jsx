import { useContext } from 'react'
import { AppContext } from '../context.js'
import CoinRow from './CoinRow.jsx'

export default function CoinList({ coins, search }) {
  const { watchlist, toggleWatch } = useContext(AppContext)

  // ==========================================================================
  // 📝 TASK 4 — Expensive work re-runs on EVERY render
  //             (concept: useMemo for derived data)
  // ==========================================================================
  // ❌ CURRENT PROBLEM:
  //    This filter + sort over 5000 items runs on EVERY render of CoinList —
  //    including renders where neither `coins` nor `search` changed (e.g. the
  //    clock tick from Task 1, a theme toggle, a watchlist star). Open the
  //    console: the log below screams constantly.
  //
  // 💡 THE FIX:
  //    const visible = useMemo(() => {
  //      const q = search.toLowerCase()
  //      return coins
  //        .filter((c) => c.name.toLowerCase().includes(q))
  //        .sort((a, b) => b.marketCap - a.marketCap)
  //    }, [coins, search])
  //    useMemo caches the RESULT between renders and recomputes only when a
  //    dependency changes. Rules:
  //      - it's for EXPENSIVE derivations (measure! a 10-item filter doesn't
  //        deserve one) and for STABLE IDENTITIES (arrays/objects passed to
  //        memoized children or used in deps — see Task 3).
  //      - the render must work correctly WITHOUT it (it's a cache, not a
  //        guarantee — React may drop it).
  //
  // ✅ YOUR TASK: wrap this in useMemo. The console.log should now fire only
  //    on real ticks and real search changes.
  // ==========================================================================
  console.log('⚠️ filtering + sorting 5000 coins…')
  const q = search.toLowerCase()
  const visible = coins
    .filter((c) => c.name.toLowerCase().includes(q))
    .sort((a, b) => b.marketCap - a.marketCap)

  // ==========================================================================
  // 📝 TASK 9 (part 2) — useDeferredValue lives here
  //    (see SearchBar.jsx for the full explanation)
  //    const deferredSearch = useDeferredValue(search)
  //    → filter with deferredSearch instead of search; while
  //      search !== deferredSearch render the list with opacity 0.6.
  // ==========================================================================

  // ==========================================================================
  // 📝 TASK 8 — 5000 DOM nodes when ~20 fit on screen
  //             (concept: windowing / virtualization with react-window)
  // ==========================================================================
  // ❌ CURRENT PROBLEM:
  //    Even with memo everywhere, the initial render mounts 5000 <li> trees
  //    (≈40k+ DOM nodes) and EVERY search keystroke reconciles all of them.
  //    Memoization reduces re-render COST; it can't reduce ELEMENT COUNT.
  //    Inspect-element the <ul> and scroll the node count in horror.
  //
  // 💡 THE FIX:
  //    Render only what's visible. react-window is already installed:
  //      import { FixedSizeList } from 'react-window'
  //      <FixedSizeList
  //        height={600} itemCount={visible.length} itemSize={44} width="100%"
  //        itemData={visible}                    // avoid closures per row
  //      >
  //        {({ index, style, data }) => (
  //          <CoinRow style={style} coin={data[index]} ... />
  //        )}
  //      </FixedSizeList>
  //    (Pass `style` through to the row's outer element — that's how the
  //    window positions rows absolutely.)
  //
  // ✅ YOUR TASK: virtualize this list. Then re-profile the search typing —
  //    this single change usually dwarfs every memo you added. Lesson:
  //    architecture beats micro-optimization.
  // ==========================================================================

  return (
    <section>
      <h2>Market ({visible.length} coins)</h2>
      <ul className="coins">
        {visible.map((coin) => (
          // ====================================================================
          // 📝 TASK 3 — You memoized CoinRow (Task 2)… and it changed nothing
          //             (concept: referential equality — props must be STABLE)
          // ====================================================================
          // ❌ CURRENT PROBLEM (do Task 2 first, then come back — memo will
          //    appear "broken"):
          //    React.memo compares props with Object.is. Three props below
          //    defeat it on every parent render:
          //      1. onToggle={() => toggleWatch(coin.id)}  → new function
          //         every render. Fix: pass toggleWatch itself (stabilized
          //         with useCallback in App / the actions context from Task 5)
          //         and let the row call onToggle(coin.id).
          //      2. style={{ ... }} inline object → new identity every time.
          //         Fix: hoist it to a module constant (it never changes).
          //      3. highlights={[...]} computed inline → new array. Fix:
          //         derive it inside the row, or useMemo it here.
          //    Rule: memo(Component) is a CONTRACT — every non-primitive prop
          //    you pass must keep a stable identity, or the memo is dead
          //    weight (React still runs the props comparison, so a broken
          //    memo is strictly SLOWER than no memo).
          //
          // ✅ YOUR TASK: stabilize all three props, then verify in the
          //    Profiler that starring one coin renders exactly ONE row.
          // ====================================================================
          <CoinRow
            key={coin.id}
            coin={coin}
            watched={watchlist.includes(coin.id)}
            onToggle={() => toggleWatch(coin.id)}
            style={{ borderLeft: '3px solid transparent' }}
            highlights={[coin.symbol, coin.name]}
          />
        ))}
      </ul>
    </section>
  )
}
