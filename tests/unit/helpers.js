import { vi } from 'vitest'

// Zastępuje Math.random stałą wartością albo cykliczną sekwencją wartości
export function fixRandom(...values) {
  let i = 0
  return vi.spyOn(Math, 'random').mockImplementation(() => values[i++ % values.length])
}
