import { describe, it, expect, afterEach, vi } from 'vitest'
import { newState } from '../../src/game/state.js'
import { endTurn } from '../../src/game/turn.js'
import { BADGES, newBadges, trackStats } from '../../src/game/badges.js'
import { hall, recordGame, grantBadges } from '../../src/game/scores.js'
import { fixRandom } from './helpers.js'

afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); hall.scores.length = 0; for (const k in hall.badges) delete hall.badges[k] })

describe('historia', () => {
  it('każdy dzień dopisuje punkt danych, a ważne wydarzenia – znacznik', () => {
    fixRandom(0.5)
    const s = newState(); s.pop = 400; s.b.house = 8; s.q = [{ k: 'battery', d: 14 }]
    endTurn(s); endTurn(s)
    expect(s.hist).toHaveLength(2)
    expect(s.hist[0]).toMatchObject({ d: 1, pop: expect.any(Number), deps: expect.any(Number) })
    expect(s.marks).toContainEqual({ d: 1, k: 'build' })
  })
})

describe('odznaki', () => {
  it('jest ich 10 i każda ma opis', () => {
    expect(BADGES).toHaveLength(10)
    for (const b of BADGES) expect(b.d.length, b.k).toBeGreaterThan(10)
  })

  it('zdobyte odznaki nie powtarzają się', () => {
    const s = newState(); s.pop = 600; s.cr = 20000
    const got = newBadges(s, {})
    expect(got).toEqual(expect.arrayContaining(['pop500', 'rich']))
    grantBadges(got)
    expect(newBadges(s, hall.badges)).toEqual([])
  })

  it('morale 90%+ przez 30 dni daje odznakę', () => {
    const s = newState(); s.mor = 95
    for (let i = 0; i < 30; i++) trackStats(s)
    expect(newBadges(s, {})).toContain('happy')
  })
})

describe('tabela wyników', () => {
  it('zapisuje grę raz i podaje miejsce', () => {
    const a = newState(); a.over = { win: false, t: 'KONIEC' }; a.pop = 50
    const b = newState(); b.over = { win: true, t: 'ZWYCIĘSTWO!' }; b.pop = 1000
    expect(recordGame(a)).toBe(1)
    expect(recordGame(b)).toBe(1)
    expect(recordGame(b)).toBe(null)
    expect(hall.scores.map(x => x.win)).toEqual([true, false])
    expect(JSON.parse(localStorage.getItem('kolony-vibe-scores'))).toHaveLength(2)
  })
})

import { HINTS, pickHint } from '../../src/game/hints.js'
describe('podpowiedzi', () => {
  it('wybiera nieużytą i niewyłączoną podpowiedź pasującą do sytuacji', () => {
    expect(pickHint(['short', 'black'], [], {})).toBe('short')
    expect(pickHint(['short', 'black'], ['short'], {})).toBe('black')
    expect(pickHint(['short'], [], { short: true })).toBe(null)
    for (const k in HINTS) expect(HINTS[k].d.length, k).toBeGreaterThan(30)
  })
})
