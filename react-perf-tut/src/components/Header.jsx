import { useContext, useState } from 'react'
import { AppContext } from '../context.js'

export default function Header({ time }) {
  const { theme, setTheme } = useContext(AppContext)

  // ==========================================================================
  // 📝 TASK 11 — Not everything belongs in useState
  //             (concept: useRef for values that shouldn't cause renders)
  // ==========================================================================
  // ❌ CURRENT PROBLEM:
  //    This "last mouse position" is stored in useState but is only READ
  //    inside the click handler (we log where the user last hovered before
  //    clicking the theme button — a fake analytics requirement). Storing it
  //    in state means EVERY mousemove across the header re-renders Header —
  //    hundreds of renders per second for a value the UI never displays.
  //
  // 💡 THE RULE:
  //    useState  → the UI must update when it changes.
  //    useRef    → you just need to REMEMBER it between renders.
  //    Mutating a ref does not render. (Same trick stores timer ids,
  //    previous values, DOM nodes, "has fired once" flags…)
  //
  // ✅ YOUR TASK:
  //    const lastPos = useRef({ x: 0, y: 0 })
  //    onMouseMove={(e) => { lastPos.current = { x: e.clientX, y: e.clientY } }}
  //    …and read lastPos.current in the click handler. Verify with highlight-
  //    updates: moving the mouse over the header no longer flashes anything.
  // ==========================================================================
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 })

  return (
    <header
      onMouseMove={(e) => setLastPos({ x: e.clientX, y: e.clientY })}
    >
      <h1>📈 PulseBoard</h1>
      {/* TASK 1: this clock is why the whole app re-renders every second —
          the state lives in App. Move it into a <Clock /> component here. */}
      <span className="clock">{time}</span>
      <button
        onClick={() => {
          console.log('theme toggled, cursor was at', lastPos)
          setTheme(theme === 'dark' ? 'light' : 'dark')
        }}
      >
        {theme === 'dark' ? '☀️ light' : '🌙 dark'}
      </button>
    </header>
  )
}
