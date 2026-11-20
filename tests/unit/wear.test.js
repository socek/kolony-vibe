import { describe, it, expect, afterEach, vi } from 'vitest'
import { newState } from '../../src/game/state.js'
import { calc } from '../../src/game/calc.js'
import { syncCond, tickWear, condMul, repairNeed } from '../../src/game/wear.js'
import { fixRandom } from './helpers.js'

afterEach(() => vi.restoreAllMocks())

describe('zużycie budynków', () => {
  it('stan spada stopniowo', () => {
    fixRandom(0.5)
    const s = newState(); syncCond(s)
    tickWear(s, 0)
    expect(s.cond.farm[0].c).toBeLessThan(100)
    expect(s.cond.farm[0].c).toBeGreaterThan(99)
  })

  it('zużyty budynek pracuje gorzej, a zepsuty wcale', () => {
    const s = newState(); syncCond(s)
    s.cond.farm = [{ c: 100, broken: false }, { c: 0.5, broken: false }, { c: 50, broken: true }]
    expect(condMul(s, 'farm')).toBeCloseTo((1 + 0.602) / 3, 2)
    const before = calc(newState()).foodProd
    expect(calc(s).foodProd).toBeLessThan(before)
  })

  it('gorszy stan – częstsze awarie', () => {
    fixRandom(0.02)
    const s = newState(); syncCond(s)
    s.cond.farm = [{ c: 95, broken: false }, { c: 5, broken: false }]
    const { broke, stops } = tickWear(s, 0)
    expect(broke).toEqual(['Farma hydroponiczna'])
    expect(stops).toContain('broke')
    expect(s.cond.farm[1].broken).toBe(true)
  })

  it('budynek zużyty do zera się rozpada', () => {
    fixRandom(0.99)
    const s = newState(); syncCond(s)
    s.cond.mine[0].c = 0.1
    const { collapsed } = tickWear(s, 0)
    expect(collapsed).toEqual(['Kopalnia'])
    expect(s.b.mine).toBe(0)
  })

  it('naprawy zaczynają od awarii i ją usuwają', () => {
    fixRandom(0.99)
    const s = newState(); syncCond(s)
    s.cond.farm[0] = { c: 20, broken: true }; s.cond.farm[1].c = 50
    tickWear(s, 25)
    expect(s.cond.farm[0].broken).toBe(false)
    expect(s.cond.farm[1].c).toBeLessThan(50)
  })

  it('konserwatorzy są potrzebni tylko przy zużytych budynkach, inżynierowie naprawiają szybciej', () => {
    const s = newState(); syncCond(s)
    expect(repairNeed(s)).toBe(0)
    s.cond.farm[0].c = 50; s.cond.mine[0].broken = true
    expect(repairNeed(s)).toBe(1.5)
    s.pop = 300; s.b.house = 6
    s.spec = { sci: 0, eng: 0, sol: 0 }
    const plain = calc(s).repairPts
    s.spec.eng = 10; s.prio = { build: 0, power: 0, mine: 0, mine2: 0, power2: 0, synth: 0, port: 0 }
    expect(calc(s).repairPts).toBeGreaterThan(plain)
  })
})
