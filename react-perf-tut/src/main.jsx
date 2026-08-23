import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// ============================================================================
// 📝 TASK 0 — Learn to MEASURE before you optimize
//             (tools: React DevTools Profiler, "Highlight updates")
// ============================================================================
// This course has one iron rule: never apply a fix without first SEEING the
// problem in the profiler. Guess-driven memoization is how people make apps
// SLOWER (every memo/useMemo has its own cost).
//
// ✅ YOUR TASK (no code yet):
//   1. Install the "React Developer Tools" browser extension.
//   2. Open devtools → ⚛️ Components → gear icon → check
//      "Highlight updates when components render."
//   3. Run the app and just WATCH for a minute:
//        - Everything flashes every second (the clock — Task 1).
//        - Everything flashes on every keystroke in search (Tasks 4, 9).
//        - 5000 rows flash when you star ONE coin (Tasks 2, 3).
//   4. Open the ⚛️ Profiler tab → record → type in search → stop. Look at
//      the flame graph: gray = didn't render, colored = rendered (width =
//      time). Hover a component → "Why did this render?" (enable it in the
//      Profiler gear: "Record why each component rendered").
//   5. Re-run this profile after EVERY task you complete. That's your proof.
//
// NOTE: React.StrictMode double-invokes renders in dev. Keep it (it catches
// bugs), but when you measure raw timings, remember dev ≠ prod. For honest
// numbers: npm run build && npm run preview.
// ============================================================================

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
