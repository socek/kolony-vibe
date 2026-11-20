import { describe, it, expect, afterEach, vi } from 'vitest'
import { newState, score, baseScore } from '../../src/game/state.js'
import { endTurn } from '../../src/game/turn.js'
import { SCENARIOS, DIFF, scenarioOf, diffOf } from '../../src/game/scenarios.js'
import { fixRandom } from './helpers.js'

afterEach(() => vi.restoreAllMocks())

describe('scenariusze', () => {
  it('każdy ma dwuczłonową nazwę, zleceniodawcę, historię, cel i trudność', () => {
    for (const x of SCENARIOS) {
      expect(x.n.split(' ').length, x.k).toBeGreaterThanOrEqual(2)
      expect(x.patron.length, x.k).toBeGreaterThan(20)
      expect(x.story.length, x.k).toBeGreaterThan(0)
      expect(DIFF[x.diff], x.k).toBeDefined()
      expect(typeof x.goal.done, x.k).toBe('function')
    }
  })

  it('nowa gra zapamiętuje scenariusz', () => {
    expect(newState('moon').sc).toBe('moon')
    expect(scenarioOf(newState()).k).toBe('moon')
  })

  it('cel scenariusza kończy grę zwycięstwem', () => {
    fixRandom(0.5)
    const s = newState('moon'); s.pop = 1000; s.b.house = 20
    endTurn(s)
    expect(s.over.win).toBe(true)
    expect(s.over.d).toContain('Biblioteka')
  })

  it('trudność mnoży wynik', () => {
    const s = newState('moon')
    expect(score(s)).toBe(Math.round(baseScore(s) * diffOf(s).mult))
    s.sc = 'splash'
    expect(score(s)).toBe(Math.round(baseScore(s) * 2))
  })
})

import { calc } from '../../src/game/calc.js'
import { slotsInfo, buildBlock, bldAvail, techAvail, yearSeason, SCENARIOS as ALL } from '../../src/game/scenarios.js'
import { tickExpeditions } from '../../src/game/expeditions.js'

describe('scenariusze – zasady', () => {
  it('każdy scenariusz da się rozpocząć i rozegrać dzień bez NaN', () => {
    fixRandom(0.5)
    for (const x of ALL) {
      const s = newState(x.k)
      expect(x.ready, x.k).toBe(true)
      endTurn(s)
      for (const [k, v] of Object.entries(calc(s))) if (typeof v === 'number') expect(Number.isNaN(v), x.k + ' ' + k).toBe(false)
    }
  })

  it('pory roku zmieniają słońce i plony', () => {
    expect(yearSeason(1).k).toBe('winter')
    expect(yearSeason(200).k).toBe('summer')
    expect(yearSeason(250).food).toBeGreaterThan(1)
    const s = newState('purr'); s.m = 200
    const summer = calc(s).enProd; s.m = 10
    expect(calc(s).enProd).toBeLessThan(summer)
  })

  it('budynki i technologie scenariuszowe są dostępne tylko w swoim scenariuszu', () => {
    expect(bldAvail(newState('purr'), 'pen')).toBe(true)
    expect(bldAvail(newState('moon'), 'pen')).toBe(false)
    expect(bldAvail(newState('sill'), 'mine')).toBe(false)
    expect(techAvail(newState('ticktock'), 'stretch')).toBe(true)
    expect(techAvail(newState('moon'), 'stretch')).toBe(false)
  })

  it('na Chlupotce brakuje miejsca, dopóki nie zbuduje się platformy', () => {
    const s = newState('splash'); s.b.house = 20
    expect(buildBlock(s, 'farm')).toMatch(/platform/)
    expect(buildBlock(s, 'golf')).toBe('')
    const max = slotsInfo(s).max; s.b.platform = 1
    expect(slotsInfo(s).max).toBe(max + 4)
  })

  it('zagrody oswajają mruczki, a cel Mruczyska wymaga ich 50', () => {
    fixRandom(0.99)
    const s = newState('purr'); s.b.pen = 1; s.order = ['pen']
    for (let i = 0; i < 10; i++) endTurn(s)
    expect(s.tamed).toBeGreaterThanOrEqual(1)
    s.pop = 700; s.tamed = 49
    expect(scenarioOf(s).goal.done(s)).toBe(false)
    s.tamed = 50
    expect(scenarioOf(s).goal.done(s)).toBe(true)
  })

  it('Kostkolód: oczyszczalnia wysyła lód do celu', () => {
    fixRandom(0.99)
    const s = newState('ice'); s.b.icefac = 1; s.pop = 200; s.b.house = 4
    endTurn(s)
    expect(s.iceSent).toBeGreaterThan(0)
  })

  it('Parapet-3: wyprawa po złoża przywozi minerały z asteroidy', () => {
    fixRandom(0.01)
    const s = newState('sill'), min = s.min
    s.exp = [{ r: 'near', team: 5, left: 1, goal: 'dep' }]
    tickExpeditions(s, () => {})
    expect(s.dep).toHaveLength(0)
    expect(s.min).toBeGreaterThan(min)
  })
})

describe('Piaskownica', async () => {
  const { newState } = await import('../../src/game/state.js')
  const { endTurn } = await import('../../src/game/turn.js')
  const { recordGame } = await import('../../src/game/scores.js')
  const { dateOf } = await import('../../src/game/format.js')
  it('nie kończy się po 365 dniach i nie trafia do tabeli wyników', () => {
    const s = newState('sandbox'); s.m = 365; s.food = 1e5; s.cr = 1e5; s.mor = 80
    endTurn(s); s.pending = null; endTurn(s)
    expect(s.over).toBe(null)
    expect(s.m).toBe(367)
    s.over = { win: false, t: 'X', d: 'Y' }
    expect(recordGame(s)).toBe(null)
  })
  it('data przechodzi na kolejny rok', () => {
    expect(dateOf(366, true)).toBe('1 STY 2151')
    expect(dateOf(366)).toBe('31 GRU 2150')
  })
})
