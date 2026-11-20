import { describe, it, expect, beforeEach } from 'vitest'
import { newState } from '../../src/game/state.js'
import { saveSlot, loadSlot, deleteSlot, listSlots, exportCode, importText } from '../../src/game/saves.js'

beforeEach(() => localStorage.clear())

describe('zapisy gry', () => {
  it('sloty: zapis, odczyt, lista i usuwanie', () => {
    const s = newState('purr'); s.m = 42; s.pop = 321
    expect(saveSlot(2, s)).toBe(true)
    expect(listSlots()).toEqual([null, expect.objectContaining({ i: 2, sc: 'purr', m: 42, pop: 321 }), null])
    expect(loadSlot(2)).toMatchObject({ sc: 'purr', m: 42 })
    deleteSlot(2)
    expect(loadSlot(2)).toBe(null)
  })
  it('kod gry: eksport i import dają ten sam stan', async () => {
    const s = newState('ice'); s.m = 100; s.cr = 1234
    const code = await exportCode(s)
    expect(code).toMatch(/^KV[01]:/)
    expect(code.length).toBeLessThan(JSON.stringify(s).length)
    const back = await importText(code)
    expect(back).toMatchObject({ sc: 'ice', m: 100, cr: 1234 })
  })
  it('plik JSON i błędne dane', async () => {
    const s = newState('moon'); s.m = 7
    expect(await importText(JSON.stringify(s))).toMatchObject({ m: 7 })
    expect(await importText('KV1:to-nie-jest-kod')).toBe(null)
    expect(await importText('{"a":1}')).toBe(null)
    expect(await importText('')).toBe(null)
  })
})
