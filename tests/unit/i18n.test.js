import { describe, it, expect, afterEach } from 'vitest'
import { i18n, t, setLang, detectLang, LANGS } from '../../src/i18n.js'
import { plForm } from '../../src/plural.js'
import { BLD, TECH, TABS } from '../../src/game/constants.js'
import { REP, repLines } from '../../src/game/report.js'
import { STOPS } from '../../src/game/stops.js'
import { HINTS } from '../../src/game/hints.js'
import { daysTxt, dateOf } from '../../src/game/format.js'

afterEach(() => { i18n.lang = 'pl' })

describe('tłumaczenia', () => {
  it('każdy klucz polski ma odpowiednik angielski i odwrotnie', () => {
    const pl = Object.keys(LANGS.pl.dict), en = Object.keys(LANGS.en.dict)
    expect(pl.filter(k => !en.includes(k))).toEqual([])
    expect(en.filter(k => !pl.includes(k))).toEqual([])
  })
  it('dane gry zmieniają język razem z ustawieniem', () => {
    expect(BLD.farm.n).toBe('Farma hydroponiczna')
    i18n.lang = 'en'
    expect(BLD.farm.n).toBe('Hydroponic farm')
    expect(TECH.hydro.n).toBe('Aeroponics')
    const [k, l] = TABS[0]
    expect([k, l]).toEqual(['raport', 'REPORT'])
    expect(STOPS.find(x => x.k === 'build').n).toBe('Construction completed')
    expect(HINTS.short.t).toBe('Labour shortage')
  })
  it('raport i formaty po angielsku', () => {
    i18n.lang = 'en'
    expect(REP.crowd.f({}, 3)).toBe('Overcrowding (over 3 days).')
    expect(REP.crowd.tip).toBe('Build housing modules.')
    expect(daysTxt(1)).toBe('1 day')
    expect(dateOf(32)).toBe('1 FEB 2150')
    expect(repLines({ repDays: 1, report: [] })[0].text).toBe('A quiet day in the colony.')
  })
  it('polska odmiana liczebników', () => {
    expect([1, 2, 5, 12, 22, 25].map(n => plForm(n, 'dzień', 'dni', 'dni'))).toEqual(['dzień', 'dni', 'dni', 'dni', 'dni', 'dni'])
    expect([1, 2, 5, 13, 22].map(n => plForm(n, 'osoba', 'osoby', 'osób'))).toEqual(['osoba', 'osoby', 'osób', 'osób', 'osoby'])
  })
  it('brakujący klucz zwraca sam klucz, nieznany język jest ignorowany', () => {
    expect(t('nie.ma.takiego')).toBe('nie.ma.takiego')
    setLang('xx'); expect(i18n.lang).toBe('pl')
  })
  it('język z przeglądarki: polski → pl, inny → en', () => {
    localStorage.removeItem('kolony-vibe-lang')
    const orig = navigator.languages
    Object.defineProperty(navigator, 'languages', { value: ['de-DE', 'en'], configurable: true })
    expect(detectLang()).toBe('en')
    Object.defineProperty(navigator, 'languages', { value: ['pl-PL'], configurable: true })
    expect(detectLang()).toBe('pl')
    Object.defineProperty(navigator, 'languages', { value: orig, configurable: true })
    setLang('en'); expect(detectLang()).toBe('en')
    localStorage.removeItem('kolony-vibe-lang')
  })
})
