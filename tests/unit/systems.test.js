import { describe, it, expect, afterEach, vi } from 'vitest'
import { newState, load, score } from '../../src/game/state.js'
import { EVENTS } from '../../src/game/events.js'
import { sendExpedition, canSend, tickExpeditions, extract, MIN_POP_LEFT } from '../../src/game/expeditions.js'
import { startCampaign, canStart, tickCampaigns } from '../../src/game/campaigns.js'
import { mergeRep, repLines } from '../../src/game/report.js'
import { KEY } from '../../src/game/constants.js'
import { fixRandom } from './helpers.js'

afterEach(() => { vi.restoreAllMocks(); localStorage.clear() })
const notes = () => { const out = []; return { out, note: (t, c) => out.push({ t, c }) } }

describe('wyprawy', () => {
  it('wysłanie pobiera koszt i zabiera ludzi z kolonii', () => {
    const s = newState()
    expect(sendExpedition(s, 'near', 5)).toBe(true)
    expect(s.pop).toBe(95)
    expect(s.cr).toBe(475)
    expect(s.food).toBe(295)
    expect(s.exp).toHaveLength(1)
  })

  it('w kolonii musi zostać minimum ludzi', () => {
    const s = newState(); s.pop = MIN_POP_LEFT + 4
    expect(canSend(s, 'near', 5)).toMatch(/co najmniej/)
  })

  it('udana wyprawa dodaje złoże i oddaje ludzi', () => {
    fixRandom(0.1)
    const s = newState(); s.exp = [{ r: 'near', team: 5, left: 1 }]; s.pop = 95
    const { out, note } = notes()
    expect(tickExpeditions(s, note)).toBe(1)
    expect(s.pop).toBe(100)
    expect(s.dep).toHaveLength(2)
    expect(s.dep[1].n).toMatch(/^Złoże minerałów/)
    expect(out[0].t).toContain('odkryto')
  })

  it('wydobycie zjada złoża po kolei', () => {
    const s = newState(); s.dep = [{ n: 'A', t: 5, max: 5 }, { n: 'B', t: 10, max: 10 }]
    expect(extract(s, 8)).toEqual(['A'])
    expect(s.dep).toEqual([{ n: 'B', t: 7, max: 10 }])
  })
})

describe('kampanie reklamowe', () => {
  it('kosztują kredyty i nie da się uruchomić tej samej dwa razy', () => {
    const s = newState()
    expect(startCampaign(s, 'posters')).toBe(true)
    expect(s.cr).toBe(350)
    expect(canStart(s, 'posters')).toMatch(/trwa/)
  })

  it('przybysze zostają tylko, gdy jest miejsce', () => {
    fixRandom(0.01)
    const s = newState(); s.cr = 2000; s.pop = 115; s.tech.propa = 1
    startCampaign(s, 'lottery')
    const { out, note } = notes()
    tickCampaigns(s, note)
    expect(s.pop).toBe(120)
    expect(out[0].t).toContain('zabrakło miejsca')
  })
})

describe('zdarzenia', () => {
  it('działa zmniejszają łup piratów', () => {
    fixRandom(0.9)
    const a = newState(); a.cr = 1000
    EVENTS[5](a)
    const b = newState(); b.cr = 1000; b.pop = 300; b.b.house = 6; b.b.gun = 2
    EVENTS[5](b)
    expect(1000 - b.cr).toBeLessThan(1000 - a.cr)
  })

  it('osłona przechwytuje meteoryty i ulega zniszczeniu', () => {
    const s = newState(); s.b.shield = 1
    const farms = s.b.farm
    EVENTS[0](s)
    expect(s.b.shield).toBe(0)
    expect(s.b.farm).toBe(farms)
  })

  it('uchodźcy przybywają tylko na wolne miejsca', () => {
    const s = newState(); s.pop = 120
    expect(EVENTS[8](s)).toBe(null)
  })
})

describe('raport', () => {
  it('sumuje wartości, a pola z "_" bierze z ostatniego dnia', () => {
    const old = [{ k: 'short', v: { _miss: 5 }, d: 1 }, { k: 'waste', v: { a: 3 }, d: 1 }]
    mergeRep(old, [{ k: 'short', v: { _miss: 2 }, d: 1 }, { k: 'waste', v: { a: 4 }, d: 1 }])
    expect(old[0].v._miss).toBe(2)
    expect(old[1]).toMatchObject({ v: { a: 7 }, d: 2 })
  })

  it('pusty raport to spokojny dzień', () => {
    expect(repLines({ report: [], repDays: 1 })[0].text).toBe('Spokojny dzień w kolonii.')
  })
})

