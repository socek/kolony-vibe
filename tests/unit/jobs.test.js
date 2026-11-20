import { describe, it, expect } from 'vitest'
import { newState, migrate } from '../../src/game/state.js'
import { jobOrder, JOBS, JOB_ORDER } from '../../src/game/constants.js'
import { moveJob, shiftJob, setLim } from '../../src/game/jobs.js'

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
