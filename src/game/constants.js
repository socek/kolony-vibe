import { t, localize } from '../i18n.js'

// p – produkcja dziennie, w – pracownicy, en – zużycie energii kWh/dzień,
// crew – maks. liczba budowniczych, bt – praca potrzebna do budowy (osobodni)
export const BLD = {
  farm: { cr: 120, mi: 40, w: 10, en: 1.5, p: 8, crew: 5, bt: 30 },
  farm2: { cr: 200, mi: 70, w: 10, en: 2.5, p: 12, crew: 6, bt: 45, req: 'hydro' },
  synth: { cr: 300, mi: 120, w: 2, en: 8, p: 14, crew: 6, bt: 60, req: 'synth' },
  power: { cr: 150, mi: 60, w: 6, en: 0, p: 10, crew: 5, bt: 35 },
  power2: { cr: 240, mi: 90, w: 6, en: 0, p: 16, crew: 6, bt: 50, req: 'graph' },
  battery: { cr: 35, mi: 20, w: 0.25, en: 0, crew: 3, bt: 4 },
  fridge: { cr: 110, mi: 40, w: 2, en: 1, crew: 4, bt: 20 },
  store: { cr: 100, mi: 30, w: 2, en: 0, crew: 4, bt: 20 },
  mine: { cr: 140, mi: 20, w: 12, en: 2, p: 6, crew: 6, bt: 50 },
  mine2: { cr: 230, mi: 40, w: 14, en: 3, p: 10, crew: 8, bt: 70, req: 'drill' },
  house: { cr: 100, mi: 50, w: 2, en: 1, crew: 4, bt: 20 },
  school: { cr: 260, mi: 80, w: 4, en: 1.5, crew: 6, bt: 45 },
  hosp: { cr: 280, mi: 90, w: 3, en: 2, crew: 6, bt: 50 },
  rec: { cr: 200, mi: 60, w: 6, en: 1.5, crew: 6, bt: 50 },
  lab: { cr: 250, mi: 80, w: 8, en: 2, p: 2, crew: 8, bt: 80 },
  port: { cr: 600, mi: 250, w: 15, en: 3.5, p: 13, crew: 15, bt: 300, max: 1 },
  shield: { cr: 180, mi: 90, w: 0, en: 0.5, crew: 6, bt: 60, req: 'shield' },
  // --- budynki tylko w niektórych scenariuszach (sc) ---
  fence: { cr: 180, mi: 60, w: 3, en: 1, crew: 4, bt: 25, sc: ['purr'] },
  pen: { cr: 150, mi: 40, w: 3, en: 0.5, crew: 4, bt: 20, sc: ['purr'] },
  kelp: { cr: 100, mi: 20, w: 6, en: 0.5, p: 9, crew: 4, bt: 20, sc: ['splash'] },
  platform: { cr: 150, mi: 80, w: 0, en: 0, crew: 4, bt: 20, sc: ['splash'] },
  golf: { cr: 250, mi: 60, w: 0, en: 0.5, crew: 4, bt: 25, sc: ['splash'], max: 18 },
  module: { cr: 200, mi: 120, w: 0, en: 0.5, crew: 5, bt: 30, sc: ['sill'] },
  gallery: { cr: 2500, mi: 800, w: 10, en: 6, crew: 20, bt: 400, sc: ['sill'], max: 1 },
  geo: { cr: 260, mi: 120, w: 5, en: 0, p: 18, crew: 6, bt: 50, sc: ['ice'] },
  icefac: { cr: 300, mi: 150, w: 8, en: 4, p: 6, crew: 6, bt: 50, sc: ['ice'] },
  gun: { cr: 220, mi: 100, w: 4, en: 1, crew: 5, bt: 40, req: 'cannon' }
}

// Grupy budynków na liście budowy
export const BLD_GROUPS = [
  { k: 'food', icon: 'food', color: 'var(--green)', ks: ['farm', 'farm2', 'synth', 'kelp', 'fridge'] },
  { k: 'ind', icon: 'mine', color: 'var(--yellow)', ks: ['power', 'power2', 'geo', 'battery', 'mine', 'mine2', 'store', 'lab'] },
  { k: 'pop', icon: 'pop', color: 'var(--red)', ks: ['house', 'school', 'hosp', 'rec', 'pen', 'port', 'platform', 'module'] },
  { k: 'def', icon: 'shield', color: 'var(--cyan)', ks: ['shield', 'gun', 'fence'] },
  { k: 'goal', icon: 'res', color: 'var(--white)', ks: ['golf', 'gallery', 'icefac'] }
]

// Gałęzie drzewa technologii (kolumny schematu)
export const TECH_BRANCHES = [
  { k: 'food', color: 'var(--green)' },
  { k: 'ind', color: 'var(--yellow)' },
  { k: 'pop', color: 'var(--red)' },
  { k: 'def', color: 'var(--cyan)' },
  { k: 'exp', color: 'var(--white)' },
  { k: 'trade', color: 'var(--text)' }
]

