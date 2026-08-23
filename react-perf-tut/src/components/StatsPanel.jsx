// ============================================================================
// StatsPanel — market aggregates. Two lessons live here:
//
// 1) It re-computes heavy aggregates on every render (same disease as
//    TASK 4 — fix it the same way with useMemo once you get here).
// 2) TASK 5 side-effect: it consumes AppContext ONLY for `watchlist.length`,
//    so with the current mega-context it re-renders on THEME changes too.
//    After you split contexts (context.js), it should subscribe only to
//    WatchlistContext.
//
// BONUS QUESTION (answer before profiling, then check yourself):
//    After Task 1 (clock moved) and Task 5 (contexts split), what still
//    re-renders this panel every 2 seconds — and is that render legitimate?
//    (Answer: the `coins` prop from the market tick. Yes — the numbers it
//    shows genuinely change. Not every render is a bug; the skill is knowing
//    which ones are.)
// ============================================================================
import { useContext } from 'react'
import { AppContext } from '../context.js'

export default function StatsPanel({ coins }) {
  const { watchlist } = useContext(AppContext)

  // 🐛 heavy aggregate on every render — wrap in useMemo (see TASK 4)
  console.log('⚠️ recomputing market stats…')
  const totalCap = coins.reduce((s, c) => s + c.marketCap, 0)
  const gainers = coins.filter((c) => c.change24h > 0).length
  const top = [...coins].sort((a, b) => b.change24h - a.change24h)[0]

  return (
    <div className="stats">
      <div>
        <strong>${(totalCap / 1e12).toFixed(2)}T</strong>
        <span>market cap</span>
      </div>
      <div>
        <strong>{gainers}</strong>
        <span>gainers</span>
      </div>
      <div>
        <strong>{top.symbol}</strong>
        <span>top mover</span>
      </div>
      <div>
        <strong>{watchlist.length}</strong>
        <span>watched</span>
      </div>
    </div>
  )
}
