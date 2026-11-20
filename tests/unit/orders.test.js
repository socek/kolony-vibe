import { describe, it, expect, afterEach, vi } from 'vitest'
import { newState } from '../../src/game/state.js'
import { makeOffer, accept, canAccept, deliver, canDeliver, tickOrders, ensureOrders } from '../../src/game/orders.js'
import { fixRandom } from './helpers.js'

afterEach(() => vi.restoreAllMocks())
const notes = () => { const out = []; return { out, note: t => out.push(t) } }

describe('zlecenia LUJ', () => {
  it('oferta pojawia się co jakiś czas i wygasa, jeśli jej nie przyjmiesz', () => {
    fixRandom(0.5)
    const s = newState(); s.m = 15
    const { note } = notes()
    expect(tickOrders(s, note)).toContain('order')
    expect(s.ord.offers).toHaveLength(1)
    s.m = 25
    tickOrders(s, note)
    expect(s.ord.offers).toHaveLength(0)
  })

  it('przyjęcie ustala termin, a dostawa daje nagrodę i reputację', () => {
    fixRandom(0.1) // dostawa żywności, nagroda: kredyty
    const s = newState(); s.food = 1000
    const x = makeOffer(s)
    expect(x.kind).toBe('food')
    expect(accept(s, x.id)).toBe(true)
    expect(s.ord.active[0].deadline).toBe(s.m + x.days)
    const cr = s.cr
    expect(deliver(s, x.id)).toMatch(/Zlecenie wykonane/)
    expect(s.food).toBe(1000 - x.amount)
    expect(s.cr).toBeGreaterThan(cr)
    expect(s.ord.rep).toBeGreaterThan(50)
  })

  it('nie da się dostarczyć bez towaru', () => {
    fixRandom(0.1)
    const s = newState(); s.food = 0
    const x = makeOffer(s); accept(s, x.id)
    expect(canDeliver(s, x.id)).toMatch(/Za mało/)
    expect(deliver(s, x.id)).toBe(null)
  })

  it('niewykonane zlecenie daje karę i obniża reputację', () => {
    fixRandom(0.1)
    const s = newState()
    const x = makeOffer(s); accept(s, x.id)
    s.m = x.deadline + 1
    const { out, note } = notes()
    expect(tickOrders(s, note)).toContain('orderFail')
    expect(s.ord.active).toHaveLength(0)
    expect(s.ord.rep).toBeLessThan(50)
    expect(out.join()).toContain('minął termin')
  })

  it('zlecenie badawcze wykonuje się samo po odkryciu technologii', () => {
    const s = newState(); ensureOrders(s)
    s.ord.active.push({ id: 9, kind: 'tech', tech: 'med', deadline: 99, reward: { cr: 300, pop: 0, techpts: 0, building: null }, penalty: { kind: 'none' } })
    s.tech.med = 1
    const cr = s.cr
    tickOrders(s, () => {})
    expect(s.cr).toBe(cr + 300)
    expect(s.ord.active).toHaveLength(0)
  })

  it('najwyżej 3 zlecenia naraz', () => {
    fixRandom(0.1)
    const s = newState()
    for (let i = 0; i < 3; i++) { const x = makeOffer(s); accept(s, x.id) }
    const x = makeOffer(s)
    expect(canAccept(s, x.id)).toMatch(/najwyżej 3/)
  })
})
