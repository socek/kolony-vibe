import { describe, it, expect, afterEach, vi } from 'vitest'
import { endTurn } from '../../src/game/turn.js'
import { newState } from '../../src/game/state.js'
import { repLines } from '../../src/game/report.js'
import { fixRandom } from './helpers.js'

// 0,5: brak zdarzeń losowych (szansa 10%) i neutralne ceny
afterEach(() => vi.restoreAllMocks())
const texts = s => repLines(s).map(l => l.text).join(' | ')

describe('endTurn – podstawy', () => {
  it('przesuwa dzień i zapisuje raport z jednego dnia', () => {
    fixRandom(0.5)
    const s = newState()
    endTurn(s)
    expect(s.m).toBe(2)
    expect(s.repDays).toBe(1)
  })

  it('kończy budowę i zgłasza powód zatrzymania', () => {
    fixRandom(0.5)
    const s = newState(); s.pop = 400; s.b.house = 8; s.q = [{ k: 'battery', d: 14 }]
    const stops = endTurn(s)
    expect(s.b.battery).toBe(5)
    expect(s.q).toHaveLength(0)
    expect(stops).toContain('build')
    expect(texts(s)).toContain('Ukończono budowę: Bateria')
  })

  it('kończy badania wybranej technologii', () => {
    fixRandom(0.5)
    const s = newState(); s.b.lab = 1; s.rs = 'hydro'; s.rp = { hydro: 39.9 }; s.pop = 300; s.b.house = 6
    const stops = endTurn(s)
    expect(s.tech.hydro).toBe(1)
    expect(s.rs).toBe(null)
    expect(stops).toContain('research')
  })

  it('dokleja raport przy przewijaniu i łączy dni', () => {
    fixRandom(0.5)
    const s = newState()
    endTurn(s); endTurn(s, true); endTurn(s, true)
    expect(s.repDays).toBe(3)
    expect(texts(s)).toMatch(/Baterie naładowane\. /)
    expect(texts(s)).toMatch(/Brak rąk do pracy \(przez 3 dni\)/)
  })
})

describe('endTurn – głód', () => {
  it('rośnie dzień po dniu i dwunastego dnia kończy grę', () => {
    fixRandom(0.5)
    const s = newState(); s.b.farm = 0; s.food = 0; s.pop = 200; s.b.house = 4
    const deaths = []
    while (!s.over) { const p = s.pop; endTurn(s); deaths.push(p - s.pop) }
    expect(s.hungerDays).toBe(12)
    expect(s.over.t).toBe('ŚMIERĆ GŁODOWA')
    expect(deaths[3]).toBeGreaterThan(deaths[1])
  })

  it('dzień pełnego jedzenia przy normalnych racjach kończy głód', () => {
    fixRandom(0.5)
    const s = newState(); s.hungerDays = 6; s.food = 500
    endTurn(s)
    expect(s.hungerDays).toBe(0)
    expect(texts(s)).toContain('Koniec głodu')
  })

  it('racje głodowe wstrzymują umieranie, ale nie kończą głodu', () => {
    fixRandom(0.5)
    const s = newState(); s.hungerDays = 6; s.food = 500; s.ration = 0.75
    const pop = s.pop
    endTurn(s)
    expect(s.hungerDays).toBe(6)
    expect(s.pop).toBeGreaterThanOrEqual(pop)
    expect(texts(s)).toContain('nikt nie umiera, ale głód trwa')
  })
})

describe('endTurn – złoża', () => {
  it('kopalnia zmniejsza złoże, a wyczerpane znika', () => {
    fixRandom(0.5)
    const s = newState(); s.dep = [{ n: 'Testowe', t: 3, max: 100 }]
    const stops = endTurn(s)
    expect(s.dep).toHaveLength(0)
    expect(stops).toContain('depleted')
    expect(texts(s)).toContain('Wyczerpano: Testowe')
  })

  it('bez złóż kopalnie stoją', () => {
    fixRandom(0.5)
    const s = newState(); s.dep = []
    const min = s.min
    endTurn(s)
    expect(s.min).toBe(min)
    expect(texts(s)).toContain('Kopalnie stoją')
  })
})

describe('endTurn – zatrzymania przewijania', () => {
  it('stan długotrwały zatrzymuje tylko w dniu, w którym się zaczyna', () => {
    fixRandom(0.5)
    const s = newState()
    expect(endTurn(s)).toContain('short')
    expect(endTurn(s)).not.toContain('short')
  })

  it('koniec gry zawsze daje powód "over"', () => {
    fixRandom(0.5)
    const s = newState(); s.m = 365
    expect(endTurn(s)).toContain('over')
    expect(s.over.t).toBe('KONIEC KADENCJI')
  })
})
