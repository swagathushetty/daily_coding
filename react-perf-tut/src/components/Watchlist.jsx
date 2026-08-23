import { useContext, useState } from 'react'
import { AppContext } from '../context.js'

// ============================================================================
// 📝 TASK 7 — index-as-key: the bug that LOOKS like a perf tip
//             (concept: keys drive reconciliation identity)
// ============================================================================
// ❌ CURRENT PROBLEM — reproduce it, it's spooky:
//    1. Star 3+ coins in the market list so they appear here.
//    2. Type a note ("buy at 100") in the FIRST watchlist row's input.
//    3. Un-star that FIRST coin (☆ button in this panel).
//    → Your note JUMPS onto the next coin! The <input>'s text belongs to a
//    DOM node, and with key={index} React thinks "row 0 still exists, its
//    props just changed" — it keeps the DOM (and its uncontrolled input
//    value, focus, scroll…) and reassigns it to a DIFFERENT coin.
//
//    It's a perf problem too: remove the first of N rows and React mutates
//    ALL N rows (every index shifted) instead of deleting exactly one.
//
// 💡 THE RULE:
//    key must be a STABLE IDENTITY of the item (coin.id), not its position.
//    index-as-key is only acceptable for lists that never reorder, never
//    insert/remove in the middle, and hold no per-row state. (And key is NOT
//    a perf hint — it's correctness. Random keys are the opposite sin: they
//    remount every row every render.)
//
// ✅ YOUR TASK: key={c.id}. Then repeat the repro — the note now sticks to
//    its coin (and disappears with it when un-starred).
// ============================================================================

export default function Watchlist({ coins }) {
  const { watchlist, toggleWatch } = useContext(AppContext)
  const watched = coins.filter((c) => watchlist.includes(c.id))

  return (
    <section className="watchlist">
      <h2>⭐ Watchlist</h2>
      {watched.length === 0 && <p className="hint">Star coins to track them</p>}
      <ul>
        {watched.map((c, index) => (
          <li key={index} className="watch-row">
            <button className="star" onClick={() => toggleWatch(c.id)}>
              ★
            </button>
            <span>
              {c.name} — ${c.price.toLocaleString()}
            </span>
            {/* deliberately uncontrolled: its DOM value is what leaks
                across rows when keys are wrong */}
            <input placeholder="note…" />
          </li>
        ))}
      </ul>
    </section>
  )
}
