import { describe, it, expect } from 'vitest'
import { newState } from '../../src/game/state.js'
import { calc } from '../../src/game/calc.js'
import { t } from '../../src/i18n.js'
import { LAWS, MAX_LAWS, LAW_FEE, toggleLaw, lawBlock, lawFx } from '../../src/game/laws.js'
import { workRate } from '../../src/game/workforce.js'

const st = () => { const s = newState('moon'); s.mor = 50; s.hospRed = 0; return s }

describe('ustawy', () => {
  it('uchwalenie kosztuje opłatę, uchylenie jest darmowe', () => {
    const s = st(), cr = s.cr
    expect(toggleLaw(s, 'fest', t)).toBe(true)
    expect(s.cr).toBe(cr - LAW_FEE)
    expect(toggleLaw(s, 'fest', t)).toBe(true)
    expect(s.cr).toBe(cr - LAW_FEE)
    expect(s.laws).toEqual([])
  })
  it('najwyżej MAX_LAWS naraz i trzeba mieć kredyty', () => {
    const s = st(); s.cr = 10000
    Object.keys(LAWS).slice(0, MAX_LAWS).forEach(k => toggleLaw(s, k, t))
    const next = Object.keys(LAWS)[MAX_LAWS]
    expect(lawBlock(s, next, t)).not.toBe('')
    expect(toggleLaw(s, next, t)).toBe(false)
    const p = st(); p.cr = 10
    expect(toggleLaw(p, 'gym', t)).toBe(false)
  })
  it('efekty trafiają do obliczeń', () => {
    const s = st(), base = calc(s)
    s.laws = ['meatless', 'nightlab', 'fest']
    const c = calc(s)
    expect(c.foodCons).toBeCloseTo(base.foodCons * 0.9)
    expect(c.maint).toBe(base.maint + 8)
    expect(c.mt).toBeCloseTo(base.mt + 6 - 3 - 3)
    s.laws = ['overtime']
    expect(workRate(s)).toBeCloseTo(0.65)
    expect(lawFx(s, 'mor')).toBe(-6)
  })
})
