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
