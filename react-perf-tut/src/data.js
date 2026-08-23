// ============================================================================
// Fake market data — generated locally, deterministic, no API.
// This file is FINE. The performance crimes are all in the components.
// ============================================================================

const PREFIXES = ['Bit', 'Ether', 'Sol', 'Doge', 'Ada', 'Luna', 'Pepe', 'Shib', 'Ark', 'Neo', 'Zen', 'Flux', 'Nova', 'Quant', 'Hex']
const SUFFIXES = ['coin', 'token', 'chain', 'swap', 'net', 'fi', 'dao', 'verse', 'X', 'Pro']

// Deterministic pseudo-random (so every reload has the same 5000 coins)
function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const COIN_COUNT = 5000

export function generateCoins() {
  const rand = mulberry32(42)
  return Array.from({ length: COIN_COUNT }, (_, i) => {
    const name =
      PREFIXES[Math.floor(rand() * PREFIXES.length)] +
      SUFFIXES[Math.floor(rand() * SUFFIXES.length)] +
      '-' + i
    return {
      id: i,
      name,
      symbol: name.slice(0, 3).toUpperCase() + i,
      price: +(rand() * 60000).toFixed(2),
      change24h: +((rand() - 0.5) * 20).toFixed(2),
      marketCap: Math.floor(rand() * 1e9),
    }
  })
}

// Simulates a live market: returns a NEW array with ~20 random prices changed.
export function tickPrices(coins, tick) {
  const rand = mulberry32(tick)
  const updated = [...coins]
  for (let i = 0; i < 20; i++) {
    const idx = Math.floor(rand() * updated.length)
    const c = updated[idx]
    updated[idx] = {
      ...c,
      price: +(c.price * (1 + (rand() - 0.5) * 0.02)).toFixed(2),
      change24h: +(c.change24h + (rand() - 0.5)).toFixed(2),
    }
  }
  return updated
}