// Technologie: g – gałąź, c – koszt w punktach badań, req – wymagane technologie, d – efekt
export const TECH = {
  hydro: { g: 'food', c: 40, req: [] },
  cryo: { g: 'food', c: 50, req: [] },
  synth: { g: 'food', c: 120, req: ['hydro', 'graph'] },
  graph: { g: 'ind', c: 50, req: [] },
  drill: { g: 'ind', c: 60, req: [] },
  supercap: { g: 'ind', c: 70, req: ['graph'] },
  auto: { g: 'ind', c: 90, req: ['graph'] },
  med: { g: 'pop', c: 80, req: [] },
  stack: { g: 'pop', c: 70, req: [] },
  creche: { g: 'pop', c: 90, req: ['med', 'auto'] },
  holo: { g: 'pop', c: 100, req: ['graph'] },
  cannon: { g: 'def', c: 70, req: [] },
  shield: { g: 'def', c: 110, req: ['graph'] },
  targeting: { g: 'def', c: 100, req: ['cannon', 'auto'] },
  sonar: { g: 'exp', c: 60, req: ['drill'] },
  rover: { g: 'exp', c: 90, req: ['sonar', 'auto'] },
  chrono1: { g: 'ind', c: 120, req: ['graph'], sc: ['ticktock'] },
  chrono2: { g: 'ind', c: 180, req: ['chrono1', 'auto'], sc: ['ticktock'] },
  stretch: { g: 'ind', c: 300, req: ['chrono2', 'med'], sc: ['ticktock'] },
  exchange: { g: 'trade', c: 60, req: [] },
  propa: { g: 'trade', c: 80, req: ['exchange', 'holo'] }
}

export const RES = { food: { n: 'Żywność', base: 4 }, min: { n: 'Minerały', base: 6 } }

export const BATCAP = 25, STBASE = 150, STCAP = 250, MAINT = 1, MORK = 0.11
export const HUNGER_MAX = 12 // po tylu dniach głodu kolonia wymiera
export const DAYS = 365, YEAR = 2150, KEY = 'kolony-vibe-v2'

export const INFRA = ['battery', 'fridge', 'store', 'house', 'shield', 'platform', 'module', 'golf']
export const JOBS = ['build', 'repair', 'farm', 'farm2', 'synth', 'power', 'power2', 'mine', 'mine2', 'school', 'hosp', 'rec', 'lab', 'port', 'gun', 'hunt', 'kelp', 'geo', 'icefac', 'fence', 'pen', 'gallery']
export const PRIO = [[0], [1], [2], [3]]
export const TABS = [['raport'], ['budowa'], ['praca'], ['wyprawy'], ['rynek'], ['polityka'], ['nauka'], ['statystyki']]
export const RATIONS = [[0.75], [1], [1.25]]
export const MDAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

// Specjaliści: jobs – stanowiska, na których dają premię; req – stanowiska tylko dla nich
export const SPEC = {
  sci: { jobs: ['lab', 'hosp'], req: ['lab', 'hosp'] },
  eng: { jobs: ['build', 'repair', 'geo', 'icefac', 'power', 'power2', 'mine', 'mine2', 'synth', 'port'], req: [] },
  sol: { jobs: ['gun', 'fence', 'hunt'], req: [] }
}
export const SPEC_BONUS = 1.5 // sprawność specjalisty na swoim stanowisku (zwykły kolonista = 1)
export const SPEC_REQ = ['lab', 'hosp']
export const prioOf = (s, k) => INFRA.includes(k) ? 9 : ((s.prio || {})[k] ?? 2)
export const jobName = k => k === 'build' || k === 'repair' || k === 'hunt' ? t('job.' + k) : BLD[k].n
// pojemność magazynu danego surowca: żywność w chłodniach, minerały w magazynach minerałów
export const capOf = (s, k) => k === 'food'
  ? STBASE + (s.b.fridge || 0) * STCAP * (s.tech.cryo ? 1.5 : 1)
  : STBASE + (s.b.store || 0) * STCAP
// pojemność baterii i liczba miejsc w modułach mieszkalnych (zależą od technologii)
export const batCapOf = s => (s.b.battery || 0) * BATCAP * (s.tech.supercap ? 2 : 1)
export const HOUSE_CAP = 60
export const houseCapOf = s => (s.b.house || 0) * HOUSE_CAP * (s.tech.stack ? 1.5 : 1)
// czy technologia istnieje w scenariuszu tej gry (część technologii jest tylko w wybranych scenariuszach)
export const techIn = (s, k) => !TECH[k].sc || TECH[k].sc.includes(s.sc || 'moon')
// czy wszystkie wymagania technologii są odkryte
export const techReady = (s, k) => TECH[k].req.every(r => s.tech[r])

// Teksty (nazwy, opisy, etykiety) pochodzą ze słowników w src/locales – tu stają się getterami zależnymi od języka.
localize(BLD, 'bld', ['n', 'd'])
localize(TECH, 'tech', ['n', 'd'])
localize(SPEC, 'spec', ['n', 'one'])
for (const g of BLD_GROUPS) Object.defineProperty(g, 'n', { get: () => t('bldgrp.' + g.k), enumerable: true })
for (const b of TECH_BRANCHES) Object.defineProperty(b, 'n', { get: () => t('branch.' + b.k), enumerable: true })
// pary [wartość, etykieta] – etykieta jako getter, więc destrukturyzacja [k, l] dalej działa
const labels = (arr, prefix) => arr.forEach(x => Object.defineProperty(x, 1, { get: () => t(prefix + x[0]), enumerable: true }))
labels(TABS, 'tab.')
labels(PRIO, 'prio.')
labels(RATIONS, 'ration.')
