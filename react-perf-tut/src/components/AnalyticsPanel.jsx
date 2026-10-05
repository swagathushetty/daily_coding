// ============================================================================
// AnalyticsPanel — the "heavy, rarely used" component for TASK 10 (React.lazy).
//
// In a real app this is where the 300KB charting library import would live.
// We simulate weight two ways:
//   - PADDING below fakes bundle size (visible in `npm run build` output).
//   - The render does a deliberately slow O(n²)-ish pass, so mounting it
//     also demonstrates why you don't want it rendered before it's needed.
//
// The task itself is annotated in App.jsx where this file is imported.
// ============================================================================

export default function AnalyticsPanel({ coins }) {
  // deliberately slow: correlation-ish matrix over a coin sample
  const sample = coins.slice(0, 400)
  let signal = 0
  for (const a of sample) {
    for (const b of sample) {
      signal += Math.sign(a.change24h) === Math.sign(b.change24h) ? 1 : -1
    }
  }
  const breadth = ((signal / (sample.length * sample.length)) * 100).toFixed(1)

  return (
    <div className="analytics">
      <h3>📊 Deep Analytics™</h3>
      <p>Market breadth correlation: {breadth}%</p>
      <p className="hint">
        (imagine a 300KB chart library rendered here)
      </p>
    </div>
  )
}

// --- fake bundle weight so the chunk is visibly big in build output ---------
export const PADDING = `${'lorem-ipsum-heavy-chart-library-code-'.repeat(4000)}`
