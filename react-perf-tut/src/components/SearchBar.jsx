// ============================================================================
// 📝 TASK 9 (part 1) — Keep typing responsive: useTransition / useDeferredValue
//             (do AFTER Tasks 2-4 & 8; concurrent features are the LAST resort,
//              not the first — most "need useTransition" cases are really
//              "forgot useMemo/memo/virtualization" cases)
// ============================================================================
// ❌ CURRENT PROBLEM (feel it: type fast in the box BEFORE doing other tasks):
//    Every keystroke = setSearch in App = re-filter + re-render 5000 rows
//    SYNCHRONOUSLY. The input can't even echo your keystroke until that
//    finishes → typing feels gluey. The urgent update (controlled input) is
//    chained to the non-urgent one (the giant list).
//
// 💡 THE FIX — tell React which update is allowed to lag:
//    Option A (in App, where the state is set):
//      const [isPending, startTransition] = useTransition()
//      onSearch={(v) => {
//        setInputValue(v)                          // urgent: echo keystroke
//        startTransition(() => setSearch(v))       // non-urgent: filter list
//      }}
//      (needs TWO states: one for the input, one transitioned for the list)
//    Option B (in CoinList, where the value is consumed — usually simpler):
//      const deferredSearch = useDeferredValue(search)
//      …filter with deferredSearch; add a subtle dimming while
//      search !== deferredSearch.
//    Both let React interrupt the list render when new keystrokes arrive.
//
// ✅ YOUR TASK: implement Option B in CoinList.jsx (there's a matching TASK 9
//    part-2 marker there). Then try Option A and compare the ergonomics.
// ============================================================================

export default function SearchBar({ search, onSearch }) {
  // NOTE: the input state itself is CLIENT state and belongs in useState —
  // don't "optimize" the controlled input away.
  return (
    <input
      className="search"
      placeholder="Search 5000 coins… (type fast, feel the jank)"
      value={search}
      onChange={(e) => onSearch(e.target.value)}
    />
  )
}
