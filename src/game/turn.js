import { BLD, TECH, RES, BATCAP, MORK, GOAL, DAYS, prioOf, jobName, capOf } from './constants.js'
import { calc, nextTech } from './calc.js'
import { EVENTS, EVENT_BAD } from './events.js'
import { mergeRep } from './report.js'
import { beep } from './audio.js'
import { extract, tickExpeditions } from './expeditions.js'

export function clampStore(s) {
  const l = { food: Math.max(0, s.food - capOf(s, 'food')), min: Math.max(0, s.min - capOf(s, 'min')) }
  s.food -= l.food; s.min -= l.min
  return l
}

export const snapshot = s => ({ pop: s.pop, food: s.food, energy: s.energy, min: s.min, cr: s.cr, mor: s.mor })

// Rozgrywa jeden dzień. acc = true dokleja raport do raportu z poprzednich dni.
// Zwraca listę powodów, dla których przewijanie mogłoby się zatrzymać (klucze z STOPS w stops.js).
export function endTurn(s, acc) {
  if (s.over) return ['over']
  const c = calc(s), r = [], stops = new Set(), was = s.was || {}, now = {}
  // edge: powód tylko w dniu, w którym problem się zaczyna
  const edge = (k, cond) => { now[k] = !!cond; if (cond && !was[k]) stops.add(k) }
  const add = (k, v) => r.push({ k, v: v || {}, d: 1 })
  const note = (t, cl) => r.push({ k: 'txt', t, c: cl, day: s.m, top: 1 })

  s.prev = snapshot(s)
  s.energy = c.enStore
  if (c.enWaste > 0.01) add('waste', { a: c.enWaste })
  s.food += c.foodProd - c.foodCons
  let deaths = 0
  if (s.food < 0) {
    deaths = s.pop * 0.066 * c.shortRatio; s.food = 0
    add('hunger', { a: deaths })
  }
  s.min += c.minProd
  for (const n of extract(s, c.minProd)) { note('Wyczerpano: ' + n + '.', 'warn'); stops.add('depleted') }
  edge('nodep', s.b.mine > 0 && !s.dep.length)
  if (s.b.mine > 0 && !s.dep.length) add('nodep')
  s.cr += c.taxInc + c.trade - c.maint
  s.mor += (c.mt - s.mor) * MORK

  // postęp budowy
  if (s.q.length) {
    s.q.forEach((x, i) => x.d += c.sites[i].rate)
    s.q = s.q.filter(x => {
      if (x.d < BLD[x.k].bt) return true
      s.b[x.k]++; stops.add('build')
      note('★ Ukończono budowę: ' + BLD[x.k].n + '.', 'pos'); beep(520, 0.12)
      return false
    })
    if (s.q.length && c.builders < 0.5) add('stall')
  }
  edge('stall', s.q.length && c.builders < 0.5)
  edge('short', c.e < 1)
  if (c.e < 1) {
    const miss = Math.ceil(c.needed - c.workforce)
    const low = [...Object.keys(BLD).filter(k => s.b[k]), ...(c.wNeed.build ? ['build'] : [])]
      .filter(k => prioOf(s, k) > 0 && c.E[k] < 1).map(k => jobName(k) + ' ' + Math.floor(c.E[k] * 100) + '%')
    add('short', { _miss: miss, _low: low.join(', ') })
  }
  edge('black', c.f < 1)
  if (c.f < 1) add('black', { p: c.f * 100 })
  edge('crowd', c.crowd > 0)
  if (c.crowd > 0) add('crowd')
  if (!deaths && s.pop < c.cap) {
    const g = Math.min(s.pop * 0.0082 * (s.mor / 60) * (s.tech.med ? 1.3 : 1), c.cap - s.pop)
    s.pop += g
    if (g > 0) add('born', { a: g })
  }
  if (s.b.port && s.mor > 55 && s.pop < c.cap) {
    const im = Math.min(1.5 + Math.random() * 3.5, c.cap - s.pop)
    s.pop += im
    if (im > 0) add('imm', { a: im })
  }
  edge('emig', s.mor < 25)
  if (s.mor < 25) {
    const em = s.pop * 0.01
    s.pop -= em
    add('emig', { a: em })
  }
  s.pop -= deaths
  if (tickExpeditions(s, note)) stops.add('exp')
  if (s.m > 10 && Math.random() < 0.1) {
    const ei = Math.floor(Math.random() * EVENTS.length), m = EVENTS[ei](s)
    if (m) { stops.add(EVENT_BAD[ei] ? 'evBad' : 'evGood'); note('★ ' + m, 'sub'); beep(220, 0.25) }
  }
  for (const k in s.pr) { const b = RES[k].base; s.pr[k] = Math.max(b * 0.5, Math.min(b * 2, s.pr[k] * (1 + (Math.random() - 0.5) * 0.14))) }
  edge('debt', s.cr < 0)
  if (s.cr < 0) add('debt')
  s.mor = Math.max(0, Math.min(100, s.mor)); s.pop = Math.max(0, s.pop); s.energy = Math.min(s.energy, (s.b.battery || 0) * BATCAP)
  { const l = clampStore(s); edge('loss', l.food >= 1 || l.min >= 1); if (l.food > 0 || l.min > 0) add('loss', { f: l.food, m: l.min }) }
  if (s.rs && c.resProd > 0) {
    const k = s.rs, t = TECH[k]
    s.rp[k] = (s.rp[k] || 0) + c.resProd
    if (s.rp[k] >= t.c) {
      stops.add('research'); s.tech[k] = 1; delete s.rp[k]; s.rs = null
      note('★ Naukowcy ukończyli projekt: ' + t.n + '! ' + t.d + '. Wybierz kolejny w zakładce NAUKA.', 'pos'); beep(990, 0.15)
    }
  } else if (!s.rs && c.resProd > 0 && nextTech(s)) add('nores')
  edge('nores', !s.rs && c.resProd > 0 && nextTech(s))
  edge('hunger', deaths > 0)
  s.was = now
  s.m++

  if (acc && Array.isArray(s.report)) { mergeRep(s.report, r); s.repDays = (s.repDays || 1) + 1 }
  else { s.report = r; s.repDays = 1 }

  if (s.pop >= GOAL) s.over = { win: true, t: 'ZWYCIĘSTWO!', d: 'Kolonia osiągnęła ' + GOAL + ' mieszkańców. Rada Ziemi przyznaje ci order Pioniera.' }
  else if (s.pop < 10) s.over = { win: false, t: 'KOLONIA UPADŁA', d: 'Zostało zbyt mało osadników, by przetrwać.' }
  else if (s.mor <= 5) s.over = { win: false, t: 'BUNT!', d: 'Koloniści przejęli władzę i odesłali cię na Ziemię.' }
  else if (s.cr < -500) s.over = { win: false, t: 'BANKRUCTWO', d: 'Długi przekroczyły 500 kredytów. Korporacja przejmuje kolonię.' }
  else if (s.m > DAYS) s.over = { win: false, t: 'KONIEC KADENCJI', d: 'Minął rok. Nie osiągnąłeś celu, ale kolonia przetrwała.' }
  if (s.over) stops.add('over')
  return [...stops]
}
