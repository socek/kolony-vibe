import { describe, it, expect, afterEach, vi } from 'vitest'
import { newState } from '../../src/game/state.js'
import { endTurn } from '../../src/game/turn.js'
import { CHOICES, CHOICE_KEYS, resolveChoice } from '../../src/game/choices.js'
import { fixRandom } from './helpers.js'

afterEach(() => vi.restoreAllMocks())

describe('zdarzenia z wyborem', () => {
  it('mają od 2 do 5 opcji, a im więcej opcji, tym mniej typów', () => {
    const count = n => CHOICE_KEYS.filter(k => CHOICES[k].opts.length === n).length
    for (const k of CHOICE_KEYS) expect(CHOICES[k].opts.length, k).toBeGreaterThanOrEqual(2)
    for (const k of CHOICE_KEYS) expect(CHOICES[k].opts.length, k).toBeLessThanOrEqual(5)
    expect(count(2)).toBeGreaterThan(count(3))
    expect(count(3)).toBeGreaterThan(count(4))
    expect(count(4)).toBeGreaterThan(count(5))
    expect(count(5)).toBeGreaterThan(0)
  })

  it('ostatnia opcja zawsze jest dostępna, nawet bez pieniędzy', () => {
    const s = newState(); s.cr = 0; s.min = 0; s.pop = 20
    for (const k of CHOICE_KEYS) {
      const opts = CHOICES[k].opts, last = opts[opts.length - 1]
      expect(last.need ? last.need(s) : '', k).toBe('')
    }
  })

  it('każda dostępna opcja daje opis skutku', () => {
    fixRandom(0.3)
    for (const k of CHOICE_KEYS) {
      CHOICES[k].opts.forEach((o, i) => {
        const s = newState(); s.cr = 2000; s.min = 400; s.rs = 'graph'
        expect(resolveChoice(s, k, i), k + ' #' + i).toMatch(/\S/)
      })
    }
  })

  it('niedostępnej opcji nie da się wybrać', () => {
    const s = newState(); s.cr = 0
    expect(resolveChoice(s, 'trader', 0)).toBe(null)
    expect(s.min).toBe(200)
  })

  it('czekająca decyzja wstrzymuje czas', () => {
    const s = newState(); s.pending = 'trader'
    expect(endTurn(s)).toEqual(['choice'])
    expect(s.m).toBe(1)
  })

  it('zdarzenie bez odpowiedzi automatycznej czeka na decyzję, z odpowiedzią – rozstrzyga się samo', () => {
    // losowość 0: na pewno zdarzenie, na pewno z wyborem, pierwsze z listy
    fixRandom(0)
    const a = newState(); a.m = 20
    const stopsA = endTurn(a)
    expect(stopsA).toContain('choice')
    expect(a.pending).toBe(CHOICE_KEYS[0])

    const b = newState(); b.m = 20
    endTurn(b, false, { [CHOICE_KEYS[0]]: 1 })
    expect(b.pending).toBeFalsy()
  })
})
