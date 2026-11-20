import { describe, it, expect } from 'vitest'
import { newState } from '../../src/game/state.js'
import { calc } from '../../src/game/calc.js'
import { endTurn } from '../../src/game/turn.js'
import { specPosts, specTargets, specDeficit, trainPick, setSpecTarget, dismissSpec } from '../../src/game/specialists.js'

const fresh = () => { const s = newState('moon'); s.mor = 60; return s }

describe('cele specjalistów', () => {
  it('AUTO: cel naukowców to obsada laboratoriów i szpitali', () => {
    const s = fresh(); s.b.lab = 2; s.b.hosp = 1
    const c = calc(s)
    expect(specPosts(s, c).sci).toBe(Math.ceil(c.wNeed.lab + c.wNeed.hosp))
    expect(specTargets(s, c).sci).toBe(specPosts(s, c).sci)
  })
  it('zatrzymany budynek nie liczy się do stanowisk', () => {
    const s = fresh(); s.b.lab = 2
    const before = specPosts(s, calc(s)).sci
    s.prio.lab = 0
    expect(specPosts(s, calc(s)).sci).toBeLessThan(before)
  })
  it('szkoły kształcą specjalizację z największym brakiem', () => {
    const s = fresh(); s.spec = { sci: 0, eng: 10, sol: 10 }
    setSpecTarget(s, 'sci', 5); setSpecTarget(s, 'eng', 10); setSpecTarget(s, 'sol', 12)
    expect(trainPick(s, calc(s))).toBe('sci')
  })
  it('po osiągnięciu celów szkoły nie szkolą i nie zbierają postępu', () => {
    const s = fresh(); s.b.school = 2; s.spec = { sci: 5, eng: 5, sol: 5 }; s.trainProg = 0
    for (const T of ['sci', 'eng', 'sol']) setSpecTarget(s, T, 5)
    expect(trainPick(s, calc(s))).toBe(null)
    for (let i = 0; i < 10; i++) { endTurn(s); s.pending = null }
    expect(s.spec).toEqual({ sci: 5, eng: 5, sol: 5 })
    expect(s.trainProg).toBe(0)
  })
  it('szkoła kształci do celu', () => {
    const s = fresh(); s.b.school = 3; s.spec = { sci: 0, eng: 0, sol: 0 }
    setSpecTarget(s, 'sci', 3); setSpecTarget(s, 'eng', 0); setSpecTarget(s, 'sol', 0)
    for (let i = 0; i < 40; i++) { endTurn(s); s.pending = null }
    expect(s.spec.sci).toBe(3)
    expect(s.spec.eng + s.spec.sol).toBe(0)
  })
  it('zwolnienie zmniejsza liczbę i ustawia cel, żeby szkoła od razu nie dokształciła', () => {
    const s = fresh(); s.spec = { sci: 6, eng: 4, sol: 2 }
    expect(dismissSpec(s, 'sol')).toBe(true)
    expect(s.spec.sol).toBe(1)
    expect(specDeficit(s, calc(s)).by.sol).toBe(0)
    s.spec.sol = 0
    expect(dismissSpec(s, 'sol')).toBe(false)
  })
  it('AUTO wraca po usunięciu celu ręcznego', () => {
    const s = fresh(); setSpecTarget(s, 'eng', 50); setSpecTarget(s, 'eng', null)
    const c = calc(s)
    expect(specTargets(s, c).eng).toBe(specPosts(s, c).eng)
  })
})
