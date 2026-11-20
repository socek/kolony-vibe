import { describe, it, expect, afterEach, vi } from 'vitest'
import { newState } from '../../src/game/state.js'
import { calc } from '../../src/game/calc.js'
import { endTurn } from '../../src/game/turn.js'
import { TECH, TECH_BRANCHES, capOf, batCapOf, houseCapOf } from '../../src/game/constants.js'
import { techState, canQueue, queueTech, unqueueTech, researchNow, techDepth } from '../../src/game/research.js'
import { expChance, expDays, expRisk, rangeOf, teamOf, canSend } from '../../src/game/expeditions.js'
import { campCost, canStart } from '../../src/game/campaigns.js'
import { fixRandom } from './helpers.js'

afterEach(() => vi.restoreAllMocks())

describe('drzewo technologii', () => {
  it('ma 18 technologii wspólnych (plus scenariuszowe), każda w istniejącej gałęzi i z istniejącymi wymaganiami', () => {
    const branches = TECH_BRANCHES.map(b => b.k)
    expect(Object.keys(TECH).filter(k => !TECH[k].sc)).toHaveLength(18)
    for (const [k, t] of Object.entries(TECH)) {
      expect(branches, k).toContain(t.g)
      for (const r of t.req) expect(TECH[r], k + ' wymaga ' + r).toBeDefined()
    }
  })

  it('nie ma cykli w wymaganiach', () => {
    for (const k of Object.keys(TECH)) expect(() => techDepth(k)).not.toThrow()
    expect(techDepth('rover')).toBe(2)
  })
})

describe('kolejka badań', () => {
  it('technologia bez wymagań od razu staje się badana', () => {
    const s = newState()
    expect(queueTech(s, 'graph')).toBe(true)
    expect(s.rs).toBe('graph')
  })

  it('można kolejkować technologię, której wymagania są w kolejce', () => {
    const s = newState()
    expect(canQueue(s, 'auto')).toBe(false)
    queueTech(s, 'graph')
    expect(queueTech(s, 'auto')).toBe(true)
    expect(techState(s, 'auto')).toBe('queued')
  })

  it('po ukończeniu projektu naukowcy biorą następny z kolejki', () => {
    fixRandom(0.5)
    const s = newState(); s.b.lab = 1; s.pop = 300; s.b.house = 6
    queueTech(s, 'graph'); queueTech(s, 'auto')
    s.rp.graph = 49.9
    endTurn(s)
    expect(s.tech.graph).toBe(1)
    expect(s.rs).toBe('auto')
    expect(s.rq).toEqual([])
  })

  it('usunięcie z kolejki usuwa też technologie zależne', () => {
    const s = newState()
    queueTech(s, 'graph'); queueTech(s, 'auto'); queueTech(s, 'drill'); queueTech(s, 'sonar'); queueTech(s, 'rover')
    unqueueTech(s, 'graph')
    expect(s.rs).toBe('drill')
    expect(s.rq).toEqual(['sonar'])
  })

  it('BADAJ TERAZ przerywa bieżący projekt bez utraty postępu', () => {
    const s = newState()
    queueTech(s, 'graph'); s.rp.graph = 20
    researchNow(s, 'med')
    expect(s.rs).toBe('med')
    expect(s.rq[0]).toBe('graph')
    expect(s.rp.graph).toBe(20)
  })
})

describe('efekty technologii', () => {
  it('krioprzechowalnictwo, superkondensatory i moduły piętrowe zwiększają pojemności', () => {
    const s = newState()
    const [f, b, h] = [capOf(s, 'food'), batCapOf(s), houseCapOf(s)]
    s.tech = { cryo: 1, supercap: 1, stack: 1 }
    expect(capOf(s, 'food')).toBe(150 + 375)
    expect(f).toBe(400)
    expect(batCapOf(s)).toBe(b * 2)
    expect(houseCapOf(s)).toBe(h * 1.5)
  })

  it('syntezator żywności produkuje żywność przy 2 pracownikach', () => {
    const s = newState(); s.pop = 400; s.b.house = 8; s.b.power = 6; s.spec = { sci: 0, eng: 0, sol: 0 }
    const base = calc(s).foodProd
    s.b.synth = 1
    expect(calc(s).foodProd - base).toBeCloseTo(14)
    expect(calc(s).wNeed.synth).toBe(2)
  })

  it('holorozrywka wzmacnia centra rekreacji', () => {
    const s = newState(); s.pop = 300; s.b.house = 6; s.b.rec = 1
    const before = calc(s).recB
    s.tech.holo = 1
    expect(calc(s).recB).toBeGreaterThan(before)
  })

  it('systemy celownicze: działa potrzebują połowy obsady i są silniejsze', () => {
    const s = newState(); s.pop = 300; s.b.house = 6; s.b.gun = 2; s.spec = { sci: 0, eng: 0, sol: 0 }
    const before = calc(s)
    s.tech.targeting = 1
    const c = calc(s)
    expect(c.wNeed.gun).toBe(before.wNeed.gun / 2)
    expect(c.def).toBeCloseTo(before.def * 1.5)
  })

  it('sonary i łaziki poprawiają wyprawy, a łaziki odblokowują dalekie cele', () => {
    const s = newState(), r = rangeOf('mid'), t = teamOf(5)
    const [ch, d, risk] = [expChance(r, t, s), expDays(r, s), expRisk(r, s)]
    expect(canSend(s, 'meteor', 5)).toMatch(/technologii/)
    s.tech = { sonar: 1, rover: 1 }
    expect(expChance(r, t, s)).toBeCloseTo(ch + 0.15)
    expect(expDays(r, s)).toBe(Math.ceil(d * 0.7))
    expect(expRisk(r, s)).toBeCloseTo(risk / 2)
  })

  it('propaganda obniża koszt kampanii i odblokowuje loterię', () => {
    const s = newState(); s.cr = 5000
    expect(canStart(s, 'lottery')).toMatch(/technologii/)
    s.tech.propa = 1
    expect(campCost(s, 'posters')).toBe(105)
    expect(canStart(s, 'lottery')).toBe('')
  })
})
