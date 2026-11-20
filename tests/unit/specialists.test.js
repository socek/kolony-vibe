import { describe, it, expect, afterEach, vi } from 'vitest'
import { newState } from '../../src/game/state.js'
import { calc } from '../../src/game/calc.js'
import { endTurn } from '../../src/game/turn.js'
import { EVENTS } from '../../src/game/events.js'
import { sendExpedition, tickExpeditions, nbTrade, nbWait } from '../../src/game/expeditions.js'
import { fixRandom } from './helpers.js'

afterEach(() => vi.restoreAllMocks())
const big = s => { s.pop = 400; s.b.house = 8; return s }

describe('specjaliści', () => {
  it('laboratorium obsadzają tylko naukowcy', () => {
    const s = big(newState()); s.b.lab = 1
    s.spec = { sci: 0, eng: 0, sol: 0 }
    expect(calc(s).E.lab).toBe(0)
    s.spec.sci = 8
    expect(calc(s).E.lab).toBe(1)
  })

  it('inżynierowie zwiększają produkcję elektrowni', () => {
    const s = big(newState()); s.spec = { sci: 0, eng: 0, sol: 0 }
    const before = calc(s).enProd
    s.spec.eng = 12
    expect(calc(s).enProd).toBeGreaterThan(before)
  })

  it('szkoła kształci wybraną specjalizację', () => {
    fixRandom(0.5)
    const s = big(newState()); s.b.school = 1; s.train = 'eng'
    const eng = s.spec.eng
    for (let i = 0; i < 4; i++) endTurn(s)
    expect(s.spec.eng).toBe(eng + 1)
  })

  it('gdy ludzi ubywa, specjalistów też ubywa', () => {
    fixRandom(0.5)
    const s = newState(); s.spec = { sci: 30, eng: 20, sol: 10 }; s.pop = 50
    endTurn(s)
    expect(s.spec.sci + s.spec.eng + s.spec.sol).toBeLessThanOrEqual(s.pop * 0.6 + 1)
  })

  it('szpital osłabia epidemię', () => {
    const a = big(newState()); EVENTS[1](a)
    const b = big(newState()); b.b.hosp = 2; EVENTS[1](b)
    expect(b.pop).toBeGreaterThan(a.pop)
  })
})

describe('wyprawy – cele i specjaliści', () => {
  it('specjaliści wyruszają z ekipą i wracają', () => {
    fixRandom(0.99) // brak strat i brak znalezisk
    const s = newState()
    expect(sendExpedition(s, 'mid', 5, 'ruins', 1, 1)).toBe(true)
    expect(s.spec.sol).toBe(1); expect(s.spec.eng).toBe(3)
    s.exp[0].left = 1
    tickExpeditions(s, () => {})
    expect(s.spec.sol).toBe(2); expect(s.spec.eng).toBe(4)
  })

  it('ruiny dają punkty badań, wraki – łup', () => {
    fixRandom(0.01)
    const s = newState(); s.rs = 'graph'
    s.exp = [{ r: 'near', team: 5, left: 1, goal: 'ruins' }]; s.pop = 95
    const out = []
    tickExpeditions(s, t => out.push(t))
    expect(s.rp.graph).toBeGreaterThan(0)
    expect(out[0]).toContain('ruinach')
  })

  it('osadnicy mogą zostać stałymi sąsiadami, z którymi się handluje co 7 dni', () => {
    fixRandom(0.01)
    const s = newState(); s.exp = [{ r: 'near', team: 5, left: 1, goal: 'settlers' }]
    tickExpeditions(s, () => {})
    expect(s.nb).toBeTruthy()
    expect(nbTrade(s, 'min')).toBe(true)
    expect(nbWait(s, 'min')).toBe(7)
    expect(nbTrade(s, 'min')).toBe(false)
  })
})
