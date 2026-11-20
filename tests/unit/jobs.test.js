import { describe, it, expect } from 'vitest'
import { newState, migrate } from '../../src/game/state.js'
import { jobOrder, pwrOrder, JOBS, JOB_ORDER } from '../../src/game/constants.js'
import { moveJob, shiftJob, setLim, movePwr, shiftPwr, setPlim, newSite, moveSite, shiftSite, setSiteLim } from '../../src/game/jobs.js'
import { calc } from '../../src/game/calc.js'
import { endTurn } from '../../src/game/turn.js'

describe('kolejność zadań i limity', () => {
  it('domyślna kolejność obejmuje wszystkie zadania', () => {
    expect([...jobOrder(newState())].sort()).toEqual([...JOBS].sort())
  })
  it('moveJob wstawia zadanie przed inne albo na koniec', () => {
    const s = newState()
    moveJob(s, 'mine', 'repair'); expect(jobOrder(s)[0]).toBe('mine')
    moveJob(s, 'mine', null); expect(jobOrder(s).at(-1)).toBe('mine')
  })
  it('shiftJob przesuwa wśród widocznych zadań', () => {
    const s = newState(), vis = ['farm', 'power', 'mine']
    expect(shiftJob(s, 'mine', -1, vis)).toBe(true)
    expect(jobOrder(s).filter(k => vis.includes(k))).toEqual(['farm', 'mine', 'power'])
    expect(shiftJob(s, 'farm', -1, vis)).toBe(false)
    shiftJob(s, 'farm', 1, vis)
    expect(jobOrder(s).filter(k => vis.includes(k))).toEqual(['mine', 'farm', 'power'])
  })
  it('setLim: liczba albo bez limitu', () => {
    const s = newState()
    setLim(s, 'farm', 3.4); expect(s.lim.farm).toBe(3)
    setLim(s, 'farm', null); expect(s.lim.farm).toBeUndefined()
  })
  it('stare priorytety zamieniają się w kolejność, a STOP w limit 0', () => {
    const o = newState(); delete o.order; delete o.lim; o.sv = 4
    o.prio = { mine: 3, farm: 1, gun: 0 }
    const { s } = migrate(o)
    const ord = jobOrder(s)
    expect(ord[0]).toBe('mine')
    expect(ord.indexOf('farm')).toBeGreaterThan(ord.indexOf('power'))
    expect(s.lim).toEqual({ gun: 0 })
    expect(s.prio).toBeUndefined()
    expect(JOB_ORDER.length).toBe(JOBS.length)
  })
})

describe('place budowy: kolejność i limity', () => {
  const withSites = () => {
    const s = newState(); s.pop = 400; s.b.house = 8
    s.q = [newSite(s, 'house'), newSite(s, 'lab'), newSite(s, 'farm')]
    return s
  }
  it('limit placu ogranicza jego budowniczych, a reszta idzie na kolejne place', () => {
    const s = withSites(), full = calc(s)
    setSiteLim(s, s.q[0].id, 1)
    const c = calc(s)
    expect(c.sites[0].a).toBeCloseTo(1)
    expect(c.wNeed.build).toBeLessThan(full.wNeed.build)
    setSiteLim(s, s.q[0].id, 0)
    expect(calc(s).sites[0].rate).toBe(0)
  })
  it('przesuwanie placów w kolejce', () => {
    const s = withSites(), [a, b, f] = s.q.map(x => x.id)
    moveSite(s, f, a); expect(s.q.map(x => x.id)).toEqual([f, a, b])
    shiftSite(s, f, 1); expect(s.q.map(x => x.id)).toEqual([a, f, b])
    expect(shiftSite(s, a, -1)).toBe(false)
    moveSite(s, a, null); expect(s.q.map(x => x.id)).toEqual([f, b, a])
  })
  it('wstrzymane place nie zgłaszają „budowa stoi”', () => {
    const s = withSites()
    for (const x of s.q) setSiteLim(s, x.id, 0)
    endTurn(s)
    expect(s.report.some(x => x.k === 'stall')).toBe(false)
  })
  it('stare zapisy dostają id placów', () => {
    const o = newState(); o.q = [{ k: 'farm', d: 3 }, { k: 'house', d: 0 }]; o.sv = 4
    const { s } = migrate(o)
    expect(s.q[0].id).toBeTruthy()
    expect(s.q[0].id).not.toBe(s.q[1].id)
  })
})

describe('prąd: kolejność zasilania i limity', () => {
  // kolonia bez elektrowni i z pustymi bateriami – prądu jest tyle, ile ustawimy w s.energy
  const dark = () => {
    const s = newState(); s.pop = 400; s.b.house = 8; s.b.farm = 4; s.b.mine = 2; s.b.lab = 1; s.spec.sci = 10
    s.b.power = 0; s.b.power2 = 0; s.energy = 0
    return s
  }
  it('infrastruktura i ogrzewanie dostają prąd pierwsze, potem odbiorcy po kolei', () => {
    const s = dark(), c0 = calc(s)
    s.energy = c0.enInfra + c0.enWant.farm // starczy tylko na infrastrukturę i farmy
    const c = calc(s)
    expect(c.gotInfra).toBeCloseTo(c.enInfra)
    expect(c.P.farm).toBeCloseTo(1)
    expect(c.P.mine).toBeCloseTo(0)
    expect(c.minPot).toBeCloseTo(0)
    movePwr(s, 'mine', 'farm')
    const c2 = calc(s)
    expect(c2.P.mine).toBeCloseTo(1)
    expect(c2.P.farm).toBeLessThan(1)
  })
  it('limit odłącza część budynków: mniej produkcji i zużycia, ale to nie blackout', () => {
    const s = newState(), full = calc(s)
    setPlim(s, 'farm', 2)
    const c = calc(s)
    expect(c.P.farm).toBeCloseTo(2 / s.b.farm)
    expect(c.enNeed).toBeLessThan(full.enNeed)
    expect(c.f).toBe(1)
    setPlim(s, 'farm', 0)
    expect(calc(s).P.farm).toBe(0)
  })
  it('shiftPwr i setPlim', () => {
    const s = newState(), vis = ['farm', 'mine', 'lab']
    expect(shiftPwr(s, 'mine', -1, vis)).toBe(true)
    expect(pwrOrder(s).filter(k => vis.includes(k))).toEqual(['mine', 'farm', 'lab'])
    setPlim(s, 'lab', null); expect(s.plim.lab).toBeUndefined()
  })
})
