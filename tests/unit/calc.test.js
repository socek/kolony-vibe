import { describe, it, expect } from 'vitest'
import { calc } from '../../src/game/calc.js'
import { newState } from '../../src/game/state.js'
import { capOf, BLD } from '../../src/game/constants.js'

describe('nowa gra', () => {
  it('ma licznik każdego budynku i żadne wyliczenie nie daje NaN', () => {
    const s = newState()
    for (const k of Object.keys(BLD)) expect(s.b[k], k).toBeTypeOf('number')
    const c = calc(s)
    for (const [k, v] of Object.entries(c)) if (typeof v === 'number') expect(Number.isNaN(v), k).toBe(false)
  })
})

describe('calc – przydział pracowników', () => {
  it('na starcie brakuje odrobiny rąk do pracy', () => {
    const c = calc(newState())
    expect(c.workforce).toBe(60)
    expect(c.needed).toBeGreaterThan(c.workforce)
    expect(c.e).toBeLessThan(1)
  })

  it('infrastruktura jest obsadzana przed innymi budynkami', () => {
    const s = newState(); s.pop = 20 // 12 pracowników
    const c = calc(s)
    expect(c.E.house).toBe(1)
    expect(c.E.farm).toBeLessThan(1)
  })

  it('wysoki priorytet dostaje ludzi przed niskim', () => {
    const s = newState(); s.prio = { mine: 3, farm: 1 }
    const c = calc(s)
    expect(c.E.mine).toBe(1)
    expect(c.E.farm).toBeLessThan(1)
  })

  it('STOP wyłącza budynek i jego zużycie energii', () => {
    const s = newState()
    const before = calc(s).enNeed
    s.prio = { mine: 0 }
    const c = calc(s)
    expect(c.E.mine).toBe(0)
    expect(c.minProd).toBe(0)
    expect(c.enNeed).toBeLessThan(before)
  })

  it('budowniczowie trafiają na place budowy w kolejności kolejki', () => {
    const s = newState(); s.pop = 400; s.b.house = 8; s.q = [{ k: 'house', d: 0 }, { k: 'lab', d: 0 }]
    const c = calc(s)
    expect(c.sites[0].a).toBe(4)
    expect(c.sites[0].eta).toBe(5)
    expect(c.sites[1].rate).toBeGreaterThan(0)
  })
})

describe('calc – produkcja i magazyny', () => {
  it('nowe budynki z technologii produkują więcej niż podstawowe', () => {
    const s = newState(); s.pop = 400; s.b.house = 8; s.spec = { sci: 0, eng: 0, sol: 0 }
    const base = calc(s)
    s.b.farm2 = 1; s.b.power2 = 1; s.b.mine2 = 1
    const c = calc(s)
    expect(c.foodProd - base.foodProd).toBeCloseTo(12)
    expect(c.enProd - base.enProd).toBeCloseTo(16)
    expect(c.minPot - base.minPot).toBeCloseTo(10)
  })

  it('wydobycie nie przekracza zawartości złóż', () => {
    const s = newState(); s.dep = [{ n: 'x', t: 2, max: 10 }]
    expect(calc(s).minProd).toBe(2)
    s.dep = []
    expect(calc(s).minProd).toBe(0)
  })

  it('chłodnie i magazyny minerałów mają osobne pojemności', () => {
    const s = newState(); s.b.fridge = 2; s.b.store = 0
    expect(capOf(s, 'food')).toBe(650)
    expect(capOf(s, 'min')).toBe(150)
  })

  it('obsadzone działa zmniejszają straty, nieobsadzone nie', () => {
    const s = newState(); s.pop = 300; s.b.house = 6; s.b.gun = 2; s.spec = { sci: 0, eng: 0, sol: 0 }
    expect(calc(s).defRed).toBeCloseTo(1 - 0.75 ** 2)
    s.prio = { gun: 0 }
    expect(calc(s).defRed).toBe(0)
  })
})

describe('calc – głód', () => {
  it('przewiduje kolejny dzień głodu i rosnące ofiary', () => {
    const s = newState(); s.b.farm = 0; s.food = 0; s.hungerDays = 3
    const c = calc(s)
    expect(c.hungerNext).toBe(4)
    expect(c.hungerDeaths).toBeGreaterThan(0)
  })

  it('dwunasty dzień głodu zabija wszystkich', () => {
    const s = newState(); s.b.farm = 0; s.food = 0; s.hungerDays = 11
    expect(calc(s).hungerDeaths).toBe(s.pop)
  })

  it('racje głodowe przy pełnym jedzeniu wstrzymują głód bez resetu', () => {
    const s = newState(); s.hungerDays = 5; s.food = 300; s.ration = 0.75
    const c = calc(s)
    expect(c.hungerNext).toBe(5)
    expect(c.hungerDeaths).toBe(0)
  })
})
