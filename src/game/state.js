import { GOAL, DAYS, KEY, BLD } from './constants.js'
import { START_DEPOSIT } from './expeditions.js'

const startDeposit = () => ({ n: 'Złoże macierzyste', t: START_DEPOSIT, max: START_DEPOSIT })

export function newState() {
  return {
    m: 1, pop: 100, food: 300, energy: 100, min: 200, cr: 500, mor: 60, rs: null, rp: {}, rq: [], q: [], dep: [startDeposit()], exp: [], camp: [],
    // każdy budynek z listy ma licznik (0, jeśli nie ma go na starcie)
    b: { ...Object.fromEntries(Object.keys(BLD).map(k => [k, 0])), farm: 3, power: 2, battery: 1, fridge: 1, store: 1, mine: 1, house: 2 },
    tax: 10, ration: 1, tech: {}, prio: {},
    pr: { food: 4, min: 6 }, prev: null, over: null,
    report: [
      { k: 'txt', t: 'Witaj, gubernatorze! Kolonia Nowa Nadzieja liczy 100 osadników.' },
      { k: 'txt', t: 'Cel: ' + GOAL + ' kolonistów w ciągu roku (' + DAYS + ' dni).' }
    ],
    repDays: 0
  }
}

export function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (e) { /* brak zapisu */ } }
export function load() {
  try {
    const v = localStorage.getItem(KEY), o = v ? JSON.parse(v) : null
    // zapisy sprzed wprowadzenia złóż i wypraw
    if (o && !o.dep) o.dep = [startDeposit()]
    if (o && !o.exp) o.exp = []
    if (o && !o.camp) o.camp = []
    if (o && !o.rq) o.rq = []
    // zapisy sprzed rozdzielenia magazynów: dotychczasowe magazyny trzymały oba surowce
    if (o && o.b && o.b.fridge == null) o.b.fridge = o.b.store || 0
    // brakujące budynki w starych zapisach
    if (o && o.b) for (const k in BLD) if (o.b[k] == null) o.b[k] = 0
    return o
  } catch (e) { return null }
}

export function score(s) {
  return Math.round(s.pop + s.mor * 5 + Math.max(0, s.cr) / 10 + Object.keys(s.tech).length * 50 + (s.over && s.over.win ? (DAYS - s.m) * 7 : 0))
}
