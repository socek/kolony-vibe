import { t } from '../i18n.js'
import { DAYS, KEY, BLD, JOB_ORDER } from './constants.js'
import { START_DEPOSIT } from './expeditions.js'
import { siteIds } from './jobs.js'
import { SCENARIOS, scenarioOf, diffOf } from './scenarios.js'

// Wersja formatu zapisu. Zapisy starsze niż MIN_SAVE_VERSION nie dają się wczytać.
// 4: bateria mieści 25 kWh zamiast 100
export const SAVE_VERSION = 5, MIN_SAVE_VERSION = 2

const startDeposit = () => ({ n: t('state.homeDeposit'), t: START_DEPOSIT, max: START_DEPOSIT })

export function newState(sc = 'moon') {
  const scen = SCENARIOS.find(x => x.k === sc) || SCENARIOS[0]
  const s = {
    sc: scen.k, sv: SAVE_VERSION,
    m: 1, pop: 100, food: 300, energy: 100, min: 200, cr: 500, mor: 60, rs: null, rp: {}, rq: [], q: [],
    // specjaliści (część pracowników) i szkolenie w szkołach
    spec: { sci: 6, eng: 4, sol: 2 }, specTgt: {}, trainProg: 0, dep: [startDeposit()], exp: [], camp: [],
    // każdy budynek z listy ma licznik (0, jeśli nie ma go na starcie)
    b: { ...Object.fromEntries(Object.keys(BLD).map(k => [k, 0])), farm: 3, power: 2, battery: 4, fridge: 1, store: 1, mine: 1, house: 2 },
    tax: 10, ration: 1, tech: {}, order: [...JOB_ORDER], lim: {},
    pr: { food: 4, min: 6 }, prev: null, over: null,
    report: [],
    repDays: 0
  }
  if (scen.start) scen.start(s)
  // powitanie po zmianach scenariusza (liczba osadników może być inna niż 100)
  s.report = [
    { k: 'txt', t: t('state.welcome', { n: scen.n, pop: s.pop }) },
    { k: 'txt', t: scen.endless ? t('state.goalFree') : t('state.goal', { g: scen.goal.text, d: DAYS }) }
  ]
  return s
}

export function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (e) { /* brak zapisu */ } }
// Zwraca { s, dropped }: s – wczytany stan albo null, dropped – zapis istniał, ale jest niezgodny
export function load() {
  try {
    const v = localStorage.getItem(KEY), o = v ? JSON.parse(v) : null
    if (!o) return { s: null, dropped: false }
    return migrate(o)
  } catch (e) { return { s: null, dropped: true } }
}

// Uzupełnia zapis (z autozapisu, slotu albo importu) do obecnej wersji; { s, dropped } jak load()
export function migrate(o) {
  try {
    if (!o || typeof o !== 'object' || (o.sv || 2) < MIN_SAVE_VERSION || !o.b) return { s: null, dropped: true }
    // zapisy sprzed wprowadzenia złóż, wypraw, kampanii, kolejki badań i scenariuszy
    if (!o.dep) o.dep = [startDeposit()]
    if (!o.exp) o.exp = []
    if (!o.camp) o.camp = []
    if (!o.rq) o.rq = []
    if (!o.sc) o.sc = 'moon'
    // zapisy sprzed specjalistów: tylu, żeby obsadzić istniejące laboratoria, szpitale i działa
    if (!o.spec) { o.spec = { sci: Math.max(6, (o.b.lab || 0) * 8), eng: 4, sol: Math.max(2, (o.b.gun || 0) * 4) }; o.trainProg = 0 }
    // zapisy sprzed rozdzielenia magazynów: dotychczasowe magazyny trzymały oba surowce
    if (o.b.fridge == null) o.b.fridge = o.b.store || 0
    // zapisy sprzed 0.4: bateria mieściła 100 kWh, teraz 25 – cztery razy więcej baterii daje tę samą pojemność
    if ((o.sv || 2) < 4 && o.b.battery) o.b.battery *= 4
    // zapisy sprzed 0.4: poziomy priorytetu (0 STOP, 1–3) zamieniają się w kolejność zadań (wyższy wyżej) i limit 0 dla STOP
    if (!o.order) {
      const p = o.prio || {}, lv = k => p[k] ?? 2
      o.order = [...JOB_ORDER].sort((a, b) => lv(b) - lv(a))
      o.lim = Object.fromEntries(Object.keys(p).filter(k => p[k] === 0).map(k => [k, 0]))
      delete o.prio
    }
    if (!o.lim) o.lim = {}
    siteIds(o)
    // brakujące budynki w starych zapisach
    for (const k in BLD) if (o.b[k] == null) o.b[k] = 0
    o.sv = SAVE_VERSION
    return { s: o, dropped: false }
  } catch (e) { return { s: null, dropped: true } }
}

// wynik: punkty za stan kolonii pomnożone przez trudność scenariusza
export const baseScore = s => Math.round(s.pop + s.mor * 5 + Math.max(0, s.cr) / 10 + Object.keys(s.tech).length * 50 + (s.over && s.over.win ? (DAYS - s.m) * 7 : 0))
export const score = s => Math.round(baseScore(s) * diffOf(s).mult)