describe('zapis gry', () => {
  it('uzupełnia stare zapisy o nowe pola', () => {
    const old = newState()
    delete old.dep; delete old.exp; delete old.camp; delete old.b.fridge; delete old.b.gun
    old.b.store = 2
    localStorage.setItem(KEY, JSON.stringify(old))
    const { s, dropped } = load()
    expect(dropped).toBe(false)
    expect(s.sc).toBe('moon')
    expect(s.dep).toHaveLength(1)
    expect(s.exp).toEqual([])
    expect(s.camp).toEqual([])
    expect(s.b.fridge).toBe(2)
    expect(s.b.gun).toBe(0)
  })

  it('zbyt stary albo uszkodzony zapis jest pomijany z informacją', () => {
    localStorage.setItem(KEY, JSON.stringify({ sv: 1, m: 5 }))
    expect(load()).toEqual({ s: null, dropped: true })
    localStorage.setItem(KEY, '{zepsuty')
    expect(load()).toEqual({ s: null, dropped: true })
    localStorage.clear()
    expect(load()).toEqual({ s: null, dropped: false })
  })

  it('wygrana daje premię za pozostałe dni', () => {
    const s = newState(); s.over = { win: true }
    const lose = newState(); lose.over = { win: false }
    expect(score(s)).toBeGreaterThan(score(lose))
  })
})

describe('komunikaty o bateriach', async () => {
  const { newState } = await import('../../src/game/state.js')
  const { endTurn } = await import('../../src/game/turn.js')
  const { REP } = await import('../../src/game/report.js')
  const keys = s => s.report.filter(x => x.k !== 'txt').map(x => x.k)
  it('bez baterii: ostrzeżenie „Brak baterii”', () => {
    const s = newState('moon'); s.b.battery = 0
    endTurn(s); expect(keys(s)).toContain('nobat')
    expect(REP.nobat.c).toBe('warn')
    expect(REP.nobat.f({}, 1)).toContain('Brak baterii')
  })
  it('pełne baterie: informacja „Baterie naładowane” bez ilości zmarnowanej energii', () => {
    const s = newState('moon'); s.energy = 1e6; s.b.power = 20
    endTurn(s); expect(keys(s)).toContain('batFull')
    expect(keys(s)).not.toContain('waste')
    expect(REP.batFull.f({}, 1)).toBe('Baterie naładowane.')
  })
  it('raport podaje żywność z syntezatorów i spadek morale', () => {
    const s = newState(); s.pop = 400; s.b.house = 8; s.b.farm = 0; s.b.synth = 1; s.tech.synth = true
    endTurn(s)
    const e = s.report.find(x => x.k === 'synth')
    expect(e.v.a).toBeGreaterThan(0)
    expect(REP.synth.f({ a: 12.4, _m: 3 }, 1)).toBe('Syntezatory wytworzyły 12 t żywności – syntetyczne jedzenie obniża morale (−3).')
  })
  it('„Baterie naładowane” tylko w pierwszym dniu pełnych baterii', () => {
    const s = newState('moon'); s.energy = 1e6; s.b.power = 20
    endTurn(s); expect(keys(s)).toContain('batFull')
    endTurn(s); expect(keys(s)).not.toContain('batFull')
    s.energy = 0; s.b.power = 0; endTurn(s); expect(keys(s)).not.toContain('batFull')
    s.energy = 1e6; s.b.power = 20; endTurn(s); expect(keys(s)).toContain('batFull')
  })
})

describe('skrócone komunikaty', async () => {
  const { repLines } = await import('../../src/game/report.js')
  const s = { repDays: 1, report: [{ k: 'crowd', v: {}, d: 1 }, { k: 'txt', t: '★ LUJ: nowa oferta.', tip: 'Szczegóły w zakładce IMPERIUM.', day: 1, top: 1 }] }
  it('pełne komunikaty zawierają radę, co zrobić', () => {
    const t = repLines(s).map(x => x.text)
    expect(t).toContain('Przeludnienie. Zbuduj moduły mieszkalne.')
    expect(t).toContain('★ LUJ: nowa oferta. Szczegóły w zakładce IMPERIUM.')
  })
  it('skrócone – tylko co się stało', () => {
    const t = repLines(s, true).map(x => x.text)
    expect(t).toContain('Przeludnienie.')
    expect(t).toContain('★ LUJ: nowa oferta.')
  })
})

describe('baterie po 25 kWh', async () => {
  const { newState, load, SAVE_VERSION } = await import('../../src/game/state.js')
  const { batCapOf } = await import('../../src/game/constants.js')
  it('bateria daje 25 kWh, nowa gra ma 4 baterie (100 kWh)', () => {
    const s = newState('moon')
    expect(s.b.battery).toBe(4)
    expect(batCapOf(s)).toBe(100)
  })
  it('stary zapis dostaje 4 baterie za każdą dawną – pojemność się nie zmniejsza', () => {
    const old = newState('moon'); old.sv = 3; old.b.battery = 3 // dawniej 300 kWh
    localStorage.setItem('kolony-vibe-v2', JSON.stringify(old))
    const { s } = load()
    expect(s.b.battery).toBe(12)
    expect(batCapOf(s)).toBe(300)
    expect(s.sv).toBe(SAVE_VERSION)
    localStorage.setItem('kolony-vibe-v2', JSON.stringify(s))
    expect(load().s.b.battery).toBe(12) // drugi odczyt nie mnoży ponownie
  })
})
