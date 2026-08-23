// ============================================================================
// 📝 TASK 2 — 5000 rows re-render when ONE thing changes
//             (concept: React.memo)
// ============================================================================
// ❌ CURRENT PROBLEM:
//    React's default: parent renders → ALL children render, regardless of
//    whether their props changed. Every 2s tick changes ~20 coin objects, but
//    all 5000 rows re-render. Star one coin → all 5000 re-render. Profile it:
//    the flame graph is a wall of CoinRow.
//
// 💡 THE FIX:
//    export default memo(CoinRow)
//    memo() skips the render when a shallow compare says every prop is
//    identical (Object.is per prop). It works here ONLY because tickPrices()
//    in data.js keeps UNCHANGED coins as the same object references and
//    allocates new objects only for changed ones — immutable-update
//    discipline is what makes memo possible at all.
//
// ✅ YOUR TASK:
//    1. Wrap the export in memo().
//    2. Profile again… and discover it BARELY helped. The row still
//       re-renders every time. Why? The parent passes freshly-created
//       function/object/array props each render → shallow compare always
//       fails. That's Task 3, in CoinList.jsx. (This ordering is deliberate:
//       memo without prop hygiene is a no-op — a hugely common real-world bug.)
//    3. After Task 3, the tick should render ~20 rows and a star exactly 1.
// ============================================================================

export default function CoinRow({ coin, watched, onToggle, style, highlights }) {
  return (
    <li className="coin-row" style={style}>
      <button className="star" onClick={() => onToggle()}>
        {watched ? '★' : '☆'}
      </button>
      <span className="sym">{highlights[0]}</span>
      <span className="name">{coin.name}</span>
      <span className="price">${coin.price.toLocaleString()}</span>
      <span className={coin.change24h >= 0 ? 'up' : 'down'}>
        {coin.change24h >= 0 ? '▲' : '▼'} {Math.abs(coin.change24h)}%
      </span>
    </li>
  )
}
