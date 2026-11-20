import { describe, it, expect } from 'vitest'
import { newState } from '../../src/game/state.js'
import { calc } from '../../src/game/calc.js'
import { endTurn } from '../../src/game/turn.js'
import { workRate, workParts, addSick, WORK_MIN, WORK_MAX } from '../../src/game/workforce.js'

describe('zdolni do pracy', () => {
  it('przy morale 50, bez szpitali i chorób pracuje 60% kolonistów', () => {
    const s = newState('moon'); s.mor = 50; s.hospRed = 0; s.sick = 0
    expect(workRate(s)).toBeCloseTo(0.6)
    expect(calc(s).workforce).toBeCloseTo(s.pop * 0.6)
  })
  it('morale zmienia odsetek o najwyżej 10 punktów', () => {
    const s = newState('moon'); s.hospRed = 0
    s.mor = 100; expect(workRate(s)).toBeCloseTo(0.7)
    s.mor = 0; expect(workRate(s)).toBeCloseTo(0.5)
  })
  it('szpitale i żłobki podnoszą odsetek, epidemia go obniża', () => {
    const s = newState('moon'); s.mor = 50; s.hospRed = 1
    expect(workRate(s)).toBeCloseTo(0.65)
    s.tech.creche = true; expect(workRate(s)).toBeCloseTo(0.7)
    s.hospRed = 0; s.tech.creche = false; addSick(s)
    expect(workRate(s)).toBeCloseTo(0.5)
    expect(workParts(s).some(x => x.k === 'sick')).toBe(true)
  })
  it('odsetek nie wychodzi poza granice', () => {
    const s = newState('moon'); s.mor = 100; s.hospRed = 1; s.tech.creche = true
    expect(workRate(s)).toBeLessThanOrEqual(WORK_MAX)
    s.mor = 0; s.hospRed = 0; s.tech.creche = false; addSick(s)
    expect(workRate(s)).toBeGreaterThanOrEqual(WORK_MIN)
  })
  it('choroba mija z dniami', () => {
    const s = newState('moon'); addSick(s, 3)
    endTurn(s); s.pending = null
    expect(s.sick).toBe(2)
  })
})
