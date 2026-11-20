import { describe, it, expect } from 'vitest'
import { THEMES, freq, noteLen, themeFor } from '../../src/game/music.js'
import { newState } from '../../src/game/state.js'

describe('muzyka', () => {
  it('nuty mają poprawne częstotliwości', () => {
    expect(freq('A4')).toBeCloseTo(440)
    expect(freq('A3')).toBeCloseTo(220)
    expect(freq('C#5')).toBeCloseTo(554.37, 1)
    expect(freq('.')).toBe(null)
  })

  it('wszystkie nuty w motywach są poprawne, a ścieżki mają równą długość', () => {
    for (const [k, th] of Object.entries(THEMES)) {
      expect(th.bass.length, k).toBe(th.lead.length)
      expect(th.drum.length, k).toBe(th.lead.length)
      for (const n of [...th.lead, ...th.bass]) if (n !== '.' && n !== '-') expect(freq(n), k + ' ' + n).not.toBe(null)
    }
  })

  it('przedłużenia wydłużają nutę', () => {
    expect(noteLen(['A4', '-', '-', 'B4'], 0)).toBe(3)
  })

  it('motyw zależy od sytuacji', () => {
    const s = newState()
    expect(themeFor(s, { f: 1 })).toBe('calm')
    s.hungerDays = 2
    expect(themeFor(s, { f: 1 })).toBe('crisis')
    s.over = { win: true }
    expect(themeFor(s, { f: 1 })).toBe('victory')
  })
})
